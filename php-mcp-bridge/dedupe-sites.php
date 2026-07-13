<?php
// dedupe-sites.php — ONE-TIME cleanup for duplicate site registrations
// caused by register.php always INSERTing instead of upserting by wp_url
// (fixed now, but pre-existing duplicates need a one-time cleanup).
//
// Run once: https://your-bridge-url/dedupe-sites.php
// Then DELETE this file.
//
// Safe: for each duplicated wp_url, keeps whichever row already has a
// live OAuth access token issued against it (so your current Claude.ai
// connection is never broken), or the oldest row if none are in use yet.
// Every other duplicate is removed.

require_once __DIR__ . '/db.php';

header('Content-Type: text/plain; charset=utf-8');

$db = get_db();
$sites = $db->query('SELECT * FROM sites ORDER BY wp_url, created_at')->fetchAll();

$by_url = [];
foreach ($sites as $s) {
    $by_url[$s['wp_url']][] = $s;
}

$deleted = 0;
foreach ($by_url as $url => $rows) {
    if (count($rows) <= 1) {
        continue;
    }

    echo "=== $url (" . count($rows) . " rows) ===\n";

    $keep = null;
    foreach ($rows as $r) {
        $used = $db->prepare('SELECT COUNT(*) c FROM oauth_tokens WHERE site_token = ?');
        $used->execute([$r['token']]);
        if ((int) $used->fetch()['c'] > 0) {
            $keep = $r;
            break;
        }
    }
    if (!$keep) {
        $keep = $rows[0]; // oldest row (ordered by created_at above)
    }

    echo "  keeping token " . substr($keep['token'], 0, 8) . "...\n";

    foreach ($rows as $r) {
        if ($r['token'] === $keep['token']) {
            continue;
        }
        $db->prepare('DELETE FROM sites WHERE token = ?')->execute([$r['token']]);
        $deleted++;
        echo "  deleted token " . substr($r['token'], 0, 8) . "...\n";
    }
    echo "\n";
}

echo "Done. Removed $deleted duplicate row(s).\n";
echo "Remaining sites: " . $db->query('SELECT COUNT(*) c FROM sites')->fetch()['c'] . "\n";
