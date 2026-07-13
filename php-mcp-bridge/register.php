<?php
// register.php
// Receives WordPress credentials and returns a unique connection token.

require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['wp_url']) || empty($input['wp_username']) || empty($input['wp_app_password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$db = get_db();
$wp_url = rtrim($input['wp_url'], '/');

// Upsert by wp_url: re-clicking "Connect" for a site you've already
// registered used to always INSERT a fresh row, so any repeated testing
// piled up duplicate entries with the same wp_url and different tokens --
// each showing up as its own line in the OAuth "choose a site" picker.
// Update the existing row in place instead, and keep its original token
// so any OAuth authorization already issued for this site keeps working.
$existing = $db->prepare('SELECT token FROM sites WHERE wp_url = ?');
$existing->execute([$wp_url]);
$row = $existing->fetch();

if ($row) {
    $token = $row['token'];
    $db->prepare('UPDATE sites SET wp_username = ?, wp_app_password = ? WHERE token = ?')
       ->execute([$input['wp_username'], $input['wp_app_password'], $token]);
} else {
    $token = generate_token();
    $db->prepare('INSERT INTO sites (token, wp_url, wp_username, wp_app_password) VALUES (?, ?, ?, ?)')
       ->execute([$token, $wp_url, $input['wp_username'], $input['wp_app_password']]);
}

// Return the connection endpoint to the WordPress site
$bridge_url = 'https://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) . '/mcp.php?token=' . $token;

echo json_encode([
    'success' => true,
    'token' => $token,
    'connection_url' => $bridge_url
]);
