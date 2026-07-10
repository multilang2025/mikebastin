<?php
// oauth-register.php
// RFC 7591 dynamic client registration — Claude.ai calls this before starting
// the OAuth flow to obtain a client_id it can use in the authorization request.

require_once __DIR__ . '/db.php';

header('Content-Type: application/json');
header('Cache-Control: no-store');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
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

$input         = json_decode(file_get_contents('php://input'), true) ?? [];
$redirect_uris = $input['redirect_uris'] ?? [];

if (empty($redirect_uris)) {
    http_response_code(400);
    echo json_encode(['error' => 'invalid_client_metadata', 'error_description' => 'redirect_uris is required']);
    exit;
}

try {
    $db        = get_db();
    $client_id = bin2hex(random_bytes(16));

    $db->prepare('INSERT INTO oauth_clients (client_id, redirect_uris, created_at) VALUES (?, ?, ?)')
       ->execute([$client_id, json_encode($redirect_uris), time()]);

    http_response_code(201);
    echo json_encode([
        'client_id'                  => $client_id,
        'redirect_uris'              => $redirect_uris,
        'token_endpoint_auth_method' => 'none',
        'grant_types'                => ['authorization_code'],
        'response_types'             => ['code'],
    ], JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'server_error', 'error_description' => $e->getMessage()]);
}
