<?php
// authorize.php
// OAuth 2.0 authorization endpoint — shows "Allow Claude?" UI, issues auth codes.
// Multi-tenant: the user picks which registered WordPress site to connect, and
// the choice is stored on the auth code so token.php can bind the access token
// to that specific site.

require_once __DIR__ . '/db.php';

$client_id             = $_GET['client_id'] ?? '';
$redirect_uri          = $_GET['redirect_uri'] ?? '';
$state                 = $_GET['state'] ?? '';
$code_challenge        = $_GET['code_challenge'] ?? '';
$code_challenge_method = $_GET['code_challenge_method'] ?? 'S256';

if (!$redirect_uri || !$code_challenge) {
    http_response_code(400);
    echo 'Missing required OAuth parameters.';
    exit;
}

$db    = get_db();
$sites = $db->query('SELECT token, wp_url FROM sites ORDER BY wp_url')->fetchAll();

if (!$sites) {
    http_response_code(500);
    echo 'No WordPress site is registered with this bridge yet.';
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read params from POST (hidden fields) so they survive the form submit.
    $redirect_uri          = $_POST['redirect_uri']          ?? $redirect_uri;
    $state                 = $_POST['state']                 ?? $state;
    $code_challenge        = $_POST['code_challenge']        ?? $code_challenge;
    $code_challenge_method = $_POST['code_challenge_method'] ?? $code_challenge_method;
    $chosen_site           = $_POST['site_token']            ?? '';

    // Append query params safely whether redirect_uri already has a '?' or not.
    $sep = strpos($redirect_uri, '?') !== false ? '&' : '?';

    if (isset($_POST['allow'])) {
        // Validate the chosen site actually exists; default to the only site.
        $valid = array_column($sites, 'token');
        if (!in_array($chosen_site, $valid, true)) {
            $chosen_site = count($sites) === 1 ? $sites[0]['token'] : '';
        }
        if (!$chosen_site) {
            http_response_code(400);
            echo 'Please choose a site to connect.';
            exit;
        }

        $code    = bin2hex(random_bytes(16));
        $expires = time() + 300; // 5 min

        $stmt = $db->prepare('INSERT INTO oauth_codes (code, redirect_uri, code_challenge, code_challenge_method, state, site_token, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$code, $redirect_uri, $code_challenge, $code_challenge_method, $state, $chosen_site, $expires]);

        header('Location: ' . $redirect_uri . $sep . http_build_query(['code' => $code, 'state' => $state]));
    } else {
        header('Location: ' . $redirect_uri . $sep . http_build_query(['error' => 'access_denied', 'state' => $state]));
    }
    exit;
}

$single = count($sites) === 1;
$heading_domain = $single
    ? (parse_url($sites[0]['wp_url'], PHP_URL_HOST) ?: $sites[0]['wp_url'])
    : (count($sites) . ' sites available');
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Connect Claude to your WordPress site</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f0f2f5;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:1rem}
.card{background:#fff;border-radius:14px;box-shadow:0 4px 28px rgba(0,0,0,.10);padding:2.2rem 2.4rem;max-width:420px;width:100%;text-align:center}
.icon{font-size:2.4rem;margin-bottom:.8rem}
h1{font-size:1.15rem;font-weight:700;color:#1d2327;margin-bottom:.3rem}
.domain{font-size:.875rem;color:#2271b1;font-weight:600;background:#edf4fb;border-radius:6px;padding:.25rem .7rem;display:inline-block;margin-bottom:1rem}
p{font-size:.825rem;color:#646970;line-height:1.65;margin-bottom:1.4rem}
.sites{text-align:left;margin-bottom:1.4rem;max-height:260px;overflow-y:auto}
.site{display:flex;align-items:center;gap:.6rem;padding:.6rem .8rem;border:1px solid #dcdcde;border-radius:8px;margin-bottom:.5rem;cursor:pointer;font-size:.85rem;color:#1d2327;transition:border-color .15s,background .15s}
.site:hover{border-color:#2271b1;background:#f6fafe}
.site input{accent-color:#2271b1}
.actions{display:flex;gap:.75rem;justify-content:center}
button{padding:.6rem 1.6rem;border-radius:7px;font-size:.875rem;font-weight:600;cursor:pointer;border:none;transition:opacity .15s}
button:hover{opacity:.85}
.allow{background:#2271b1;color:#fff}
.deny{background:#f6f7f7;color:#3c434a;border:1px solid #dcdcde}
.footer{font-size:.75rem;color:#aaa;margin-top:1.4rem}
</style>
</head>
<body>
<div class="card">
    <div class="icon">🔗</div>
    <h1>Allow Claude to access your site?</h1>
    <div class="domain"><?php echo htmlspecialchars($heading_domain); ?></div>
    <p>
        <?php if ($single): ?>
            Claude will be able to read and manage content on your WordPress site.
        <?php else: ?>
            Choose which WordPress site to connect. Claude will be able to read and
            manage content on the site you pick.
        <?php endif; ?>
        You can disconnect at any time from the AISA Connector page in wp-admin.
    </p>
    <form method="POST">
        <input type="hidden" name="redirect_uri"          value="<?php echo htmlspecialchars($redirect_uri); ?>">
        <input type="hidden" name="state"                 value="<?php echo htmlspecialchars($state); ?>">
        <input type="hidden" name="code_challenge"        value="<?php echo htmlspecialchars($code_challenge); ?>">
        <input type="hidden" name="code_challenge_method" value="<?php echo htmlspecialchars($code_challenge_method); ?>">

        <?php if ($single): ?>
            <input type="hidden" name="site_token" value="<?php echo htmlspecialchars($sites[0]['token']); ?>">
        <?php else: ?>
            <div class="sites">
                <?php foreach ($sites as $i => $s): ?>
                    <label class="site">
                        <input type="radio" name="site_token" value="<?php echo htmlspecialchars($s['token']); ?>" <?php echo $i === 0 ? 'checked' : ''; ?>>
                        <span><?php echo htmlspecialchars(parse_url($s['wp_url'], PHP_URL_HOST) ?: $s['wp_url']); ?></span>
                    </label>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <div class="actions">
            <button type="submit" name="allow" value="1" class="allow">Allow</button>
            <button type="submit" name="deny"  value="1" class="deny">Deny</button>
        </div>
    </form>
    <div class="footer">AISA Connector &mdash; powered by your own WordPress site</div>
</div>
</body>
</html>
