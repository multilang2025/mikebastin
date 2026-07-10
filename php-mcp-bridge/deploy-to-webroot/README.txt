DEPLOY THESE TO THE WEBSITE ROOT (public_html), *NOT* into php-mcp-bridge/.

The OAuth spec (RFC 8414) makes Claude look for the authorization-server
metadata at the DOMAIN ROOT with the bridge path appended:

    https://www.betranslated.us/.well-known/oauth-authorization-server/php-mcp-bridge

...even though the bridge itself lives in /php-mcp-bridge/. So this one file
has to sit at the web root.

WHAT TO DO
----------
Upload the CONTENTS of this "deploy-to-webroot" folder into public_html so you
end up with:

    public_html/.well-known/oauth-authorization-server/php-mcp-bridge
    public_html/.well-known/oauth-authorization-server/.htaccess

IMPORTANT: if public_html/.well-known already exists (e.g. an acme-challenge
folder for SSL), MERGE into it — do not delete the existing contents. Just add
the "oauth-authorization-server" subfolder inside it.

VERIFY
------
Open this URL in a browser — it must return the JSON (issuer, endpoints, etc.):

    https://www.betranslated.us/.well-known/oauth-authorization-server/php-mcp-bridge

If it shows the WordPress "No Results Found" page instead, the file isn't in
the right place.
