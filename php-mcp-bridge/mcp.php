<?php
// mcp.php
// MCP endpoint: SSE stream (Claude Desktop/Code) + Streamable HTTP POST (Claude.ai web).
// Auth: ?token= for direct connections, Authorization: Bearer for OAuth connections.

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/mcp-router.php';

// A single tools/call can involve a slow upstream (e.g. seo_competitor_report
// chaining several Ahrefs API calls via WordPress) close to wp_fetch()'s own
// 90s cURL timeout. Many shared hosts default max_execution_time to 30s,
// which would silently kill this script (blank/500 response, no clean
// JSON-RPC error) before that timeout ever gets a chance to fire on its own.
// Give the script enough headroom that wp_fetch()'s timeout is what actually
// governs the ceiling.
@set_time_limit(110);

// CORS — Claude.ai web sends cross-origin requests. Reflect any requested headers
// so that MCP-Protocol-Version and other client headers are never blocked.
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE');
header('Access-Control-Expose-Headers: *');
$req_headers = $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'] ?? '';
header('Access-Control-Allow-Headers: ' . ($req_headers
    ?: 'Authorization, Content-Type, Accept, MCP-Protocol-Version, mcp-protocol-version, mcp-session-id'));
// Streamable-HTTP clients (Claude.ai web) read the session id back off this
// header on the initialize response, so it must be explicitly exposed —
// Access-Control-Expose-Headers: * above covers most browsers, but Safari
// historically ignores the wildcard for this purpose.
header('Access-Control-Expose-Headers: Mcp-Session-Id');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$db = get_db();
$site = null;
$site_token_for_url = null; // internal site token, used in the SSE message endpoint URL
// True once a real, unexpired token/site row was found -- distinct from
// $site being non-null, since a token can be genuinely valid but not yet
// bound to any site (self-service clients before their first connect_site).
// Gates the 401 below: an unbound-but-valid token must NOT be treated as
// unauthenticated just because $site itself came up empty.
$token_valid = false;
// Raw bearer string, only ever set on an OAuth (Authorization: Bearer)
// connection — switch_site needs it to know which oauth_tokens row to
// UPDATE. Stays null on a ?token= direct connection, where there is no
// oauth_tokens row to mutate and switching isn't meaningful.
$bearer = null;
// The OAuth client this bearer belongs to, if any — used to scope which
// sites list_sites/switch_site can see (see get_allowed_sites() in
// mcp-router.php). Null on a ?token= direct connection, and null client_id
// is treated as full access (every connection that predates this scoping
// feature has no client_id recorded at all).
$client_id = null;

// Which chat this request belongs to, distinct from $bearer (which chat's
// ACCOUNT this is). Multiple chats can share one $bearer (the OAuth
// access_token is issued once per connector connection, not per chat) —
// this is what lets switch_site scope itself to just this one chat instead
// of silently rebinding every other open chat's default site too. Recovered
// from the client-echoed Mcp-Session-Id header on the Streamable-HTTP POST
// transport (see the initialize handling below, which assigns one on first
// contact); set directly from the SSE connection's own generated
// $session_id further down for the SSE/GET transport, where per-connection
// isolation already exists for free.
$mcp_session_id = null;

// Accept ?token= (direct) OR Authorization: Bearer (OAuth).
$url_token = $_GET['token'] ?? '';
if ($url_token) {
    $stmt = $db->prepare('SELECT * FROM sites WHERE token = ?');
    $stmt->execute([$url_token]);
    $site = $stmt->fetch();
    $site_token_for_url = $url_token;
    // A direct ?token= connection's token IS a site token -- if it doesn't
    // resolve to a real site, the token itself is invalid, unlike the
    // OAuth path below where a valid bearer can legitimately have no site.
    $token_valid = (bool) $site;
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
        // Tolerate a not-yet-migrated client_id column (e.g. the ALTER TABLE
        // in db.php lost a lock-contention race against a long-lived SSE
        // connection and hasn't applied yet on this request) -- fall back to
        // the pre-scoping query rather than letting every authenticated
        // request on the whole bridge fail on a missing column.
        try {
            $stmt = $db->prepare('SELECT site_token, client_id FROM oauth_tokens WHERE access_token = ? AND expires_at > ?');
            $stmt->execute([$bearer, time()]);
        } catch (Throwable $e) {
            $stmt = $db->prepare('SELECT site_token FROM oauth_tokens WHERE access_token = ? AND expires_at > ?');
            $stmt->execute([$bearer, time()]);
        }
        $row = $stmt->fetch();

        if ($row) {
            $token_valid        = true;
            $site_token_for_url = $row['site_token'];
            $client_id          = $row['client_id'] ?? null;
            // An unbound token (self-service client before its first
            // connect_site) has site_token = '' -- there is no site row to
            // look up, and that's expected, not an error.
            if ($row['site_token'] !== '') {
                $stmt2 = $db->prepare('SELECT * FROM sites WHERE token = ?');
                $stmt2->execute([$row['site_token']]);
                $site = $stmt2->fetch();
            }
        }
    }
}

if (!$token_valid) {
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

// Normalize "no site bound yet" to a plain empty array rather than false/
// null, so every downstream $site['...'] access behaves the same way
// regardless of which branch above produced it.
$site = $site ?: [];

// --- Streamable HTTP (Claude.ai web): POST with JSON-RPC body ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Only meaningful on an OAuth (bearer) connection — a direct ?token=
    // connection has no shared-account cross-talk problem to solve (its
    // token already is a single site), and no oauth_tokens row to key off.
    if ($bearer) {
        $mcp_session_id = $_SERVER['HTTP_MCP_SESSION_ID'] ?? null;
        if (!$mcp_session_id && function_exists('getallheaders')) {
            foreach (getallheaders() as $k => $v) {
                if (strcasecmp($k, 'Mcp-Session-Id') === 0) {
                    $mcp_session_id = $v;
                    break;
                }
            }
        }
    }

    $payload = file_get_contents('php://input');
    $decoded_method = null;
    $peek = json_decode($payload, true);
    if (is_array($peek)) {
        $decoded_method = $peek['method'] ?? null;
    }

    // Assign this chat its own session id on first contact so every later
    // request in the same chat can be told apart from any other chat
    // sharing this same access_token — a spec-compliant client echoes this
    // header back on every subsequent request. A client that never sends it
    // back (or doesn't support Streamable-HTTP sessions at all) simply keeps
    // $mcp_session_id null on later calls, which falls back to the old
    // shared-account behavior rather than breaking anything.
    if ($bearer && !$mcp_session_id && $decoded_method === 'initialize') {
        $mcp_session_id = bin2hex(random_bytes(16));
    }

    $response = handle_mcp_request($site, $payload, $bearer, $client_id, $mcp_session_id);

    if ($bearer && $mcp_session_id && $decoded_method === 'initialize') {
        header('Mcp-Session-Id: ' . $mcp_session_id);
    }

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
// One SSE connection = one chat (Claude Desktop/Code opens a fresh one per
// chat), so this already-unique id is exactly the right session key for
// per-chat site isolation — no client-side header support needed for this
// transport, unlike Streamable-HTTP above.
if ($bearer) {
    $mcp_session_id = $session_id;
}

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

    // '__broadcast__' alongside the real session_id: connect-callback.php
    // (a plain browser redirect, not an active MCP request) can't know this
    // specific session_id ahead of time, so it queues under the sentinel
    // instead -- whichever SSE session for this site's token polls it first
    // gets it (the row is deleted after, like any other request). Fine for
    // the common case of one live session per token; a second concurrent
    // session simply won't see this particular notification.
    $stmt = $db->prepare("SELECT id, payload FROM requests WHERE token = ? AND (session_id = ? OR session_id = '__broadcast__') AND status = 'pending' ORDER BY id ASC LIMIT 1");
    $stmt->execute([$site_token_for_url, $session_id]);
    $request = $stmt->fetch();

    if ($request) {
        $db->prepare("UPDATE requests SET status = 'processing' WHERE id = ?")->execute([$request['id']]);

        $decoded = json_decode($request['payload'], true);
        if (is_array($decoded) && ($decoded['method'] ?? '') === 'notifications/tools/list_changed') {
            // A pre-built notification to relay verbatim, not a JSON-RPC
            // request to dispatch -- handle_mcp_request() expects the
            // latter and would reject this as an unknown method.
            send_message($decoded);
        } else {
            $response = handle_mcp_request($site, $request['payload'], $bearer, $client_id, $mcp_session_id);
            if ($response !== null) {
                send_message($response);
            }
        }

        $db->prepare('DELETE FROM requests WHERE id = ?')->execute([$request['id']]);
    }

    usleep(500000); // 0.5 s
}
