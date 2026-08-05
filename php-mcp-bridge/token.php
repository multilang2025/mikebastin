<?php
// token.php
// OAuth 2.0 token endpoint — exchanges an authorization code for an access token.

require_once __DIR__ . '/db.php';

header('Content-Type: application/json');
header('Cache-Control: no-store');
header('Access-Control-Allow-Origin: *');
$req_headers = $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'] ?? '';
header('Access-Control-Allow-Headers: ' . ($req_headers ?: 'Authorization, Content-Type'));
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'method_not_allowed']);
    exit;
}

// Accept JSON or form body.
$ct    = $_SERVER['CONTENT_TYPE'] ?? '';
$input = strpos($ct, 'application/json') !== false
    ? (json_decode(file_get_contents('php://input'), true) ?? [])
    : $_POST;

$grant_type    = $input['grant_type'] ?? '';
$code          = $input['code'] ?? '';
$redirect_uri  = $input['redirect_uri'] ?? '';
$code_verifier = $input['code_verifier'] ?? '';

$db = get_db();

// Mint an access+refresh pair bound to a site and emit the token response.
// $home_site_token records where this connection was originally authorized;
// it defaults to $site_token on first issuance, and must be passed through
// unchanged on every later refresh so a switch_site choice survives rotation
// while the original site stays recoverable for support/debugging.
// $client_id must also be carried through refreshes unchanged -- it's what
// resolve_site()/list_sites/switch_site use to look up this connection's
// site allow-list (see mcp-router.php's get_allowed_sites()).
function aisa_issue_tokens($db, $site_token, $home_site_token = null, $client_id = null) {
    $access_token  = bin2hex(random_bytes(32));
    $refresh_token = bin2hex(random_bytes(32));
    $expires_in    = 86400 * 30;
    $db->prepare('INSERT INTO oauth_tokens (access_token, refresh_token, site_token, home_site_token, client_id, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
       ->execute([$access_token, $refresh_token, $site_token, $home_site_token ?? $site_token, $client_id, time(), time() + $expires_in]);

    echo json_encode([
        'access_token'  => $access_token,
        'token_type'    => 'bearer',
        'expires_in'    => $expires_in,
        'refresh_token' => $refresh_token,
    ]);
}

// --- Refresh grant: swap a refresh token for a fresh access+refresh pair. ---
if ($grant_type === 'refresh_token') {
    $refresh = $input['refresh_token'] ?? '';
    if (!$refresh) {
        http_response_code(400);
        echo json_encode(['error' => 'invalid_request', 'error_description' => 'Missing refresh_token']);
        exit;
    }
    $stmt = $db->prepare('SELECT site_token, home_site_token, client_id FROM oauth_tokens WHERE refresh_token = ?');
    $stmt->execute([$refresh]);
    $trow = $stmt->fetch();
    if (!$trow) {
        http_response_code(400);
        echo json_encode(['error' => 'invalid_grant', 'error_description' => 'Invalid refresh token']);
        exit;
    }
    // Rotate: retire the old pair, issue a new one preserving the
    // currently-switched-to site, the original home site, and the owning
    // client_id — dropping any of these on rotation would either undo a
    // switch_site call or silently widen a scoped client back to
    // unrestricted access (client_id null == full access, see
    // mcp-router.php's get_allowed_sites()).
    $db->prepare('DELETE FROM oauth_tokens WHERE refresh_token = ?')->execute([$refresh]);
    aisa_issue_tokens($db, $trow['site_token'], $trow['home_site_token'], $trow['client_id']);
    exit;
}

if ($grant_type !== 'authorization_code') {
    http_response_code(400);
    echo json_encode(['error' => 'unsupported_grant_type']);
    exit;
}

if (!$code || !$redirect_uri || !$code_verifier) {
    http_response_code(400);
    echo json_encode(['error' => 'invalid_request', 'error_description' => 'Missing required parameters']);
    exit;
}

$stmt = $db->prepare('SELECT * FROM oauth_codes WHERE code = ? AND used = 0 AND expires_at > ?');
$stmt->execute([$code, time()]);
$row = $stmt->fetch();

if (!$row) {
    http_response_code(400);
    echo json_encode(['error' => 'invalid_grant', 'error_description' => 'Invalid or expired code']);
    exit;
}

// Compare after stripping trailing slashes to avoid mismatch on trivial differences.
if (rtrim($row['redirect_uri'], '/') !== rtrim($redirect_uri, '/')) {
    http_response_code(400);
    echo json_encode(['error' => 'invalid_grant', 'error_description' => 'redirect_uri mismatch']);
    exit;
}

// PKCE verification.
$method   = strtoupper($row['code_challenge_method']);
$expected = ($method === 'S256')
    ? rtrim(strtr(base64_encode(hash('sha256', $code_verifier, true)), '+/', '-_'), '=')
    : $code_verifier; // plain

if (!hash_equals($expected, $row['code_challenge'])) {
    http_response_code(400);
    echo json_encode(['error' => 'invalid_grant', 'error_description' => 'PKCE verification failed']);
    exit;
}

// Mark code used.
$db->prepare('UPDATE oauth_codes SET used = 1 WHERE code = ?')->execute([$code]);

// Resolve the site chosen during authorization. NULL (never set at all)
// means this code predates multi-tenant support -- fall back to the only
// site, same as always. '' (explicitly set by authorize.php) means
// deliberately unbound -- proceed with no site; the connection will call
// connect_site next. These two must stay distinct: falling back to "the
// only site" for an intentionally-unbound code would silently hand a
// brand-new, not-yet-approved client access to whatever happens to be
// registered, defeating the whole point of issuing it unbound.
$site_token = $row['site_token'];
if ($site_token === null) {
    $only = $db->query('SELECT token FROM sites LIMIT 1')->fetch();
    $site_token = $only['token'] ?? '';
}

$site = null;
if ($site_token !== '') {
    $stmt = $db->prepare('SELECT token FROM sites WHERE token = ?');
    $stmt->execute([$site_token]);
    $site = $stmt->fetch();
    if (!$site) {
        http_response_code(500);
        echo json_encode(['error' => 'server_error', 'error_description' => 'The site this code was bound to no longer exists.']);
        exit;
    }
}

$client_id = $row['client_id'] ?? '';

// Re-check the grant right before minting the token: authorize.php already
// verified this at Allow-click time, but a revocation between that click
// and this exchange (a few seconds to a few minutes later, per the code's
// own expiry) should still block the token from ever being issued. Only
// applies when a site is actually bound -- nothing to re-check otherwise.
if ($client_id && $site) {
    $stmt = $db->prepare('SELECT full_access FROM oauth_clients WHERE client_id = ?');
    $stmt->execute([$client_id]);
    $client_row = $stmt->fetch();
    if (!$client_row || (int) $client_row['full_access'] !== 1) {
        $stmt = $db->prepare('SELECT 1 FROM client_sites WHERE client_id = ? AND site_token = ?');
        $stmt->execute([$client_id, $site['token']]);
        if (!$stmt->fetch()) {
            http_response_code(403);
            echo json_encode(['error' => 'access_denied', 'error_description' => 'Access to this site was revoked before the connection completed.']);
            exit;
        }
    }
}

// Issue an access+refresh pair valid for 30 days, bound to the chosen site
// (or unbound -- '' -- if none was resolved above).
aisa_issue_tokens($db, $site ? $site['token'] : '', null, $client_id ?: null);
