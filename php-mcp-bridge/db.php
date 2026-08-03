<?php
// db.php
// Initializes and provides access to the SQLite database for the PHP MCP Bridge.

define('DB_FILE', __DIR__ . '/bridge.sqlite');

function get_db() {
    $db = new PDO('sqlite:' . DB_FILE);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
    // Create tables if they don't exist
    $db->exec("
        CREATE TABLE IF NOT EXISTS sites (
            token TEXT PRIMARY KEY,
            wp_url TEXT NOT NULL,
            wp_username TEXT NOT NULL,
            wp_app_password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            token TEXT NOT NULL,
            session_id TEXT NOT NULL,
            payload TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            response TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS oauth_codes (
            code TEXT PRIMARY KEY,
            redirect_uri TEXT NOT NULL,
            code_challenge TEXT NOT NULL,
            code_challenge_method TEXT NOT NULL DEFAULT 'S256',
            state TEXT,
            site_token TEXT,
            expires_at INTEGER NOT NULL,
            used INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS oauth_tokens (
            access_token TEXT PRIMARY KEY,
            refresh_token TEXT,
            site_token TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            expires_at INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS oauth_clients (
            client_id TEXT PRIMARY KEY,
            redirect_uris TEXT NOT NULL,
            created_at INTEGER NOT NULL
        );
    ");

    // Migrations for databases created before newer features. Each ALTER is a
    // harmless no-op once its column exists.
    foreach (
        [
            'ALTER TABLE oauth_codes ADD COLUMN site_token TEXT',
            'ALTER TABLE oauth_tokens ADD COLUMN refresh_token TEXT',
            'ALTER TABLE oauth_tokens ADD COLUMN home_site_token TEXT',
        ] as $migration
    ) {
        try {
            $db->exec($migration);
        } catch (Throwable $e) {
            // Column already exists — ignore.
        }
    }

    // Backfill home_site_token for tokens issued before multi-site switching
    // existed — their "home" is whatever site they were originally bound to.
    $db->exec('UPDATE oauth_tokens SET home_site_token = site_token WHERE home_site_token IS NULL');

    $db->exec("
        CREATE TABLE IF NOT EXISTS site_switch_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            access_token_suffix TEXT NOT NULL,
            from_site_token TEXT,
            to_site_token TEXT NOT NULL,
            created_at INTEGER NOT NULL
        );
    ");

    // Structural guard against the duplicate-registration bug register.php
    // used to have (always INSERT, never upsert by wp_url): once any
    // pre-existing duplicates are cleaned up (see dedupe-sites.php), this
    // makes it impossible for the same wp_url to be inserted twice again.
    // Silently fails (and keeps retrying on every request) for as long as
    // duplicates still exist -- that's expected, not an error to act on.
    try {
        $db->exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_sites_wp_url ON sites(wp_url)');
    } catch (Throwable $e) {
        // Duplicates still present -- index creation is retried on every
        // request until dedupe-sites.php clears them.
    }

    return $db;
}

// Generate a secure random token
function generate_token() {
    return bin2hex(random_bytes(16));
}
