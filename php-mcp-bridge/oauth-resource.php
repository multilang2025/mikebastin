<?php
// oauth-resource.php
// Served at /.well-known/oauth-protected-resource (routed via .htaccess).
// Points OAuth clients to this bridge's authorization server metadata.

require_once __DIR__ . '/db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-store');

blog('resource', 'HIT', ['ip' => $_SERVER['REMOTE_ADDR'] ?? '?', 'ua' => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 40)]);

$proto      = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host       = $_SERVER['HTTP_HOST'];
$script_dir = dirname(__FILE__);
$doc_root   = rtrim($_SERVER['DOCUMENT_ROOT'], '/\\');
$rel_path   = rtrim(str_replace($doc_root, '', $script_dir), '/\\');
$base       = $proto . '://' . $host . str_replace('\\', '/', $rel_path);

echo json_encode([
    'resource'              => $base . '/mcp.php',
    'authorization_servers' => [$base],
], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
