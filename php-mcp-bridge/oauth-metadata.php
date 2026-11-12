<?php
// oauth-metadata.php
// Served at /.well-known/oauth-authorization-server (routed via .htaccess).
// Tells OAuth clients where to authorize and exchange tokens.

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-store');

// $_SERVER['HTTPS'] is unset when a reverse proxy (e.g. Traefik) terminates
// TLS and forwards plain HTTP to this container -- fall back to the
// X-Forwarded-Proto header the proxy sets in that case.
$proto      = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https' ? 'https' : 'http';
$host       = $_SERVER['HTTP_HOST'];
$script_dir = dirname(__FILE__);
$doc_root   = rtrim($_SERVER['DOCUMENT_ROOT'], '/\\');
$rel_path   = rtrim(str_replace($doc_root, '', $script_dir), '/\\');
$base       = $proto . '://' . $host . str_replace('\\', '/', $rel_path);

echo json_encode([
    'issuer'                                 => $base,
    'authorization_endpoint'                 => $base . '/authorize.php',
    'token_endpoint'                         => $base . '/token.php',
    'registration_endpoint'                  => $base . '/oauth-register.php',
    'revocation_endpoint'                    => $base . '/revoke.php',
    'response_types_supported'               => ['code'],
    'grant_types_supported'                  => ['authorization_code', 'refresh_token'],
    'code_challenge_methods_supported'       => ['S256'],
    'token_endpoint_auth_methods_supported'  => ['none'],
], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
