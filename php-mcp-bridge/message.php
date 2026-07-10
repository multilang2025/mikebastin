<?php
// message.php
// Receives POST JSON-RPC requests from Claude and queues them for the SSE loop.

require_once __DIR__ . '/db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

if (empty($_GET['token']) || empty($_GET['session_id'])) {
    http_response_code(400);
    echo "Missing token or session_id";
    exit;
}

$token = $_GET['token'];
$session_id = $_GET['session_id'];

$payload = file_get_contents('php://input');

if (!$payload) {
    http_response_code(400);
    echo "Empty payload";
    exit;
}

$db = get_db();

// Insert the request into the DB for the mcp.php loop to pick up
$stmt = $db->prepare('INSERT INTO requests (token, session_id, payload) VALUES (?, ?, ?)');
$stmt->execute([$token, $session_id, $payload]);

// MCP HTTP Transport spec requires a 202 Accepted response for POST messages.
http_response_code(202);
header('Content-Type: text/plain');
echo "Accepted";
