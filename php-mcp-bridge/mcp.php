<?php
// mcp.php
// MCP endpoint: SSE stream (Claude Desktop/Code) + Streamable HTTP POST (Claude.ai web).
// Auth: ?token= for direct connections, Authorization: Bearer for OAuth connections.

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/mcp-router.php';

// CORS — Claude.ai web sends cross-origin requests.
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type, Accept');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$db   = get_db();
$site = null;
$site_token_for_url = null; // internal site token, used in the SSE message endpoint URL

// Accept ?token= (direct) OR Authorization: Bearer (OAuth).
$url_token = $_GET['token'] ?? '';
if ($url_token) {
    $stmt = $db->prepare('SELECT * FROM sites WHERE token = ?');
    $stmt->execute([$url_token]);
    $site = $stmt->fetch();
    $site_token_for_url = $url_token;
} else {
    $auth_header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    // Apache sometimes hides Authorization; fall back to getallheaders().
    if (!$auth_header && function_exists('getallheaders')) {
        $hdrs        = getallheaders();
        $auth_header = $hdrs['Authorization'] ?? $hdrs['authorization'] ?? '';
    }
    if (preg_match('/^Bearer\s+(.+)$/i', $auth_header, $m)) {
        $bearer = trim($m[1]);
        $stmt   = $db->prepare('SELECT site_token FROM oauth_tokens WHERE access_token = ? AND expires_at > ?');
        $stmt->execute([$bearer, time()]);
        $row = $stmt->fetch();
        if ($row) {
            $stmt2 = $db->prepare('SELECT * FROM sites WHERE token = ?');
            $stmt2->execute([$row['site_token']]);
            $site               = $stmt2->fetch();
            $site_token_for_url = $row['site_token'];
        }
    }
}

if (!$site) {
    $proto      = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host       = $_SERVER['HTTP_HOST'];
    $script_dir = dirname($_SERVER['SCRIPT_FILENAME']);
    $doc_root   = rtrim($_SERVER['DOCUMENT_ROOT'], '/');
    $rel_path   = rtrim(str_replace($doc_root, '', $script_dir), '/');
    $base       = $proto . '://' . $host . $rel_path;

    http_response_code(401);
    header('Content-Type: application/json');
    header('WWW-Authenticate: Bearer realm="AISA Bridge", resource_metadata="' . $base . '/.well-known/oauth-protected-resource"');
    echo json_encode(['error' => 'unauthorized', 'error_description' => 'Bearer token required']);
    exit;
}

// --- Streamable HTTP (Claude.ai web): POST with JSON-RPC body ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    $payload  = file_get_contents('php://input');
    $response = handle_mcp_request($site, $payload);
    echo json_encode($response);
    exit;
}

// --- SSE transport (Claude Desktop / Code): GET, keep-alive stream ---
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');

set_time_limit(0);
while (ob_get_level()) {
    ob_end_flush();
}
flush();

$session_id = uniqid('sess_', true);

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $_SERVER['SERVER_PORT'] == 443 ? 'https://' : 'http://';
$domainName = $_SERVER['HTTP_HOST'];
$basePath   = dirname($_SERVER['REQUEST_URI']);
if ($basePath === '/' || $basePath === '\\') {
    $basePath = '';
}
$message_url = $protocol . $domainName . $basePath . '/message.php?token=' . urlencode($site_token_for_url) . '&session_id=' . urlencode($session_id);

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
    $stmt->execute([$site_token_for_url, $session_id]);
    $request = $stmt->fetch();

    if ($request) {
        $db->prepare("UPDATE requests SET status = 'processing' WHERE id = ?")->execute([$request['id']]);

        $response = handle_mcp_request($site, $request['payload']);
        if ($response !== null) {
            send_message($response);
        }

        $db->prepare('DELETE FROM requests WHERE id = ?')->execute([$request['id']]);
    }

    usleep(500000); // 0.5 s
}
