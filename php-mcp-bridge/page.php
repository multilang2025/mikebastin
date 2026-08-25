<?php
// page.php
// Shared HTML card template for the bridge's user-facing pages
// (connect.php, connect-callback.php) -- matches authorize.php's existing
// card design, so a user clicking through a connect_site link sees one
// consistent product instead of a PHP script's raw text output partway
// through the flow.

// Bumped alongside the bridge-vX.Y.Z tags already used in commit messages
// (see git log) -- this is the first place that version actually gets
// surfaced anywhere instead of living only in commit text, so a client
// looking at the approval page can confirm which fix they're on without
// asking whoever's driving the session.
const BRIDGE_VERSION = '3.3.9';

function render_page($title, $icon, $heading, $body_html, $variant = 'info') {
    $accent = [
        'info'    => '#2271b1',
        'success' => '#00a32a',
        'error'   => '#d63638',
    ][$variant] ?? '#2271b1';
    ?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?php echo htmlspecialchars($title); ?></title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f0f2f5;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:1rem}
.card{background:#fff;border-radius:14px;box-shadow:0 4px 28px rgba(0,0,0,.10);padding:2.2rem 2.4rem;max-width:460px;width:100%;text-align:center}
.icon{font-size:2.4rem;margin-bottom:.8rem}
h1{font-size:1.15rem;font-weight:700;color:#1d2327;margin-bottom:.6rem}
p{font-size:.875rem;color:#646970;line-height:1.65;margin-bottom:.8rem}
p:last-of-type{margin-bottom:0}
.pill{font-size:.875rem;color:<?php echo $accent; ?>;font-weight:600;background:#f6f7f7;border-radius:6px;padding:.3rem .8rem;display:inline-block;margin-bottom:1rem;word-break:break-all}
.footer{font-size:.75rem;color:#aaa;margin-top:1.4rem}
</style>
</head>
<body>
<div class="card">
    <div class="icon"><?php echo $icon; ?></div>
    <h1><?php echo htmlspecialchars($heading); ?></h1>
    <?php echo $body_html; // phpcs:ignore -- caller-controlled, static markup, no user input passed through unescaped. ?>
    <div class="footer">AISA Connector &mdash; powered by your own WordPress site &middot; bridge v<?php echo htmlspecialchars(BRIDGE_VERSION); ?></div>
</div>
</body>
</html>
<?php
}
