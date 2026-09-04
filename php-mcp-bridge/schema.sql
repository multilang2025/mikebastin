-- schema.sql
-- Reference copy of the schema db.php creates automatically at runtime.
-- Safe to run directly in Supabase's SQL editor ahead of time -- every
-- statement is idempotent (CREATE ... IF NOT EXISTS), and everything is
-- schema-qualified so it never touches "public" or anything else already
-- in this Supabase project.

CREATE SCHEMA IF NOT EXISTS aisa_bridge;

CREATE TABLE IF NOT EXISTS aisa_bridge.sites (
    token TEXT PRIMARY KEY,
    wp_url TEXT NOT NULL,
    wp_username TEXT NOT NULL,
    wp_app_password TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS aisa_bridge.requests (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    session_id TEXT NOT NULL,
    payload TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    response TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS aisa_bridge.oauth_codes (
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

CREATE TABLE IF NOT EXISTS aisa_bridge.oauth_tokens (
    access_token TEXT PRIMARY KEY,
    refresh_token TEXT,
    site_token TEXT NOT NULL,
    home_site_token TEXT,
    client_id TEXT,
    created_at BIGINT NOT NULL,
    expires_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS aisa_bridge.oauth_clients (
    client_id TEXT PRIMARY KEY,
    redirect_uris TEXT NOT NULL,
    -- New registrations always pass full_access explicitly (see
    -- oauth-register.php, which sets 0) -- this default is only a safety
    -- net, never the actual access decision.
    full_access INTEGER NOT NULL DEFAULT 1,
    created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS aisa_bridge.site_switch_log (
    id SERIAL PRIMARY KEY,
    access_token_suffix TEXT NOT NULL,
    from_site_token TEXT,
    to_site_token TEXT NOT NULL,
    created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS aisa_bridge.client_sites (
    client_id TEXT NOT NULL,
    site_token TEXT NOT NULL,
    granted_at BIGINT NOT NULL,
    PRIMARY KEY (client_id, site_token)
);

CREATE TABLE IF NOT EXISTS aisa_bridge.pending_connections (
    token TEXT PRIMARY KEY,
    site_url TEXT NOT NULL,
    wp_app_id TEXT NOT NULL,
    access_token TEXT,
    created_at BIGINT NOT NULL,
    expires_at BIGINT NOT NULL,
    fulfilled INTEGER NOT NULL DEFAULT 0
);

-- One row per MCP session that has called switch_site -- see db.php for why
-- this exists (per-chat site isolation instead of one shared default per
-- OAuth access_token).
CREATE TABLE IF NOT EXISTS aisa_bridge.session_sites (
    session_key TEXT PRIMARY KEY,
    access_token TEXT NOT NULL,
    site_token TEXT NOT NULL,
    updated_at BIGINT NOT NULL
);

-- Guards against the duplicate-registration bug register.php used to have
-- (always INSERT, never upsert by wp_url) -- makes the same wp_url
-- impossible to register twice.
CREATE UNIQUE INDEX IF NOT EXISTS idx_sites_wp_url ON aisa_bridge.sites(wp_url);

-- Supabase enables Row-Level Security automatically on new tables, even
-- outside "public". With zero policies defined, RLS blocks everything --
-- including the table's own owner, in practice. This bridge already does
-- all its own access control at the application layer (OAuth scoping,
-- client approval, etc.), so Postgres RLS on top of that would only add
-- friction, not real protection, for a schema no other app ever touches.
ALTER TABLE aisa_bridge.sites DISABLE ROW LEVEL SECURITY;
ALTER TABLE aisa_bridge.requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE aisa_bridge.oauth_codes DISABLE ROW LEVEL SECURITY;
ALTER TABLE aisa_bridge.oauth_tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE aisa_bridge.oauth_clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE aisa_bridge.site_switch_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE aisa_bridge.client_sites DISABLE ROW LEVEL SECURITY;
ALTER TABLE aisa_bridge.pending_connections DISABLE ROW LEVEL SECURITY;
ALTER TABLE aisa_bridge.session_sites DISABLE ROW LEVEL SECURITY;

-- Dedicated role for the app itself, scoped to only this schema -- so this
-- bridge can share a Supabase project with unrelated apps/data without any
-- risk of touching their tables, and without needing the project's main
-- "postgres" role password at all. CREATE SCHEMA is a database-level
-- privilege this role deliberately does NOT have -- the schema above must
-- already exist (this script creates it) before this role can do anything;
-- db.php never tries to create it at runtime, only to use it.
CREATE ROLE aisa_bridge_user WITH LOGIN PASSWORD 'CHANGE-ME';

GRANT USAGE, CREATE ON SCHEMA aisa_bridge TO aisa_bridge_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA aisa_bridge TO aisa_bridge_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA aisa_bridge GRANT ALL PRIVILEGES ON TABLES TO aisa_bridge_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA aisa_bridge TO aisa_bridge_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA aisa_bridge GRANT ALL PRIVILEGES ON SEQUENCES TO aisa_bridge_user;

-- Use aisa_bridge_user.<your-project-ref> as DB_USER in config.php when
-- connecting through Supabase's pooler (the project-ref suffix is only for
-- the pooler to route the connection; the underlying role is just
-- aisa_bridge_user).
