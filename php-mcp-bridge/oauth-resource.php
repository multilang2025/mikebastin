<?php
// oauth-resource.php
// Served at /.well-known/oauth-protected-resource (routed via .htaccess).
// Points OAuth clients to this bridge's authorization server metadata.

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-store');

$proto      = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host       = $_SERVER['HTTP_HOST'];
$script_dir = dirname($_SERVER['SCRIPT_FILENAME']);
$doc_root   = rtrim($_SERVER['DOCUMENT_ROOT'], '/\\');
$rel_path   = rtrim(str_replace($doc_root, '', $script_dir), '/\\');
$base       = $proto . '://' . $host . str_replace('\\', '/', $rel_path);

echo json_encode([
    'resource'              => $base . '/mcp.php',
    'authorization_servers' => [$base],
], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
