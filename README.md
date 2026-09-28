# NexBizRise

Website, digital card builder and admin panel for NexBizRise.

## Layout
- **Sources:** `*.dc.html` — Design Components that open directly in a browser.
  - `NexBizRise Website v2.dc.html` — the website (nexbizrise.com)
  - `Order Card.dc.html` — the card order form (card.nexbizrise.com/order)
  - `Tap Card.dc.html` — the client card page (card.nexbizrise.com/&lt;slug&gt;)
  - `Admin Panel.dc.html` — the admin panel
- `support.js`, `qrcode.js`, `assets/`, `portrait.*` — runtime files and assets used by the pages
- `deploy/website/` — deploy copies of the pages (each with `Tap%20Card.dc.html` replaced by `./card.html`)
- `deploy/single/_worker.js` — **the live deploy**: one Cloudflare Worker with the whole site embedded. Check it's running at `/__health`.
- `supabase/ALL-IN-ONE.sql` — the complete database setup. Safe to re-run in the Supabase SQL Editor.
- `SECURITY_AUDIT_REPORT.md`, `SECURITY_ATTACK_SURFACE.md` — security audit

## Deploying
Every push to `main` deploys `deploy/single/_worker.js` to Cloudflare via GitHub Actions (`.github/workflows/deploy.yml`).

One-time setup:
1. In `wrangler.toml`, set `name` to your existing Worker's name, as shown in Cloudflare → Workers & Pages.
2. Create a Cloudflare API token (My Profile → API Tokens → "Edit Cloudflare Workers" template).
3. In GitHub → Settings → Secrets and variables → Actions, add:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
4. Push to `main`. The workflow deploys and checks `/__health`.

The database is not deployed automatically. Run `supabase/ALL-IN-ONE.sql` by hand when it changes.

## Secrets
None are stored in this repo. The Supabase key in the pages is the **publishable** key, which is meant to be public. Never commit a service-role key, Stripe secret or API token.
