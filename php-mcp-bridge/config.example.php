<?php
// config.example.php — copy this to config.php on the server and fill in
// your real Supabase connection details. config.php is gitignored; never
// commit real credentials.
//
// Get these from your Supabase project: Settings -> Database -> Connection
// string / Connection parameters. Use the Session pooler host/port (not the
// direct connection) if you're on a plan with a low direct-connection
// limit -- this bridge opens a fresh connection per request, so pooling
// matters more here than for a typical long-lived server process.

define('DB_HOST', 'aws-0-xx-xxxx-x.pooler.supabase.com');
define('DB_PORT', '5432');
define('DB_NAME', 'postgres');
define('DB_USER', 'postgres.xxxxxxxxxxxxxxxxxxxx');
define('DB_PASSWORD', 'CHANGE-ME');

// Dedicated schema, not "public" -- lets this share a Supabase project
// with unrelated data safely. The exact same schema name/structure can be
// pointed at from a future VPS-hosted Postgres with no other code changes.
define('DB_SCHEMA', 'aisa_bridge');
