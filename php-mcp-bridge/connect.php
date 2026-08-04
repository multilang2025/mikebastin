<?php
// connect.php
// Entry point for the connect_site link (see mcp-router.php's connect_site
// tool). Redirects the browser to the TARGET WordPress site's own native
// "Authorize Application" screen (wp-admin/authorize-application.php, core
// since WP 5.6) -- the same mechanism WPVibe uses. WordPress itself handles
// the actual login/consent; this bridge never sees a password until the
// site redirects back to connect-callback.php with one.

require_once __DIR__ . '/db.php';

$token = $_GET['token'] ?? '';
if (!$token) {
    http_response_code(400);
    echo 'Missing token.';
    exit;
}

$db   = get_db();
$stmt = $db->prepare('SELECT * FROM pending_connections WHERE token = ?');
$stmt->execute([$token]);
$row = $stmt->fetch();

if (!$row) {
    http_response_code(404);
    echo 'This connection link is invalid. Ask Claude to generate a new one.';
    exit;
}
if ($row['fulfilled']) {
    http_response_code(410);
    echo 'This connection link has already been used. Ask Claude to generate a new one if you need to reconnect.';
    exit;
}
if ($row['expires_at'] < time()) {
    http_response_code(410);
    echo 'This connection link has expired (links last 1 hour). Ask Claude to generate a new one.';
    exit;
}

$success_url = bridge_base_url() . '/connect-callback.php?token=' . urlencode($token);

$authorize_url = rtrim($row['site_url'], '/') . '/wp-admin/authorize-application.php'
    . '?app_name=' . urlencode('AISA Connector')
    . '&app_id=' . urlencode($row['wp_app_id'])
    . '&success_url=' . urlencode($success_url);

header('Location: ' . $authorize_url);
exit;
