<?php
// revoke.php
// OAuth 2.0 Token Revocation endpoint (RFC 7009).
//
// Standard OAuth clients call this when the user disconnects/removes a
// connector, so the server-side token actually stops working. Without this
// endpoint, "remove connector" only cleared Claude's own UI -- the access
// and refresh tokens on this bridge stayed valid, so re-adding the same
// connector silently reused the old authorization (skipping the site
// picker) instead of running a fresh OAuth flow.

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

// Accept JSON or form body, per RFC 7009 (form-encoded is the spec default;
// JSON is accepted too since our other endpoints do the same).
$ct    = $_SERVER['CONTENT_TYPE'] ?? '';
$input = strpos($ct, 'application/json') !== false
    ? (json_decode(file_get_contents('php://input'), true) ?? [])
    : $_POST;

$token = trim((string) ($input['token'] ?? ''));

$db = get_db();
if ($token !== '') {
    // Could be an access token or a refresh token -- delete whichever row matches.
    $db->prepare('DELETE FROM oauth_tokens WHERE access_token = ? OR refresh_token = ?')
       ->execute([$token, $token]);
}

// RFC 7009: always return 200, even if the token was unknown/already gone,
// so a client can't probe whether a given token value is valid.
http_response_code(200);
echo json_encode(['revoked' => true]);
