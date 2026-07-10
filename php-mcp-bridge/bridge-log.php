<?php
// bridge-log.php — view debug log. DELETE after debugging.
// Hit https://www.betranslated.us/php-mcp-bridge/bridge-log.php

$log = __DIR__ . '/bridge-debug.log';
header('Content-Type: text/plain; charset=utf-8');
if (isset($_GET['clear'])) {
    @unlink($log);
    echo "Log cleared. Now retry the connector, then reload this page without ?clear.\n";
    exit;
}
if (!file_exists($log)) {
    echo "No log yet. Try the Claude.ai connector first.\n";
} else {
    echo file_get_contents($log);
}
