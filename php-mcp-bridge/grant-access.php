<?php
// grant-access.php — admin-only. Grants one OAuth client_id access to one
// registered site. Use pending-clients.php first to find the client_id of
// a connection waiting on approval.
//
// Usage: grant-access.php?secret=...&client_id=...&site=example.com
//
// IMPORTANT: change ADMIN_SECRET below to a private value before deploying
// this file, and do not commit the real value back into git. Anyone who
// knows this secret can grant any client access to any registered site.

define('ADMIN_SECRET', 'CHANGE-ME-BEFORE-DEPLOYING');

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/mcp-router.php';

header('Content-Type: text/plain; charset=utf-8');

$secret = $_GET['secret'] ?? $_POST['secret'] ?? '';
if (!hash_equals(ADMIN_SECRET, $secret)) {
    http_response_code(403);
    echo "Forbidden.\n";
    exit;
}

$client_id = trim($_GET['client_id'] ?? $_POST['client_id'] ?? '');
$site_arg  = trim($_GET['site'] ?? $_POST['site'] ?? '');

if (!$client_id || !$site_arg) {
    http_response_code(400);
    echo "Usage: grant-access.php?secret=...&client_id=...&site=example.com\n";
    exit;
}

$db = get_db();

$stmt = $db->prepare('SELECT client_id FROM oauth_clients WHERE client_id = ?');
$stmt->execute([$client_id]);
if (!$stmt->fetch()) {
    http_response_code(404);
    echo "No OAuth client with that client_id has ever registered on this bridge. Check pending-clients.php.\n";
    exit;
}

try {
    $site = resolve_site($site_arg, get_all_sites());
} catch (Exception $e) {
    http_response_code(400);
    echo $e->getMessage() . "\n";
    exit;
}

$stmt = $db->prepare('SELECT 1 FROM client_sites WHERE client_id = ? AND site_token = ?');
$stmt->execute([$client_id, $site['token']]);
if ($stmt->fetch()) {
    echo "Already granted: $client_id can already reach {$site['wp_url']}.\n";
    exit;
}

$db->prepare('INSERT INTO client_sites (client_id, site_token, granted_at) VALUES (?, ?, ?)')
   ->execute([$client_id, $site['token'], time()]);

echo "Granted: $client_id can now reach {$site['wp_url']}.\n";

$stmt = $db->prepare('
    SELECT s.wp_url FROM client_sites cs
    INNER JOIN sites s ON s.token = cs.site_token
    WHERE cs.client_id = ?
    ORDER BY cs.granted_at ASC
');
$stmt->execute([$client_id]);
$granted = $stmt->fetchAll(PDO::FETCH_COLUMN);
echo 'This client can now reach: ' . implode(', ', $granted) . "\n";
