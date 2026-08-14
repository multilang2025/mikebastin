# Putting the preview on a Hostinger subdomain

For `preview.mikebastin.com`, or whatever subdomain you prefer. Written to
be followed start to finish without prior Hostinger knowledge.

The build is a **static export**: plain HTML, CSS, JavaScript and fonts.
Nothing on the server needs Node, PHP or a database, so it works on any
Hostinger plan including the cheapest shared one. The file to upload is
`mikebastin-preview.zip`, about 457 KB.

---

## Before you start: where does the DNS live

Two cases, and they change step 1.

- **mikebastin.com nameservers already point at Hostinger.** Creating the
  subdomain in hPanel is all you need. DNS is handled for you.
- **DNS is managed elsewhere** (registrar, Cloudflare, another host). You
  create the subdomain in hPanel, then add an **A record** for `preview` at
  wherever the DNS actually lives, pointing at the IP hPanel shows you.

If unsure: hPanel → **Domains**. If mikebastin.com is listed as a hosted
domain rather than just parked, you are in the first case.

---

## 1. Create the subdomain

1. Log in to Hostinger and open **hPanel**.
2. Pick the hosting plan that serves mikebastin.com.
3. Left menu → **Domains** → **Subdomains**.
4. In **Create a new subdomain**, enter `preview` and choose
   `mikebastin.com` from the domain list.
5. Leave "Custom folder for subdomain" **unticked**. Hostinger then creates
   the folder for you.
6. Click **Create**.

hPanel now shows the subdomain with its **document root**, something like
`/domains/mikebastin.com/public_html/preview`. Note that path down, you need
it in step 2.

---

## 2. Upload the build

1. Left menu → **Files** → **File Manager**.
2. Navigate to the document root from step 1.
3. Confirm the folder is **empty**. If Hostinger dropped a default
   `index.html` or a `default.php` in there, delete it, or it will be served
   instead of the site.
4. Top bar → **Upload** → **Files** → choose `mikebastin-preview.zip`.
5. When it finishes, right-click the zip → **Extract**, and extract **into
   the current folder** rather than into a subfolder.
6. Delete the zip once extracted.

You should now see `index.html`, `404.html`, `robots.txt`, `.htaccess` and a
`_next` folder sitting directly in the document root. If File Manager hides
`.htaccess`, turn on **Settings → Show hidden files**, and check it is
there, since it handles the 404 page and caching.

---

## 3. Turn on HTTPS

1. Left menu → **Security** → **SSL**.
2. Find `preview.mikebastin.com` and click **Install SSL** if it has not
   issued automatically.

Certificates usually issue in a few minutes but can take up to an hour. The
site works over plain HTTP meanwhile.

---

## 4. Lock it, and check it stays out of Google

The preview lives on a subdomain of the real site, so an indexed copy would
compete with mikebastin.com. Three layers are already in the build:

| Layer | Where |
|---|---|
| `noindex, nofollow` meta tag | every page, set in `app/layout.tsx` |
| `Disallow: /` | `robots.txt` |
| `X-Robots-Tag: noindex` header | `.htaccess` |

Add a fourth, and the only one that is genuinely airtight:

1. hPanel → **Advanced** → **Password Protect Directories**.
2. Select the preview document root, set a username and password, save.

Anything behind HTTP auth cannot be crawled at all. Worth doing, and it also
stops a client stumbling onto an unfinished site.

**Verify** by visiting `https://preview.mikebastin.com/robots.txt`. It
should show `Disallow: /`. If you get a Hostinger placeholder page instead,
the files went into the wrong folder.

---

## 5. Updating it later

Every rebuild produces a fresh `out/` folder, and a fresh zip. To update:
delete the contents of the document root, upload the new zip, extract. There
is no build step on the server and nothing to restart.

Faster alternative once it is set up: hPanel → **Files** → **FTP Accounts**,
create an account for the preview folder, and the files can be pushed
straight over FTP without touching the panel.

---

## Before this ever becomes the real site

Two things in the build exist only because it is a preview, and both must be
removed or the live site will be invisible in search:

1. The `robots` block in `app/layout.tsx` that emits `noindex, nofollow`.
2. `public/robots.txt`, which currently disallows everything, plus the
   `X-Robots-Tag` line in `public/.htaccess`.

`seo-preservation` should treat shipping either of those to production as a
blocking failure.
