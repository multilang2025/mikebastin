<?php
// authorize.php
// OAuth 2.0 authorization endpoint — shows a one-click "Allow Claude?" UI,
// issues auth codes.
//
// Access model: every OAuth client_id (see oauth-register.php) is either
// full_access (sees/switches to every registered site -- the grandfathered
// default for every client that already existed before this restriction)
// or scoped to whatever an admin has explicitly granted it via
// grant-access.php. A brand-new client with zero grants no longer gets
// blocked here at all: it gets the same one-click Allow, just with no site
// name shown and no site bound to the resulting token (site_token = '').
// The very next thing it does is call connect_site, which -- once approved
// on that site's own native WordPress screen -- both registers the site
// AND auto-grants this exact client access to it (see connect-callback.php).
// A self-connecting client only ever ends up scoped to the one site it
// personally connected; it never gets to see anyone else's.

require_once __DIR__ . '/db.php';

$client_id             = $_GET['client_id'] ?? $_POST['client_id'] ?? '';
$redirect_uri          = $_GET['redirect_uri'] ?? '';
$state                 = $_GET['state'] ?? '';
$code_challenge        = $_GET['code_challenge'] ?? '';
$code_challenge_method = $_GET['code_challenge_method'] ?? 'S256';

if (!$redirect_uri || !$code_challenge) {
    http_response_code(400);
    echo 'Missing required OAuth parameters.';
    exit;
}

$db = get_db();

// Resolve which sites this client is allowed to see. Unknown/unregistered
// client_ids are treated as restricted with zero grants -- never fall back
// to "show everything" just because the client_id didn't match anything.
$full_access = false;
if ($client_id) {
    $stmt = $db->prepare('SELECT full_access FROM oauth_clients WHERE client_id = ?');
    $stmt->execute([$client_id]);
    $client_row  = $stmt->fetch();
    $full_access = $client_row && (int) $client_row['full_access'] === 1;
}

if ($full_access) {
    $sites = $db->query('SELECT token, wp_url FROM sites ORDER BY created_at ASC')->fetchAll();
} else {
    $stmt = $db->prepare('
        SELECT s.token, s.wp_url FROM sites s
        INNER JOIN client_sites cs ON cs.site_token = s.token
        WHERE cs.client_id = ?
        ORDER BY cs.granted_at ASC
    ');
    $stmt->execute([$client_id]);
    $sites = $stmt->fetchAll();
}

// A restricted client with at least one grant already still gets its usual
// default site. A client with none (brand-new, or full_access with zero
// sites registered anywhere yet) proceeds with no default at all --
// $default_site stays null, and the resulting token is issued unbound.
$default_site = $sites[0] ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read params from POST (hidden fields) so they survive the form submit.
    $redirect_uri          = $_POST['redirect_uri']          ?? $redirect_uri;
    $state                 = $_POST['state']                 ?? $state;
    $code_challenge        = $_POST['code_challenge']        ?? $code_challenge;
    $code_challenge_method = $_POST['code_challenge_method'] ?? $code_challenge_method;

    // Append query params safely whether redirect_uri already has a '?' or not.
    $sep = strpos($redirect_uri, '?') !== false ? '&' : '?';

    if (isset($_POST['allow'])) {
        $code    = bin2hex(random_bytes(16));
        $expires = time() + 300; // 5 min
        // Empty string, not null: null means "this code predates multi-site
        // support" to token.php's legacy fallback, which would wrongly grab
        // whatever single site happens to exist. '' means "deliberately
        // unbound," and token.php must treat the two differently.
        $site_token = $default_site['token'] ?? '';

        $stmt = $db->prepare('INSERT INTO oauth_codes (code, redirect_uri, code_challenge, code_challenge_method, state, site_token, client_id, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$code, $redirect_uri, $code_challenge, $code_challenge_method, $state, $site_token, $client_id, $expires]);

        header('Location: ' . $redirect_uri . $sep . http_build_query(['code' => $code, 'state' => $state]));
    } else {
        header('Location: ' . $redirect_uri . $sep . http_build_query(['error' => 'access_denied', 'state' => $state]));
    }
    exit;
}

$heading_domain = $default_site
    ? (parse_url($default_site['wp_url'], PHP_URL_HOST) ?: $default_site['wp_url'])
    : null;
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
    <h1>Allow Claude to connect?</h1>
    <?php if ($heading_domain): ?>
        <div class="domain"><?php echo htmlspecialchars($heading_domain); ?></div>
        <p>
            Claude will be able to read and manage content on your WordPress site.
            You can disconnect at any time from the AISA Connector page in wp-admin.
        </p>
    <?php else: ?>
        <p>
            This starts the connection, but doesn't give Claude access to any WordPress
            site yet. Right after this, ask Claude to connect a specific site — it'll
            give you a link to approve on that site's own WordPress admin screen.
        </p>
    <?php endif; ?>
    <form method="POST">
        <input type="hidden" name="redirect_uri"          value="<?php echo htmlspecialchars($redirect_uri); ?>">
        <input type="hidden" name="state"                 value="<?php echo htmlspecialchars($state); ?>">
        <input type="hidden" name="code_challenge"        value="<?php echo htmlspecialchars($code_challenge); ?>">
        <input type="hidden" name="code_challenge_method" value="<?php echo htmlspecialchars($code_challenge_method); ?>">
        <input type="hidden" name="client_id"             value="<?php echo htmlspecialchars($client_id); ?>">

        <div class="actions">
            <button type="submit" name="allow" value="1" class="allow">Allow</button>
            <button type="submit" name="deny"  value="1" class="deny">Deny</button>
        </div>
    </form>
    <div class="footer">AISA Connector &mdash; powered by your own WordPress site</div>
</div>
</body>
</html>
