<?php
// oauth-test.php — diagnostic page. DELETE after debugging.
// Hit https://www.betranslated.us/php-mcp-bridge/oauth-test.php in browser.

header('Content-Type: text/plain; charset=utf-8');

$ok = true;

// 1. PDO SQLite available?
echo "PDO SQLite: ";
if (!in_array('sqlite', PDO::getAvailableDrivers())) {
    echo "MISSING — install php-pdo-sqlite\n";
    $ok = false;
} else {
    echo "OK\n";
}

// 2. DB file writable?
$db_file = __DIR__ . '/bridge.sqlite';
echo "DB file: $db_file\n";
echo "DB writable: " . (is_writable(dirname($db_file)) ? "YES" : "NO — fix directory permissions") . "\n";

// 3. Can open DB and query tables?
try {
    require_once __DIR__ . '/db.php';
    $db = get_db();
    $tables = $db->query("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")->fetchAll(PDO::FETCH_COLUMN);
    echo "Tables: " . implode(', ', $tables) . "\n";
    $has_clients = in_array('oauth_clients', $tables);
    echo "oauth_clients table: " . ($has_clients ? "OK" : "MISSING") . "\n";
} catch (Throwable $e) {
    echo "DB error: " . $e->getMessage() . "\n";
    $ok = false;
}

// 4. Simulate a registration insert
try {
    $client_id = bin2hex(random_bytes(4)) . '-test';
    $db->prepare('INSERT INTO oauth_clients (client_id, redirect_uris, created_at) VALUES (?, ?, ?)')
       ->execute([$client_id, json_encode(['https://example.com/cb']), time()]);
    $db->prepare('DELETE FROM oauth_clients WHERE client_id = ?')->execute([$client_id]);
    echo "Registration insert: OK\n";
} catch (Throwable $e) {
    echo "Registration insert FAILED: " . $e->getMessage() . "\n";
    $ok = false;
}

echo "\n" . ($ok ? "ALL OK — registration should work." : "ERRORS FOUND — see above.") . "\n";
