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

    // Migration: add site_token to oauth_codes on databases created before
    // multi-tenant support. Harmless no-op once the column exists.
    try {
        $db->exec('ALTER TABLE oauth_codes ADD COLUMN site_token TEXT');
    } catch (Throwable $e) {
        // Column already exists — ignore.
    }

    return $db;
}

// Generate a secure random token
function generate_token() {
    return bin2hex(random_bytes(16));
}
