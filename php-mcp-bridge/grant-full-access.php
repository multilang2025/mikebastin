<?php
// grant-full-access.php — admin-only. Promotes one OAuth client_id to
// full_access, giving it the same unrestricted, always-current reach to
// every registered site (including ones registered later) that your own
// trusted connections already have. Use this instead of looping
// grant-access.php over every site when you want to give a client
// everything rather than a specific list.
//
// Usage: grant-full-access.php?secret=...&client_id=...
//
// IMPORTANT: change ADMIN_SECRET below to a private value before deploying
// this file, and do not commit the real value back into git. Anyone who
// knows this secret can give any client unrestricted access to every site.

define('ADMIN_SECRET', 'CHANGE-ME-BEFORE-DEPLOYING');

require_once __DIR__ . '/db.php';

header('Content-Type: text/plain; charset=utf-8');

$secret = $_GET['secret'] ?? $_POST['secret'] ?? '';
if (!hash_equals(ADMIN_SECRET, $secret)) {
    http_response_code(403);
    echo "Forbidden.\n";
    exit;
}

$client_id = trim($_GET['client_id'] ?? $_POST['client_id'] ?? '');

if (!$client_id) {
    http_response_code(400);
    echo "Usage: grant-full-access.php?secret=...&client_id=...\n";
    exit;
}

$db = get_db();

$stmt = $db->prepare('SELECT full_access FROM oauth_clients WHERE client_id = ?');
$stmt->execute([$client_id]);
$row = $stmt->fetch();

if (!$row) {
    http_response_code(404);
    echo "No OAuth client with that client_id has ever registered on this bridge. Check pending-clients.php.\n";
    exit;
}

if ((int) $row['full_access'] === 1) {
    echo "$client_id already has full access.\n";
    exit;
}

$db->prepare('UPDATE oauth_clients SET full_access = 1 WHERE client_id = ?')->execute([$client_id]);

// Any per-site grants from client_sites become moot once full_access is set
// (get_allowed_sites() returns every site regardless), so they're left in
// place rather than deleted -- harmless, and they'd matter again if this
// client were ever demoted back to restricted.
echo "Done. $client_id now has full access to every registered site, including any registered later.\n";
