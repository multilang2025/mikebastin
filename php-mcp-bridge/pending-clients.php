<?php
// pending-clients.php — admin-only diagnostic. Lists every OAuth client
// that is NOT full_access, along with whatever it's already been granted.
// Use this to find the client_id of a new connection waiting on approval,
// then hand it to grant-access.php.
//
// IMPORTANT: change ADMIN_SECRET below to a private value before deploying
// this file, and do not commit the real value back into git. Anyone who
// knows this secret can see every client_id and every site's URL (not
// credentials) that's ever asked to connect.

define('ADMIN_SECRET', 'CHANGE-ME-BEFORE-DEPLOYING');

require_once __DIR__ . '/db.php';

header('Content-Type: text/plain; charset=utf-8');

$secret = $_GET['secret'] ?? '';
if (!hash_equals(ADMIN_SECRET, $secret)) {
    http_response_code(403);
    echo "Forbidden.\n";
    exit;
}

$db = get_db();

$clients = $db->query('SELECT client_id, created_at FROM oauth_clients WHERE full_access = 0 ORDER BY created_at DESC')->fetchAll();

if (!$clients) {
    echo "No restricted clients waiting -- either none have connected yet, or every one has already been granted full access.\n";
    exit;
}

foreach ($clients as $c) {
    $stmt = $db->prepare('
        SELECT s.wp_url FROM client_sites cs
        INNER JOIN sites s ON s.token = cs.site_token
        WHERE cs.client_id = ?
        ORDER BY cs.granted_at ASC
    ');
    $stmt->execute([$c['client_id']]);
    $granted = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo 'client_id: ' . $c['client_id'] . "\n";
    echo '  first seen: ' . date('Y-m-d H:i:s', (int) $c['created_at']) . " UTC\n";
    if ($granted) {
        echo '  currently granted: ' . implode(', ', $granted) . "\n";
    } else {
        echo "  currently granted: (nothing yet -- this connection can't complete authorization)\n";
    }
    echo "\n";
}

echo "To grant one of these access to a site, use grant-access.php?secret=...&client_id=...&site=...\n";
