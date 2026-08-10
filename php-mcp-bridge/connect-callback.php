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
require_once __DIR__ . '/page.php';

$token = $_GET['token'] ?? '';
if (!$token) {
    render_page('Missing link', '⚠️', 'Missing link', '<p>This link is missing its token.</p>', 'error');
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

// WordPress signals a decline via success=false on the redirect (confirmed
// from a real WPVibe screenshot: "...&success=false" on the "No" button).
// Falling back to "no user_login/password present" covers it either way,
// in case that param's exact name/value ever changes on WordPress's side.
if (($_GET['success'] ?? '') === 'false' || !isset($_GET['user_login']) || !isset($_GET['password'])) {
    render_page(
        'Connection declined',
        '🚫',
        'Connection declined',
        '<p>Nothing was registered. Ask Claude to generate a new link if you change your mind.</p>',
        'error'
    );
    exit;
}

$wp_username     = $_GET['user_login'];
$wp_app_password = $_GET['password'];

$site_token = upsert_site($db, $row['site_url'], $wp_username, $wp_app_password);
$db->prepare('UPDATE pending_connections SET fulfilled = 1 WHERE token = ?')->execute([$token]);

// Auto-bind + auto-grant the exact connection that generated this link --
// this is what makes skipping admin approval for connect_site safe: a
// self-service client only ever ends up scoped to the one site it
// personally connected, never to any other site already on this bridge.
if (!empty($row['access_token'])) {
    $stmt = $db->prepare('SELECT client_id, site_token AS previous_site_token FROM oauth_tokens WHERE access_token = ?');
    $stmt->execute([$row['access_token']]);
    $token_row = $stmt->fetch();

    if ($token_row) {
        $db->prepare('UPDATE oauth_tokens SET site_token = ? WHERE access_token = ?')
           ->execute([$site_token, $row['access_token']]);
        $db->prepare('INSERT INTO site_switch_log (access_token_suffix, from_site_token, to_site_token, created_at) VALUES (?, ?, ?, ?)')
           ->execute([substr($row['access_token'], -8), $token_row['previous_site_token'] ?: null, $site_token, time()]);

        // This request is a plain browser redirect, not an open MCP
        // connection -- it can't call send_message() itself. Queue the
        // notification under mcp.php's SSE polling loop instead (see the
        // '__broadcast__' handling there) so a live Claude Desktop/Code
        // session for this site picks it up and re-fetches tools/list
        // without needing a full disconnect/reconnect. The Streamable-HTTP
        // (Claude.ai web) transport has no open channel to deliver this on
        // and won't see it -- that transport still needs the tools/list
        // race avoided up front, e.g. via the direct ?token= connect flow.
        //
        // Queued under the PREVIOUS site_token, not the new one: an SSE
        // loop already running captured its polling token once, at
        // connection-open time, before this rebind ever happened, and never
        // re-reads it for the life of that request -- it's still polling
        // under whatever site_token (usually '' for an unbound self-service
        // client) was true back then.
        $db->prepare("INSERT INTO requests (token, session_id, payload, status, created_at) VALUES (?, '__broadcast__', ?, 'pending', NOW())")
           ->execute([(string) $token_row['previous_site_token'], json_encode(['jsonrpc' => '2.0', 'method' => 'notifications/tools/list_changed'])]);

        $client_id = $token_row['client_id'] ?? '';
        if ($client_id) {
            $stmt = $db->prepare('SELECT full_access FROM oauth_clients WHERE client_id = ?');
            $stmt->execute([$client_id]);
            $client_row = $stmt->fetch();
            $is_full_access = $client_row && (int) $client_row['full_access'] === 1;

            if (!$is_full_access) {
                $stmt = $db->prepare('SELECT 1 FROM client_sites WHERE client_id = ? AND site_token = ?');
                $stmt->execute([$client_id, $site_token]);
                if (!$stmt->fetch()) {
                    $db->prepare('INSERT INTO client_sites (client_id, site_token, granted_at) VALUES (?, ?, ?)')
                       ->execute([$client_id, $site_token, time()]);
                }
            }
        }
    }
}

render_page(
    'Connected',
    '✅',
    'Connected!',
    '<p class="pill">' . htmlspecialchars($row['site_url']) . '</p>'
        . '<p>This site is now registered with the bridge.</p>'
        . '<p>Go back to your Claude chat — it\'s ready to use.</p>',
    'success'
);
