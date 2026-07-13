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

$db   = get_db();
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

// Get the registered site (single-tenant: first entry).
$site = $db->query('SELECT token FROM sites LIMIT 1')->fetch();
if (!$site) {
    http_response_code(500);
    echo json_encode(['error' => 'server_error', 'error_description' => 'No site registered with this bridge']);
    exit;
}

// Issue access token valid for 30 days.
$access_token = bin2hex(random_bytes(32));
$expires_at   = time() + 86400 * 30;
$db->prepare('INSERT INTO oauth_tokens (access_token, site_token, created_at, expires_at) VALUES (?, ?, ?, ?)')
   ->execute([$access_token, $site['token'], time(), $expires_at]);

echo json_encode([
    'access_token' => $access_token,
    'token_type'   => 'bearer',
    'expires_in'   => 86400 * 30,
]);
