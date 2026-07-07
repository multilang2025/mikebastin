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
$token = generate_token();

$stmt = $db->prepare('INSERT INTO sites (token, wp_url, wp_username, wp_app_password) VALUES (?, ?, ?, ?)');
$stmt->execute([
    $token,
    rtrim($input['wp_url'], '/'),
    $input['wp_username'],
    $input['wp_app_password']
]);

// Return the connection endpoint to the WordPress site
$bridge_url = 'https://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) . '/mcp.php?token=' . $token;

echo json_encode([
    'success' => true,
    'token' => $token,
    'connection_url' => $bridge_url
]);
