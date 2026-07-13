<?php
// mcp.php
// MCP endpoint: SSE stream (Claude Desktop/Code) + Streamable HTTP POST (Claude.ai web).
// Auth: ?token= for direct connections, Authorization: Bearer for OAuth connections.

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/mcp-router.php';

// CORS — Claude.ai web sends cross-origin requests. Reflect any requested headers
// so that MCP-Protocol-Version and other client headers are never blocked.
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE');
header('Access-Control-Expose-Headers: *');
$req_headers = $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'] ?? '';
header('Access-Control-Allow-Headers: ' . ($req_headers
    ?: 'Authorization, Content-Type, Accept, MCP-Protocol-Version, mcp-protocol-version, mcp-session-id'));

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$db = get_db();
blog('mcp', 'REQUEST v3', [
    'method'  => $_SERVER['REQUEST_METHOD'],
    'ip'      => $_SERVER['REMOTE_ADDR'] ?? '?',
    'auth'    => isset($_SERVER['HTTP_AUTHORIZATION']) ? 'bearer' : (isset($_GET['token']) ? 'token' : 'none'),
    'ua'      => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 80),
]);
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
    // Recover the Authorization header from every place shared hosts stash it.
    $auth_header = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? '';
    if (!$auth_header && function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) {
            if (strcasecmp($k, 'Authorization') === 0) {
                $auth_header = $v;
                break;
            }
        }
    }
    if (!$auth_header && function_exists('apache_request_headers')) {
        foreach (apache_request_headers() as $k => $v) {
            if (strcasecmp($k, 'Authorization') === 0) {
                $auth_header = $v;
                break;
            }
        }
    }
    if (preg_match('/^Bearer\s+(.+)$/i', $auth_header, $m)) {
        $bearer = trim($m[1]);
        $stmt   = $db->prepare('SELECT site_token FROM oauth_tokens WHERE access_token = ? AND expires_at > ?');
        $stmt->execute([$bearer, time()]);
        $row = $stmt->fetch();

        // Diagnostic: what token came in vs. what's stored.
        $all      = $db->query('SELECT access_token, expires_at FROM oauth_tokens')->fetchAll();
        $stored   = array_map(function ($t) {
            return substr($t['access_token'], 0, 12) . '… exp+' . ($t['expires_at'] - time()) . 's';
        }, $all);
        blog('mcp', 'bearer lookup', [
            'recv'    => substr($bearer, 0, 12) . '…(' . strlen($bearer) . ')',
            'matched' => $row ? 'YES' : 'NO',
            'in_db'   => $stored,
            'sites'   => (int) $db->query('SELECT COUNT(*) c FROM sites')->fetch()['c'],
        ]);

        if ($row) {
            $stmt2 = $db->prepare('SELECT * FROM sites WHERE token = ?');
            $stmt2->execute([$row['site_token']]);
            $site               = $stmt2->fetch();
            $site_token_for_url = $row['site_token'];
        }
    } else {
        $server_auth = [];
        foreach ($_SERVER as $k => $v) {
            if (stripos($k, 'auth') !== false) {
                $server_auth[$k] = substr((string) $v, 0, 20);
            }
        }
        $hdr_keys = function_exists('getallheaders') ? array_keys(getallheaders()) : [];
        blog('mcp', 'no bearer match', [
            'auth_len'    => strlen($auth_header),
            'server_auth' => $server_auth,
            'hdr_keys'    => $hdr_keys,
        ]);
    }
}

if (!$site) {
    $proto      = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host       = $_SERVER['HTTP_HOST'];
    $script_dir = dirname($_SERVER['SCRIPT_FILENAME']);
    $doc_root   = rtrim($_SERVER['DOCUMENT_ROOT'], '/');
    $rel_path   = rtrim(str_replace($doc_root, '', $script_dir), '/');
    $base       = $proto . '://' . $host . $rel_path;

    blog('mcp', '401 no-auth', ['base' => $base]);
    http_response_code(401);
    header('Content-Type: application/json');
    header('WWW-Authenticate: Bearer realm="AISA Bridge", resource_metadata="' . $base . '/.well-known/oauth-protected-resource"');
    echo json_encode(['error' => 'unauthorized', 'error_description' => 'Bearer token required']);
    exit;
}

// --- Streamable HTTP (Claude.ai web): POST with JSON-RPC body ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $payload  = file_get_contents('php://input');
    $req_body = json_decode($payload, true);
    blog('mcp', 'POST authenticated', ['site' => $site['wp_url'] ?? '?', 'method' => $req_body['method'] ?? '?']);
    $response = handle_mcp_request($site, $payload);

    // Notifications (and any no-id request) get no body — acknowledge with 202.
    if ($response === null) {
        http_response_code(202);
        exit;
    }

    header('Content-Type: application/json');
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
