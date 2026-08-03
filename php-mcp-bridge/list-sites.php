<?php
// list-sites.php — admin-only diagnostic. Shows every registered site and
// whether it currently has a live OAuth access token.
//
// Usage: list-sites.php?secret=...
//
// IMPORTANT: change ADMIN_SECRET below to a private value before deploying
// this file (same value as pending-clients.php/grant-access.php/
// grant-full-access.php), and do not commit the real value back into git.

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
$sites = $db->query('SELECT * FROM sites ORDER BY wp_url')->fetchAll();

echo 'Total sites registered: ' . count($sites) . "\n\n";

foreach ($sites as $s) {
    $used = $db->prepare('SELECT COUNT(*) c FROM oauth_tokens WHERE site_token = ? AND expires_at > ?');
    $used->execute([$s['token'], time()]);
    $active_tokens = (int) $used->fetch()['c'];

    echo $s['wp_url'] . "\n";
    echo '  token: ' . substr($s['token'], 0, 12) . "...\n";
    echo '  username: ' . $s['wp_username'] . "\n";
    echo '  registered: ' . $s['created_at'] . "\n";
    echo '  active OAuth tokens for this site: ' . $active_tokens . "\n\n";
}

echo 'Total OAuth access tokens (all sites): ' . $db->query('SELECT COUNT(*) c FROM oauth_tokens')->fetch()['c'] . "\n";
