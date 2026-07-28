<?php
// mcp-router.php
// Handles the MCP JSON-RPC protocol logic.

function handle_mcp_request($site, $payload) {
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
            // tools MUST be a JSON object ({}), not an array ([]).
            'capabilities' => ['tools' => (object) []],
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

        try {
            $tool_result = execute_tool($site, $name, $args);
            $response['result'] = [
                'content' => [['type' => 'text', 'text' => is_string($tool_result) ? $tool_result : json_encode($tool_result, JSON_PRETTY_PRINT)]]
            ];
        } catch (Exception $e) {
            $response['result'] = [
                'content' => [['type' => 'text', 'text' => 'Error: ' . $e->getMessage()]],
                'isError' => true
            ];
        }
        return $response;
    }

    $response['error'] = ['code' => -32601, 'message' => 'Method not found'];
    return $response;
}

// Fetch the full tool catalogue from the site's plugin (single source of
// truth). Falls back to the built-in static list if the site runs an older
// plugin without the /aisa/v1/tools endpoint.
function get_remote_tools($site) {
    try {
        $res = wp_fetch($site, '/aisa/v1/tools', 'GET');
        if (is_array($res) && !empty($res) && isset($res[0]['name'])) {
            return $res;
        }
    } catch (Exception $e) {
        // Older plugin (404) or transient error — use the static fallback.
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

function execute_tool($site, $name, $args) {
    $core_tools = ['search_posts', 'get_post', 'create_post', 'update_post'];
    if (in_array($name, $core_tools)) {
        return execute_core_tool($site, $name, $args);
    }

    // AISA specific tools go to /aisa/v1/tool
    $res = wp_fetch($site, '/aisa/v1/tool', 'POST', ['tool' => $name, 'input' => $args]);
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
        throw new Exception('Could not reach WordPress: ' . ($curl_error ?: 'connection failed or timed out'));
    }

    $decoded = json_decode($result, true);
    if ($http_status >= 200 && $http_status < 300) {
        return $decoded !== null ? $decoded : $result;
    }

    $msg = ($decoded && isset($decoded['message'])) ? $decoded['message'] : "HTTP $http_status";
    throw new Exception($msg);
}

function get_tools_schema() {
    return [
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
            'name' => 'replace_in_post',
            'description' => 'Replace a specific snippet of HTML in a post with new content.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'post_id' => ['type' => 'integer'],
                    'search' => ['type' => 'string'],
                    'replace' => ['type' => 'string']
                ],
                'required' => ['post_id', 'search', 'replace']
            ]
        ],
        [
            'name' => 'append_to_post',
            'description' => 'Append content to the end of an existing post.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'post_id' => ['type' => 'integer'],
                    'content' => ['type' => 'string']
                ],
                'required' => ['post_id', 'content']
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
            'description' => 'Fetch the rendered HTML of a given public URL.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'url' => ['type' => 'string']
                ],
                'required' => ['url']
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
}
