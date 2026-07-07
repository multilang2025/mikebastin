<?php
// mcp.php
// Server-Sent Events (SSE) endpoint for Claude to connect to.

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/mcp-router.php';

if (empty($_GET['token'])) {
    http_response_code(400);
    echo "Missing token";
    exit;
}

$token = $_GET['token'];
$db = get_db();

$stmt = $db->prepare('SELECT * FROM sites WHERE token = ?');
$stmt->execute([$token]);
$site = $stmt->fetch();

if (!$site) {
    http_response_code(401);
    echo "Invalid token";
    exit;
}

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
header('Access-Control-Allow-Origin: *');

set_time_limit(0);

while (ob_get_level()) {
    ob_end_flush();
}
flush();

$session_id = uniqid('sess_', true);

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $_SERVER['SERVER_PORT'] == 443 ? "https://" : "http://";
$domainName = $_SERVER['HTTP_HOST'];
$basePath = dirname($_SERVER['REQUEST_URI']);
if ($basePath === '/' || $basePath === '\\') {
    $basePath = '';
}
$message_url = $protocol . $domainName . $basePath . '/message.php?token=' . urlencode($token) . '&session_id=' . urlencode($session_id);

echo "event: endpoint\n";
echo "data: " . $message_url . "\n\n";
flush();

function send_message($data) {
    echo "data: " . json_encode($data) . "\n\n";
    flush();
}

while (true) {
    if (connection_aborted()) {
        break;
    }
    
    $stmt = $db->prepare("SELECT id, payload FROM requests WHERE token = ? AND session_id = ? AND status = 'pending' ORDER BY id ASC LIMIT 1");
    $stmt->execute([$token, $session_id]);
    $request = $stmt->fetch();
    
    if ($request) {
        $updateStmt = $db->prepare("UPDATE requests SET status = 'processing' WHERE id = ?");
        $updateStmt->execute([$request['id']]);
        
        $response = handle_mcp_request($site, $request['payload']);
        
        if ($response !== null) {
            send_message($response);
        }
        
        $delStmt = $db->prepare("DELETE FROM requests WHERE id = ?");
        $delStmt->execute([$request['id']]);
    }
    
    usleep(500000); // 0.5s
}
