<?php
// mcp-router.php
// Handles the MCP JSON-RPC protocol logic.

// Thrown by wp_fetch() specifically when the site couldn't be reached at
// all (DNS, timeout, connection refused -- no HTTP response came back).
// Distinct from the plain Exception wp_fetch() throws for a real HTTP
// response with a bad status, so callers (see execute_tool()'s core_tools
// fallback) can fall back to a weaker implementation only when there was
// truly nothing to talk to, instead of also catching -- and silently
// masking -- a genuine error from the site's own real implementation.
class WpConnectionException extends Exception {}

function handle_mcp_request($site, $payload, $bearer = null, $client_id = null) {
    $req = json_decode($payload, true);
    if (!$req) return null; // Or error

    $id = $req['id'] ?? null;
    $method = $req['method'] ?? '';
    $params = $req['params'] ?? [];

    $response = ['jsonrpc' => '2.0', 'id' => $id];

    if ($method === 'initialize') {
        // Echo the client's protocol version so newer Claude.ai clients accept us.
        $client_proto = $params['protocolVersion'] ?? '2025-03-26';
        // Name this session's server after the actual WordPress site the
        // authenticated token is bound to (not this bridge's own domain) --
        // otherwise the model has no reliable way to know which site it's
        // actually connected to and tends to guess from the connector's own
        // displayed URL (the bridge host), which is the wrong site entirely.
        $site_label = !empty($site['wp_url']) ? $site['wp_url'] : 'aisa-php-bridge';
        $response['result'] = [
            'protocolVersion' => $client_proto,
            // listChanged: true -- a connect_site/switch_site call mid-session
            // rebinds this connection to a different (or newly-registered)
            // site, which can genuinely change the real tool list (a site's
            // /aisa/v1/tools response differs from another's, or from the
            // static fallback used before any site was bound). Actually
            // honoring this over the SSE transport is in mcp.php/
            // connect-callback.php; the Streamable-HTTP POST transport has no
            // channel to deliver it on and depends on the client re-fetching
            // tools/list on its own.
            'capabilities' => ['tools' => (object) ['listChanged' => true]],
            'serverInfo' => [
                'name'    => 'AISA — ' . $site_label,
                'title'   => 'AISA — ' . $site_label,
                'version' => '0.7.0',
            ],
        ];
        return $response;
    }

    if ($method === 'notifications/initialized') {
        // No response needed for notifications
        return null;
    }

    if ($method === 'tools/list') {
        $response['result'] = [
            'tools' => normalize_tools_for_mcp(get_remote_tools($site))
        ];
        return $response;
    }

    if ($method === 'tools/call') {
        $name = $params['name'] ?? '';
        $args = $params['arguments'] ?? [];

        // Loaded once per call so resolve_site()/list_sites/switch_site all
        // see the same snapshot of this connection's allowed sites -- scoped
        // per OAuth client (see get_allowed_sites()), not the raw global list.
        $sites = get_allowed_sites($client_id);
        // What this specific call actually targets — starts as the
        // persistently-bound site, then execute_tool() may overwrite it by
        // reference (switch_site, a per-call `site` arg override). Stamped
        // onto every response as `_site` below since the MCP protocol offers
        // no way to re-announce serverInfo mid-session.
        $target_site = $site;

        // These three (plus connect_site) work with no site bound at all --
        // a self-service client before its first connect_site has nothing
        // to check yet, and connect_site is precisely how it gets a site.
        $needs_no_site = in_array($name, ['list_sites', 'get_current_site', 'connect_site'], true);

        try {
            if (!$needs_no_site && empty($site['token'])) {
                throw new Exception("No WordPress site is connected yet. Call connect_site to get a one-click link to connect one.");
            }
            // Catches a grant revoked after this token was issued -- without
            // this, a scoped client whose access was pulled would keep
            // operating on whatever site it was bound to at issuance time.
            if (!$needs_no_site && !site_is_allowed($site, $sites)) {
                throw new Exception('Access to the current site has been revoked. Call list_sites to see what this connection can still reach.');
            }
            $tool_result = execute_tool($site, $name, $args, $sites, $bearer, $target_site);
            $response['result'] = [
                'content' => [['type' => 'text', 'text' => is_string($tool_result) ? $tool_result : json_encode($tool_result, JSON_PRETTY_PRINT)]]
            ];
        } catch (Exception $e) {
            $response['result'] = [
                'content' => [['type' => 'text', 'text' => 'Error: ' . $e->getMessage()]],
                'isError' => true
            ];
        }
        $response['result']['_site'] = !empty($target_site['wp_url']) ? $target_site['wp_url'] : null;
        return $response;
    }

    $response['error'] = ['code' => -32601, 'message' => 'Method not found'];
    return $response;
}

// list_sites/switch_site/get_current_site exist only on the bridge, not in
// any WordPress plugin's own tool list -- get_remote_tools() must always
// prepend these, whether it ends up returning the live plugin's tools or
// the static fallback below. Forgetting this merge previously meant a site
// whose plugin's /aisa/v1/tools endpoint was reachable never exposed these
// three at all, silently making switch_site unreachable on exactly the
// sites where the bridge is otherwise working fine.
function bridge_management_tools() {
    return [
        [
            'name' => 'list_sites',
            'description' => 'List every WordPress site registered on this bridge, and which one is currently active.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => (object) []
            ]
        ],
        [
            'name' => 'switch_site',
            'description' => 'Switch the persistent default site for every following call in this conversation, without disconnecting. Use when the user says things like "switch to example.com".',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'site' => ['type' => 'string', 'description' => 'Name, URL, or token of a registered site (loosely matched).']
                ],
                'required' => ['site']
            ]
        ],
        [
            'name' => 'get_current_site',
            'description' => 'Report which site is currently targeted by default, and which site this connection was originally authorized for (if different).',
            'inputSchema' => [
                'type' => 'object',
                'properties' => (object) []
            ]
        ],
        [
            'name' => 'connect_site',
            'description' => 'Generate a one-click link to register a new WordPress site with this bridge. The user opens it while logged into that site\'s wp-admin, approves on WordPress\'s own native screen, and the site becomes available immediately -- no need to install anything or visit a settings page first. Use when the user says things like "connect example.com" for a site that isn\'t registered yet.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'site_url' => ['type' => 'string', 'description' => 'The WordPress site\'s URL, e.g. https://example.com.']
                ],
                'required' => ['site_url']
            ]
        ],
    ];
}

// Fetch the full tool catalogue from the site's plugin (single source of
// truth). Falls back to the built-in static list if the site runs an older
// plugin without the /aisa/v1/tools endpoint. Always prepends the bridge's
// own site-management tools (see bridge_management_tools() above) either way.
function get_remote_tools($site) {
    try {
        $res = wp_fetch($site, '/aisa/v1/tools', 'GET');
        if (is_array($res) && !empty($res) && isset($res[0]['name'])) {
            // WP-plugin-sourced tools never know about the bridge's
            // multi-site override — inject the same `site` argument here so
            // the plugin itself needs zero changes to gain it.
            return array_merge(bridge_management_tools(), inject_site_arg($res));
        }
        // Reached WordPress, got 2xx JSON, but not the shape expected --
        // log what actually came back instead of silently guessing why.
        error_log('AISA bridge: /aisa/v1/tools for ' . ($site['wp_url'] ?? '?') . ' returned unexpected shape: ' . substr(json_encode($res), 0, 500));
    } catch (Exception $e) {
        // Logged rather than swallowed -- this used to be a silent fallback
        // with no way to tell "older plugin (404)" apart from "WAF block",
        // "auth failure", or "timeout" without a live repro session.
        error_log('AISA bridge: /aisa/v1/tools fetch failed for ' . ($site['wp_url'] ?? '?') . ': ' . $e->getMessage());
    }
    return get_tools_schema();
}

// Claude.ai's remote MCP validator requires JSON Schema objects such as
// inputSchema.properties to be encoded as {} rather than []. WordPress returns
// the catalogue as JSON, then this bridge decodes it with associative arrays,
// so empty objects become empty arrays unless we restore them before output.
function normalize_tools_for_mcp($tools) {
    if (!is_array($tools)) {
        return [];
    }

    foreach ($tools as &$tool) {
        $schema = $tool['inputSchema'] ?? $tool['input_schema'] ?? ['type' => 'object'];
        $tool['inputSchema'] = normalize_json_schema_for_mcp($schema);
        unset($tool['input_schema']);
    }
    unset($tool);

    return $tools;
}

function normalize_json_schema_for_mcp($schema) {
    if ($schema instanceof stdClass) {
        $schema = (array) $schema;
    }

    if (!is_array($schema)) {
        return $schema;
    }

    foreach ($schema as $key => $value) {
        if ('properties' === $key) {
            if (empty($value)) {
                $schema[$key] = (object) [];
                continue;
            }

            $props = [];
            foreach ((array) $value as $prop_name => $prop_schema) {
                $props[$prop_name] = normalize_json_schema_for_mcp($prop_schema);
            }
            $schema[$key] = (object) $props;
            continue;
        }

        if (in_array($key, ['items', 'additionalProperties', 'oneOf', 'anyOf', 'allOf'], true)) {
            if (is_array($value)) {
                $schema[$key] = normalize_json_schema_for_mcp($value);
            }
            continue;
        }

        if (is_array($value) || $value instanceof stdClass) {
            $schema[$key] = normalize_json_schema_for_mcp($value);
        }
    }

    if (($schema['type'] ?? null) === 'object' && !isset($schema['properties'])) {
        $schema['properties'] = (object) [];
    }

    return $schema;
}

// Fetch every registered site, keyed by nothing in particular — just the
// flat list resolve_site()/list_sites/switch_site all work against.
function get_all_sites() {
    $db = get_db();
    return $db->query('SELECT token, wp_url FROM sites ORDER BY wp_url')->fetchAll();
}

// The sites this specific OAuth client is allowed to see -- the actual
// access-control boundary between connections. list_sites/switch_site/
// resolve_site/per-call `site` overrides all work against whatever this
// returns, never against get_all_sites() directly, once a client_id is
// involved.
function get_allowed_sites($client_id) {
    if (empty($client_id)) {
        // No client_id on this token at all: either it predates client
        // scoping (issued before this feature existed) or it's a ?token=
        // direct connection, which never carries a client_id. Both are
        // already-trusted paths -- treat as full access.
        return get_all_sites();
    }

    $db = get_db();
    // Tolerate a not-yet-migrated full_access column the same way mcp.php
    // tolerates a missing client_id -- fail open to full access rather than
    // crashing the entire authenticated bridge if a migration lost a lock
    // race and hasn't applied on this particular request yet.
    try {
        $stmt = $db->prepare('SELECT full_access FROM oauth_clients WHERE client_id = ?');
        $stmt->execute([$client_id]);
        $row = $stmt->fetch();
    } catch (Throwable $e) {
        return get_all_sites();
    }

    if ($row && (int) $row['full_access'] === 1) {
        return get_all_sites();
    }

    // Missing client row or full_access = 0: fail closed to exactly what's
    // been explicitly granted via grant-access.php -- possibly nothing --
    // never fall back to "everything" just because a lookup came up empty.
    $stmt = $db->prepare('
        SELECT s.token, s.wp_url FROM sites s
        INNER JOIN client_sites cs ON cs.site_token = s.token
        WHERE cs.client_id = ?
        ORDER BY s.wp_url
    ');
    $stmt->execute([$client_id]);
    return $stmt->fetchAll();
}

function site_is_allowed($site, $sites) {
    if (empty($site['token'])) {
        return false;
    }
    foreach ($sites as $s) {
        if ($s['token'] === $site['token']) {
            return true;
        }
    }
    return false;
}

// Strip scheme/www, lowercase — plain-PHP port of the WP-side
// AISA_Gsc_Client::normalize_host(), with no WordPress dependency.
function normalize_host($value) {
    $value = trim((string) $value);
    $value = preg_replace('#^https?://#i', '', $value);
    $value = preg_replace('#^www\.#i', '', $value);
    $value = rtrim($value, '/');
    return strtolower($value);
}

// Resolve a loosely-specified site name/token/URL against the registered
// sites list. Mirrors AISA_Gsc_Client::resolve_property()'s "exact match,
// then substring" pattern, but deliberately stricter: an ambiguous
// substring match throws instead of silently taking the first hit, since
// this switches an entire WordPress site rather than a reporting property.
function resolve_site($needle, $sites) {
    $needle = trim((string) $needle);
    if ($needle === '') {
        throw new Exception('No site specified.');
    }

    foreach ($sites as $s) {
        if ($s['token'] === $needle || normalize_host($s['wp_url']) === normalize_host($needle)) {
            return $s;
        }
    }

    $matches = array_values(array_filter($sites, function ($s) use ($needle) {
        return stripos($s['wp_url'], $needle) !== false;
    }));

    if (count($matches) === 1) {
        return $matches[0];
    }
    if (count($matches) > 1) {
        throw new Exception('"' . $needle . '" matches multiple sites: ' . implode(', ', array_column($matches, 'wp_url')) . '. Be more specific, or call list_sites.');
    }
    throw new Exception('"' . $needle . '" isn\'t a registered site on this bridge. Call list_sites to see what\'s available.');
}

function execute_tool($site, $name, $args, $sites = null, $bearer = null, &$target_site = null) {
    if ($sites === null) {
        $sites = get_all_sites();
    }

    if ($name === 'list_sites') {
        $current_token = $site['token'] ?? null;
        return array_map(function ($s) use ($current_token) {
            return [
                'wp_url'  => $s['wp_url'],
                'current' => $current_token !== null && $s['token'] === $current_token,
            ];
        }, $sites);
    }

    if ($name === 'get_current_site') {
        if (empty($site['token'])) {
            return 'No WordPress site is connected on this connection yet. Call connect_site to get a one-click link to connect one.';
        }
        $db = get_db();
        $home_url = null;
        if (!empty($bearer)) {
            $stmt = $db->prepare('SELECT home_site_token FROM oauth_tokens WHERE access_token = ?');
            $stmt->execute([$bearer]);
            $row = $stmt->fetch();
            if ($row && $row['home_site_token'] && $row['home_site_token'] !== $site['token']) {
                foreach ($sites as $s) {
                    if ($s['token'] === $row['home_site_token']) {
                        $home_url = $s['wp_url'];
                        break;
                    }
                }
            }
        }
        $result = ['current_site' => $site['wp_url']];
        if ($home_url) {
            $result['originally_connected_to'] = $home_url;
        }
        return $result;
    }

    if ($name === 'switch_site') {
        if (empty($bearer)) {
            throw new Exception('Switching isn\'t available on a direct token connection — only on an OAuth-connected (Claude.ai) session.');
        }
        $new_site = resolve_site($args['site'] ?? '', $sites);

        $db = get_db();
        $db->prepare('UPDATE oauth_tokens SET site_token = ? WHERE access_token = ?')
           ->execute([$new_site['token'], $bearer]);
        $db->prepare('INSERT INTO site_switch_log (access_token_suffix, from_site_token, to_site_token, created_at) VALUES (?, ?, ?, ?)')
           ->execute([substr($bearer, -8), $site['token'] ?? null, $new_site['token'], time()]);

        $target_site = $new_site;
        return "Switched. Every following call now targets: " . $new_site['wp_url'];
    }

    if ($name === 'connect_site') {
        $site_url = trim($args['site_url'] ?? '');
        if (!$site_url) {
            throw new Exception('No site_url specified.');
        }
        if (!preg_match('#^https?://#i', $site_url)) {
            $site_url = 'https://' . $site_url;
        }
        $site_url = rtrim($site_url, '/');
        if (!filter_var($site_url, FILTER_VALIDATE_URL)) {
            throw new Exception('"' . $args['site_url'] . '" isn\'t a valid URL.');
        }
        // Resolve any redirect (most commonly apex -> www) here, server-side,
        // rather than building the authorize-application.php link off the
        // pre-redirect host and making the user's browser follow it. Some
        // hosts (seen on Hostinger's edge CDN) throw ERR_HTTP2_PROTOCOL_ERROR
        // on that exact redirect when the URL carries a long query string --
        // this sidesteps it entirely by never sending the browser through a
        // redirect for this URL in the first place. Best-effort: if the
        // resolve request itself fails (network hiccup, site down), fall
        // back to the URL as given rather than blocking the connect flow.
        $resolved = @resolve_redirect($site_url);
        if ($resolved) {
            $site_url = rtrim($resolved, '/');
        }

        $db        = get_db();
        $token     = bin2hex(random_bytes(16));
        // WordPress core's authorize-application.php rejects app_id unless
        // it's a properly hyphenated UUID -- a plain 32-char hex string
        // fails that check ("The application ID must be a UUID").
        $wp_app_id = generate_uuid_v4();
        $expires   = time() + 3600; // 1 hour, matches the message below

        // $bearer (may be null on a direct ?token= connection) is what lets
        // connect-callback.php auto-bind this exact connection to the new
        // site once WordPress approves it -- see connect-callback.php.
        $db->prepare('INSERT INTO pending_connections (token, site_url, wp_app_id, access_token, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)')
           ->execute([$token, $site_url, $wp_app_id, $bearer, time(), $expires]);

        $link = bridge_base_url() . '/connect.php?token=' . $token;
        return "Open this link while logged into $site_url's WP admin to approve (expires in 1 hour):\n$link";
    }

    // Per-call override: `{site: "..."}` targets this one call only and is
    // never persisted to oauth_tokens — mirrors the GSC/GA4 `site` argument
    // pattern. Stripped before forwarding so the bridge-only key never leaks
    // into the WordPress REST payload.
    $call_site = $site;
    if (!empty($args['site'])) {
        $call_site = resolve_site($args['site'], $sites);
        $target_site = $call_site;
        unset($args['site']);
    }

    // search_posts/get_post/create_post/update_post have a real, richer
    // implementation in the WP plugin itself (staleness checks on updates,
    // image-suggestion notes, etc.) reachable via /aisa/v1/tool, same as
    // every other tool -- try that first. execute_core_tool() (a generic
    // WP core REST equivalent, /wp/v2/{type}/{id}) is kept only as a
    // fallback for a site running an older plugin without /aisa/v1/tool at
    // all. Calling execute_core_tool() unconditionally, as this used to,
    // silently bypassed the plugin's real implementation even when it was
    // perfectly reachable -- among other effects, that meant these 4 tools
    // could never reach a post type without a registered REST route (e.g.
    // Divi's et_pb_layout), even though replace_in_post/db_query (native,
    // not REST-route-dependent) could reach it fine the whole time.
    $core_tools = ['search_posts', 'get_post', 'create_post', 'update_post'];

    try {
        $res = wp_fetch($call_site, '/aisa/v1/tool', 'POST', ['tool' => $name, 'input' => $args]);
    } catch (WpConnectionException $e) {
        // Genuinely couldn't reach /aisa/v1/tool at all (DNS, timeout,
        // refused -- see wp_fetch()). Only the 4 basic CRUD tools have a
        // generic fallback; every other tool has none, so its real
        // connection error should surface instead of being silently
        // swallowed. Deliberately NOT catching the plain Exception wp_fetch()
        // throws for a real HTTP error response -- that means the site WAS
        // reached and its own /aisa/v1/tool returned a genuine error (a
        // plugin bug, an expired app password, a WAF block, ...), which
        // should surface as-is rather than getting masked by a fallback
        // attempt through the weaker generic REST path.
        if (in_array($name, $core_tools)) {
            return execute_core_tool($call_site, $name, $args);
        }
        throw $e;
    }

    if (!empty($res['is_error'])) {
        throw new Exception(is_string($res['content'] ?? '') ? $res['content'] : json_encode($res['content']));
    }
    return $res['content'] ?? $res;
}

function rest_base($type) {
    if (!$type || $type === 'post') return 'posts';
    if ($type === 'page') return 'pages';
    return $type;
}

function execute_core_tool($site, $name, $args) {
    if ($name === 'search_posts') {
        $type = rest_base($args['post_type'] ?? 'post');
        $query = [
            'search' => $args['query'] ?? '',
            'status' => $args['status'] ?? 'any',
            'per_page' => min($args['limit'] ?? 10, 50),
            'context' => 'edit',
            '_fields' => 'id,title,status,type,link'
        ];
        $rows = wp_fetch($site, "/wp/v2/$type", 'GET', $query);
        $slim = array_map(function($p) {
            return [
                'id' => $p['id'] ?? '',
                'title' => $p['title']['raw'] ?? $p['title']['rendered'] ?? '',
                'status' => $p['status'] ?? '',
                'type' => $p['type'] ?? '',
                'link' => $p['link'] ?? ''
            ];
        }, $rows ?? []);
        return $slim;
    }
    
    if ($name === 'get_post') {
        $type = rest_base($args['post_type'] ?? 'post');
        $id = $args['id'];
        $p = wp_fetch($site, "/wp/v2/$type/$id", 'GET', ['context' => 'edit']);
        return [
            'id' => $p['id'] ?? '',
            'title' => $p['title']['raw'] ?? $p['title']['rendered'] ?? '',
            'content' => $p['content']['raw'] ?? '',
            'excerpt' => $p['excerpt']['raw'] ?? '',
            'status' => $p['status'] ?? '',
            'type' => $p['type'] ?? '',
            'link' => $p['link'] ?? '',
            'modified' => $p['modified_gmt'] ?? ''
        ];
    }
    
    if ($name === 'create_post') {
        $type = rest_base($args['post_type'] ?? 'post');
        $body = [
            'title' => $args['title'],
            'content' => $args['content'],
            'status' => $args['status'] ?? 'draft'
        ];
        if (isset($args['excerpt'])) $body['excerpt'] = $args['excerpt'];
        
        $p = wp_fetch($site, "/wp/v2/$type", 'POST', $body);
        $result = ['id' => $p['id'] ?? '', 'status' => $p['status'] ?? '', 'link' => $p['link'] ?? ''];
        
        if (!empty($args['content'])) {
            $suggestions = scan_for_missing_images($args['content']);
            $missing = array_filter($suggestions, function($s) { return !$s['has_image']; });
            if (count($missing) > 0) {
                $result['image_suggestions'] = array_values($suggestions);
                $result['note'] = count($missing) . " section(s) without images. Consider using generate_seo_image to create images for them.";
            }
        }
        return $result;
    }
    
    if ($name === 'update_post') {
        $type = rest_base($args['post_type'] ?? 'post');
        $id = $args['id'];
        $body = [];
        if (isset($args['title'])) $body['title'] = $args['title'];
        if (isset($args['content'])) $body['content'] = $args['content'];
        if (isset($args['excerpt'])) $body['excerpt'] = $args['excerpt'];
        if (isset($args['status'])) $body['status'] = $args['status'];
        
        $p = wp_fetch($site, "/wp/v2/$type/$id", 'POST', $body);
        $result = ['id' => $p['id'] ?? '', 'status' => $p['status'] ?? '', 'link' => $p['link'] ?? '', 'modified' => $p['modified_gmt'] ?? ''];
        
        if (isset($args['content'])) {
            $suggestions = scan_for_missing_images($args['content']);
            $missing = array_filter($suggestions, function($s) { return !$s['has_image']; });
            if (count($missing) > 0) {
                $result['image_suggestions'] = array_values($suggestions);
                $result['note'] = count($missing) . " section(s) without images.";
            }
        }
        return $result;
    }
}

function scan_for_missing_images($html) {
    if (!$html) return [];
    $suggestions = [];
    $sections = preg_split('/<h2[\s>]/i', $html);
    for ($i = 1; $i < count($sections); $i++) {
        $section = $sections[$i];
        preg_match('/^[^>]*>(.*?)<\/h2>/i', $section, $headingMatch);
        $heading = !empty($headingMatch[1]) ? trim(strip_tags($headingMatch[1])) : "Section $i";
        $hasImage = preg_match('/<img[\s>]/i', $section);
        $suggestions[] = ['heading' => $heading, 'has_image' => (bool)$hasImage];
    }
    return $suggestions;
}

// Follow redirects on a plain HEAD request and return the final URL's origin
// (scheme + host, no path), or null if the request fails outright. Used by
// connect_site so a browser is sent straight to the real host instead of
// being routed through a redirect this bridge could resolve up front.
function resolve_redirect($url) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_MAXREDIRS, 5);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
    curl_setopt($ch, CURLOPT_TIMEOUT, 8);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
    curl_exec($ch);
    $final_url = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
    $errored   = curl_errno($ch) !== 0;
    curl_close($ch);
    if ($errored || !$final_url) {
        return null;
    }
    $parts = parse_url($final_url);
    if (empty($parts['scheme']) || empty($parts['host'])) {
        return null;
    }
    return $parts['scheme'] . '://' . $parts['host'];
}

function wp_fetch($site, $path, $method = 'GET', $data = []) {
    $url = rtrim($site['wp_url'], '/') . '/wp-json' . $path;
    if ($method === 'GET' && !empty($data)) {
        $url .= '?' . http_build_query($data);
    }
    
    $auth = base64_encode($site['wp_username'] . ':' . $site['wp_app_password']);
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    // Without a ceiling, a slow/stalled WP call (e.g. Ahrefs API latency)
    // hangs this cURL call indefinitely, which hangs the whole Claude chat
    // waiting on a tool response that never arrives. Fail fast and let the
    // tools/call try/catch in handle_mcp_request() turn it into a clean
    // tool error the model can react to instead.
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    // 90s, not 45s: seo_competitor_report makes up to ~4 sequential Ahrefs
    // API calls inside a single WP request before responding, so the
    // combined tool needs more headroom than a single-lookup tool would.
    curl_setopt($ch, CURLOPT_TIMEOUT, 90);
    // Without this, cURL sends its own bare default (often blank, or a
    // plain PHP/x.x.x string). Some security plugins/WAFs specifically
    // allowlist known browser signatures and block/challenge everything
    // else as basic bot defense -- which silently swaps a real JSON
    // response for an HTML block/challenge page, while a normal browser
    // request to the exact same URL, with the exact same credentials,
    // sails through untouched. A custom identifying string (e.g.
    // "AISA-Connector/1.0") wouldn't help against that class of rule --
    // it still isn't a recognized browser -- so this deliberately mimics
    // one instead.
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

    $headers = [
        'Authorization: Basic ' . $auth,
        'Accept: application/json'
    ];
    
    if ($method !== 'GET' && !empty($data)) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        $headers[] = 'Content-Type: application/json';
    }
    
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    $result = curl_exec($ch);
    $curl_error = curl_error($ch);
    $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($result === false) {
        // Connection-level failure (timeout, DNS, refused, etc.) -- no HTTP
        // status to report, so surface curl's own error string instead.
        // WpConnectionException specifically, not a plain Exception: this is
        // the only case execute_tool()'s core_tools fallback should treat as
        // "couldn't reach the site at all, try the generic REST path
        // instead" -- a real HTTP response with a bad status (below) means
        // the site's own /aisa/v1/tool was reached and returned a genuine
        // error, which should surface as-is, not get silently masked by a
        // fallback attempt.
        throw new WpConnectionException('Could not reach WordPress: ' . ($curl_error ?: 'connection failed or timed out'));
    }

    $decoded = json_decode($result, true);
    if ($http_status >= 200 && $http_status < 300) {
        return $decoded !== null ? $decoded : $result;
    }

    $msg = ($decoded && isset($decoded['message'])) ? $decoded['message'] : "HTTP $http_status";
    throw new Exception($msg);
}

// Site-switch/site-selection property shared by every tool — the SAME
// argument shape as the existing `site` parameter on gsc_top_pages /
// ga_traffic_overview, just resolved against the bridge's own registered
// sites list instead of Google properties.
function site_arg_schema() {
    return ['type' => 'string', 'description' => 'Optional. Target a specific registered site for this call only (name, URL, or token), without changing the persistent default. Loosely matched — a domain substring is enough.'];
}

function get_tools_schema() {
    $tools = [
        [
            'name' => 'search_posts',
            'description' => 'Search posts or pages by keyword, type, and status. Read-only.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'query' => ['type' => 'string'],
                    'post_type' => ['type' => 'string'],
                    'status' => ['type' => 'string'],
                    'limit' => ['type' => 'integer']
                ]
            ]
        ],
        [
            'name' => 'get_post',
            'description' => 'Read the full content and metadata of one post or page by ID.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'id' => ['type' => 'integer'],
                    'post_type' => ['type' => 'string']
                ],
                'required' => ['id']
            ]
        ],
        [
            // Param names MUST match ai-site-assistant's real find_in_post
            // exactly (id/pattern/case_sensitive/max_results) -- same
            // fallback-schema-drift trap as the other tools here.
            'name' => 'find_in_post',
            'description' => 'Search one post/page\'s content for a snippet and return short windowed matches instead of the whole post. Read-only.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'id' => ['type' => 'integer'],
                    'pattern' => ['type' => 'string'],
                    'case_sensitive' => ['type' => 'boolean'],
                    'max_results' => ['type' => 'integer']
                ],
                'required' => ['id', 'pattern']
            ]
        ],
        [
            'name' => 'create_post',
            'description' => 'Create a new post or page. Defaults to a draft.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'title' => ['type' => 'string'],
                    'content' => ['type' => 'string'],
                    'excerpt' => ['type' => 'string'],
                    'post_type' => ['type' => 'string'],
                    'status' => ['type' => 'string']
                ],
                'required' => ['title', 'content']
            ]
        ],
        [
            'name' => 'update_post',
            'description' => 'Update an existing post or page.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'id' => ['type' => 'integer'],
                    'title' => ['type' => 'string'],
                    'content' => ['type' => 'string'],
                    'excerpt' => ['type' => 'string'],
                    'post_type' => ['type' => 'string'],
                    'status' => ['type' => 'string']
                ],
                'required' => ['id']
            ]
        ],
        // AISA bridge tools
        [
            'name' => 'generate_image',
            'description' => 'Generate an image via Gemini and upload it to the WordPress media library.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'prompt' => ['type' => 'string'],
                    'alt_text' => ['type' => 'string'],
                    'aspect_ratio' => ['type' => 'string']
                ],
                'required' => ['prompt']
            ]
        ],
        [
            'name' => 'upload_media',
            'description' => 'Upload an image from a URL to the WordPress media library.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'url' => ['type' => 'string'],
                    'alt_text' => ['type' => 'string'],
                    'title' => ['type' => 'string']
                ],
                'required' => ['url']
            ]
        ],
        [
            'name' => 'search_images',
            'description' => 'Search the WordPress media library for existing images.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'query' => ['type' => 'string']
                ],
                'required' => ['query']
            ]
        ],
        [
            // These parameter names MUST match ai-site-assistant's real
            // replace_in_post exactly (id/find/replace, not post_id/search/
            // replace) -- this fallback only fires when a site's own
            // /aisa/v1/tools fetch fails, but whatever args get collected
            // here still get forwarded verbatim to that same site's real
            // /aisa/v1/tool endpoint. A mismatch here doesn't error cleanly;
            // it silently sends id=0 (int cast of a missing/wrong key),
            // which reads as a confusing "Permission denied" from the real
            // handler's own permission check, not as a schema error.
            'name' => 'replace_in_post',
            'description' => 'Replace a specific snippet of HTML in a post with new content.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'id' => ['type' => 'integer'],
                    'find' => ['type' => 'string'],
                    'replace' => ['type' => 'string']
                ],
                'required' => ['id', 'find', 'replace']
            ]
        ],
        [
            'name' => 'append_to_post',
            'description' => 'Append a block of HTML to the end of a post/page.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'id' => ['type' => 'integer'],
                    'html' => ['type' => 'string'],
                    'expected_modified' => ['type' => 'string', 'description' => 'The post_modified value from get_post.']
                ],
                'required' => ['id', 'html', 'expected_modified']
            ]
        ],
        [
            // Param names MUST match ai-site-assistant's real
            // bulk_replace_in_posts exactly (ids/find/replace) -- same
            // fallback-schema-drift trap as replace_in_post above.
            'name' => 'bulk_replace_in_posts',
            'description' => 'Apply the SAME exact text replacement across MULTIPLE posts/pages in one call. Max 50 posts per call.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'ids' => ['type' => 'array', 'items' => ['type' => 'integer']],
                    'find' => ['type' => 'string'],
                    'replace' => ['type' => 'string']
                ],
                'required' => ['ids', 'find', 'replace']
            ]
        ],
        [
            // Param names MUST match ai-site-assistant's real get_seo/set_seo
            // exactly -- same fallback-schema-drift trap as the other tools
            // here. Missing these two entirely (not just misnamed) was the
            // v3.3.1-era bug: users asking for a meta title/description via
            // a site using this fallback got told AISA "doesn't have access
            // to RankMath fields", when the real plugin supports it fine.
            'name' => 'get_seo',
            'description' => 'Read a post\'s SEO meta tags (title, description, focus keyword, canonical, Open Graph, Twitter) and excerpt. Read-only.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'id' => ['type' => 'integer']
                ],
                'required' => ['id']
            ]
        ],
        [
            'name' => 'set_seo',
            'description' => 'Update a post\'s SEO meta tags (Rank Math or Yoast). Pass any of meta_title, meta_description, focus_keyword, canonical, og_title, og_description, twitter_title, twitter_description.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'id' => ['type' => 'integer'],
                    'meta_title' => ['type' => 'string'],
                    'meta_description' => ['type' => 'string'],
                    'focus_keyword' => ['type' => 'string'],
                    'canonical' => ['type' => 'string'],
                    'og_title' => ['type' => 'string'],
                    'og_description' => ['type' => 'string'],
                    'twitter_title' => ['type' => 'string'],
                    'twitter_description' => ['type' => 'string']
                ],
                'required' => ['id']
            ]
        ],
        [
            // Same fallback-schema-drift trap as get_seo/set_seo above --
            // param names must match ai-site-assistant's real get_schema/
            // set_meta exactly.
            'name' => 'get_schema',
            'description' => 'Read a post\'s Rank Math structured-data (schema) entries, decoded. Inspect schema before changing it. Read-only.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'id' => ['type' => 'integer']
                ],
                'required' => ['id']
            ]
        ],
        [
            'name' => 'set_meta',
            'description' => 'Write one SEO/schema meta key (Rank Math / Yoast / AIO SEO keys only), e.g. rank_math_robots -- including full JSON-LD schema objects via keys like rank_math_schema_Article.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'id' => ['type' => 'integer'],
                    'key' => ['type' => 'string'],
                    'value' => ['type' => 'string']
                ],
                'required' => ['id', 'key', 'value']
            ]
        ],
        [
            'name' => 'fact_check',
            'description' => 'Perform a web search via Perplexity/Gemini to fact-check a claim.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'claim' => ['type' => 'string']
                ],
                'required' => ['claim']
            ]
        ],
        [
            'name' => 'get_page_html',
            'description' => 'Fetch a post/page\'s live rendered HTML by its ID (not a URL).',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'id' => ['type' => 'integer']
                ],
                'required' => ['id']
            ]
        ],
        [
            'name' => 'load_skill',
            'description' => 'Load instructions/context for a specific capability.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'skill_name' => ['type' => 'string']
                ],
                'required' => ['skill_name']
            ]
        ]
    ];

    return array_merge(bridge_management_tools(), inject_site_arg($tools));
}

// Adds the shared `site` property to inputSchema.properties on every tool
// except the ones in $skip (the site-management tools themselves, where a
// bare `site` string argument already means something else or nothing).
function inject_site_arg($tools, $skip = []) {
    foreach ($tools as &$tool) {
        if (in_array($tool['name'] ?? '', $skip, true)) {
            continue;
        }
        $schema = $tool['inputSchema'] ?? $tool['input_schema'] ?? ['type' => 'object'];
        if ($schema instanceof stdClass) {
            $schema = (array) $schema;
        }
        if (!is_array($schema)) {
            continue;
        }
        $props = $schema['properties'] ?? [];
        if ($props instanceof stdClass) {
            $props = (array) $props;
        }
        $props['site'] = site_arg_schema();
        $schema['properties'] = $props;
        $tool['inputSchema'] = $schema;
        unset($tool['input_schema']);
    }
    unset($tool);
    return $tools;
}
