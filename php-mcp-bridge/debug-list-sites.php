<?php
// debug-list-sites.php — ONE-TIME diagnostic. Runs the exact same code path
// as an authenticated list_sites call, but prints the real PHP error (if
// any) directly on the page instead of relying on finding it in a log.
// DELETE this file after use -- it's not secret-gated like the other admin
// scripts, since the whole point is to work even if something upstream of
// normal auth is broken.
//
// Usage: debug-list-sites.php  (no params needed)

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/mcp-router.php';

header('Content-Type: text/plain; charset=utf-8');

try {
    $db = get_db();
    echo "1. get_db() succeeded.\n";

    $site = $db->query('SELECT * FROM sites ORDER BY created_at ASC LIMIT 1')->fetch();
    if (!$site) {
        echo "No sites registered -- can't continue.\n";
        exit;
    }
    echo "2. Using site: {$site['wp_url']}\n";

    $sites = get_allowed_sites(null);
    echo "3. get_allowed_sites(null) succeeded, returned " . count($sites) . " site(s).\n";

    $target_site = $site;
    $result = execute_tool($site, 'list_sites', [], $sites, null, $target_site);
    echo "4. execute_tool('list_sites', ...) succeeded:\n";
    echo json_encode($result, JSON_PRETTY_PRINT) . "\n";

    echo "\nAll steps succeeded -- the code path itself is fine on this server.\n";
} catch (Throwable $e) {
    echo "\n--- FAILED ---\n";
    echo 'Type: ' . get_class($e) . "\n";
    echo 'Message: ' . $e->getMessage() . "\n";
    echo 'File: ' . $e->getFile() . ':' . $e->getLine() . "\n";
    echo "Trace:\n" . $e->getTraceAsString() . "\n";
}
