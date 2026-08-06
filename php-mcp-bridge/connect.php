<?php
// connect.php
// Entry point for the connect_site link (see mcp-router.php's connect_site
// tool). Redirects the browser to the TARGET WordPress site's own native
// "Authorize Application" screen (wp-admin/authorize-application.php, core
// since WP 5.6) -- the same mechanism WPVibe uses. WordPress itself handles
// the actual login/consent; this bridge never sees a password until the
// site redirects back to connect-callback.php with one.

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/page.php';

$token = $_GET['token'] ?? '';
if (!$token) {
    render_page('Missing link', '⚠️', 'Missing link', '<p>This link is missing its token. Ask Claude to generate a new one.</p>', 'error');
    exit;
}

$db   = get_db();
$stmt = $db->prepare('SELECT * FROM pending_connections WHERE token = ?');
$stmt->execute([$token]);
$row = $stmt->fetch();

if (!$row) {
    http_response_code(404);
    render_page('Invalid link', '⚠️', 'This link isn\'t valid', '<p>Ask Claude to generate a new connection link.</p>', 'error');
    exit;
}
if ($row['fulfilled']) {
    http_response_code(410);
    render_page('Already used', '✅', 'This link has already been used', '<p>If you need to reconnect, ask Claude to generate a new one.</p>', 'error');
    exit;
}
if ($row['expires_at'] < time()) {
    http_response_code(410);
    render_page('Link expired', '⏱️', 'This link has expired', '<p>Connection links last 1 hour. Ask Claude to generate a new one.</p>', 'error');
    exit;
}

$success_url = bridge_base_url() . '/connect-callback.php?token=' . urlencode($token);

$authorize_url = rtrim($row['site_url'], '/') . '/wp-admin/authorize-application.php'
    . '?app_name=' . urlencode('AISA Connector')
    . '&app_id=' . urlencode($row['wp_app_id'])
    . '&success_url=' . urlencode($success_url);

header('Location: ' . $authorize_url);
exit;
