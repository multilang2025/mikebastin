<?php
// connect-callback.php
// Receives the redirect back from a WordPress site's native
// "Authorize Application" screen (see connect.php). WordPress appends
// user_login and password as query params on success, or reject=1 if the
// user clicked "No, I do not approve of this connection".
//
// The target site is looked up from pending_connections by token -- never
// trusted from a query param -- so this can't be tricked into registering
// credentials against a site other than the one connect_site actually
// generated the link for.

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
    echo 'This connection link is invalid.';
    exit;
}
if ($row['fulfilled']) {
    http_response_code(410);
    echo 'This connection link has already been used.';
    exit;
}
if ($row['expires_at'] < time()) {
    http_response_code(410);
    echo 'This connection link has expired.';
    exit;
}

// WordPress signals a decline via success=false on the redirect (confirmed
// from a real WPVibe screenshot: "...&success=false" on the "No" button).
// Falling back to "no user_login/password present" covers it either way,
// in case that param's exact name/value ever changes on WordPress's side.
if (($_GET['success'] ?? '') === 'false' || !isset($_GET['user_login']) || !isset($_GET['password'])) {
    header('Content-Type: text/plain; charset=utf-8');
    echo "Connection declined. Nothing was registered -- ask Claude to generate a new link if you change your mind.\n";
    exit;
}

$wp_username     = $_GET['user_login'];
$wp_app_password = $_GET['password'];

upsert_site($db, $row['site_url'], $wp_username, $wp_app_password);
$db->prepare('UPDATE pending_connections SET fulfilled = 1 WHERE token = ?')->execute([$token]);

header('Content-Type: text/plain; charset=utf-8');
echo "Connected! {$row['site_url']} is now registered with this bridge.\n";
echo "Go back to your Claude chat -- it's ready to use.\n";
