<?php
// db.php
// Initializes and provides access to the Postgres (Supabase) database for
// the PHP MCP Bridge. Everything lives in its own schema (DB_SCHEMA, see
// config.php) instead of "public" -- so it can share a Supabase project
// with unrelated data, and so the exact same schema can be pointed at from
// a future VPS-hosted Postgres without changing anything else here.
//
// Replaces the previous SQLite-backed version: SQLite locks the whole file
// for any writer, which became a real bottleneck once this bridge grew
// long-lived SSE connections (Claude Desktop/Code) plus more concurrent
// writes per request (client scoping, pending connections, etc.) than the
// original single-site design ever had. Postgres's row-level locking
// removes that specific failure mode.

require_once __DIR__ . '/config.php';

function get_db() {
    $dsn = sprintf('pgsql:host=%s;port=%s;dbname=%s;sslmode=require', DB_HOST, DB_PORT, DB_NAME);
    // EMULATE_PREPARES: if DB_HOST is Supabase's connection pooler (PgBouncer
    // in transaction mode -- the recommended host for a per-request PHP app
    // like this one, since it opens a fresh connection every request),
    // native server-side prepared statements break: a PREPARE and its
    // matching EXECUTE can land on different pooled backend connections.
    // Emulating prepares client-side avoids that entirely. Harmless no-op
    // against a direct (non-pooled) connection.
    $db = new PDO($dsn, DB_USER, DB_PASSWORD, [PDO::ATTR_EMULATE_PREPARES => true]);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // The schema itself is created once via schema.sql / the Supabase SQL
    // editor, not here -- CREATE SCHEMA is a database-level privilege, and
    // the app's own role is deliberately scoped to just this one schema
    // (see the GRANT statements in schema.sql), so it can't run that even
    // as a harmless no-op against an already-existing schema. Every
    // unqualified table name in every other file in this bridge resolves
    // against this schema for the rest of the connection.
    $db->exec('SET search_path TO ' . DB_SCHEMA);

    // Fresh database, so every column this bridge has ever needed goes
    // straight into the initial schema -- no incremental ALTER TABLE
    // history to replay like the old SQLite version had to carry forward.
    $db->exec("
        CREATE TABLE IF NOT EXISTS sites (
            token TEXT PRIMARY KEY,
            wp_url TEXT NOT NULL,
            wp_username TEXT NOT NULL,
            wp_app_password TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS requests (
            id SERIAL PRIMARY KEY,
            token TEXT NOT NULL,
            session_id TEXT NOT NULL,
            payload TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            response TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS oauth_codes (
            code TEXT PRIMARY KEY,
            redirect_uri TEXT NOT NULL,
            code_challenge TEXT NOT NULL,
            code_challenge_method TEXT NOT NULL DEFAULT 'S256',
            state TEXT,
            site_token TEXT,
            client_id TEXT,
            expires_at BIGINT NOT NULL,
            used INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS oauth_tokens (
            access_token TEXT PRIMARY KEY,
            refresh_token TEXT,
            site_token TEXT NOT NULL,
            home_site_token TEXT,
            client_id TEXT,
            created_at BIGINT NOT NULL,
            expires_at BIGINT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS oauth_clients (
            client_id TEXT PRIMARY KEY,
            redirect_uris TEXT NOT NULL,
            -- New registrations always pass full_access explicitly (see
            -- oauth-register.php, which sets 0) -- this default only
            -- matters as a safety net, never as the actual access decision.
            full_access INTEGER NOT NULL DEFAULT 1,
            created_at BIGINT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS site_switch_log (
            id SERIAL PRIMARY KEY,
            access_token_suffix TEXT NOT NULL,
            from_site_token TEXT,
            to_site_token TEXT NOT NULL,
            created_at BIGINT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS client_sites (
            client_id TEXT NOT NULL,
            site_token TEXT NOT NULL,
            granted_at BIGINT NOT NULL,
            PRIMARY KEY (client_id, site_token)
        );

        CREATE TABLE IF NOT EXISTS pending_connections (
            token TEXT PRIMARY KEY,
            site_url TEXT NOT NULL,
            wp_app_id TEXT NOT NULL,
            access_token TEXT,
            created_at BIGINT NOT NULL,
            expires_at BIGINT NOT NULL,
            fulfilled INTEGER NOT NULL DEFAULT 0
        );
    ");

    // Structural guard against the duplicate-registration bug register.php
    // used to have (always INSERT, never upsert by wp_url): makes it
    // impossible for the same wp_url to be inserted twice. Postgres
    // supports IF NOT EXISTS on indexes directly, unlike some other
    // engines, but this stays wrapped in try/catch in case any duplicate
    // rows ever exist when this runs -- same defensive intent as before.
    try {
        $db->exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_sites_wp_url ON sites(wp_url)');
    } catch (Throwable $e) {
        // Duplicates present -- index creation retried on every request
        // until they're cleaned up (see dedupe-sites.php).
    }

    return $db;
}

// Generate a secure random token
function generate_token() {
    return bin2hex(random_bytes(16));
}

// A proper RFC 4122 v4 UUID -- WordPress core's authorize-application.php
// (see connect_site in mcp-router.php) rejects app_id unless it's
// hyphenated in this exact 8-4-4-4-12 shape with the version/variant bits
// set, not just any random hex string.
function generate_uuid_v4() {
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40); // version 4
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80); // variant 10xx
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

// This bridge's own base URL, e.g. https://betranslated.us/php-mcp-bridge --
// derived from the current request rather than hardcoded, so it works
// whichever script (mcp.php, register.php, connect.php, ...) calls it.
function bridge_base_url() {
    $proto = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    return $proto . '://' . $_SERVER['HTTP_HOST'] . rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
}

// Upsert a WordPress site's credentials by wp_url -- shared by register.php
// (the plugin's own "Connect" button) and connect-callback.php (the
// WPVibe-style link flow), so a site re-registered through either path
// keeps its original token rather than piling up duplicate rows.
function upsert_site($db, $wp_url, $wp_username, $wp_app_password) {
    $wp_url = rtrim($wp_url, '/');

    $existing = $db->prepare('SELECT token FROM sites WHERE wp_url = ?');
    $existing->execute([$wp_url]);
    $row = $existing->fetch();

    if ($row) {
        $token = $row['token'];
        $db->prepare('UPDATE sites SET wp_username = ?, wp_app_password = ? WHERE token = ?')
           ->execute([$wp_username, $wp_app_password, $token]);
    } else {
        $token = generate_token();
        $db->prepare('INSERT INTO sites (token, wp_url, wp_username, wp_app_password) VALUES (?, ?, ?, ?)')
           ->execute([$token, $wp_url, $wp_username, $wp_app_password]);
    }

    return $token;
}
