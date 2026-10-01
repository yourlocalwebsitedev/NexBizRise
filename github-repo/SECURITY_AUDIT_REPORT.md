# NexBizRise security audit report

Date: 2026-09-27. Baseline: OWASP ASVS 5.0 / Top 10:2025 (applicable parts). Scope: see `SECURITY_ATTACK_SURFACE.md`.

This report does **not** say the application is secure. It lists what was tested, what was fixed, and what remains open.

## How it was tested

- **Code review** of all DC pages, the Worker and `supabase/ALL-IN-ONE.sql`.
- **Live, non-destructive tests** against the production Supabase project with the public publishable key (as an anonymous attacker would). Every write test was designed to fail harmlessly: nil IDs, invalid values, or files that were rejected.
- **Worker tests:** the v51 Worker was executed locally with synthetic requests.
- **Not run:** npm audit, Semgrep, ZAP and other scanners (there is no package manifest or build, and the tools aren't available here). Live HTTP headers on nexbizrise.com could not be fetched from the test environment. **NEEDS MANUAL REVIEW.**

## Live test evidence (anonymous, publishable key)

| # | Test | Result | Status |
|---|---|---|---|
| 1 | Read `cards` directly | 401 `permission denied for table cards` | PASS |
| 2 | Update `cards` | 401 permission denied | PASS |
| 3 | Insert self into `admins` (privilege escalation) | 401 RLS violation | PASS |
| 4 | Insert into `orders` | 401 RLS violation | PASS |
| 5 | Insert into `leads` | 401 RLS violation | PASS |
| 6 | Read `orders` / `leads` / `admins` / `rate_hits` | 200 `[]` (RLS hides all rows) | PASS |
| 7 | Delete `leads` | 204, 0 rows affected (RLS) | PASS |
| 8 | Call `place_order_core`, `submit_lead_core`, `rate_check` directly (bypass rate limit) | 401 permission denied for function | PASS |
| 9 | Upload SVG to photos | 415 invalid_mime_type | PASS |
| 10 | Upload `text/html` as .jpg | 415 invalid_mime_type | PASS |
| 11 | Upload outside `orders/` | 403 RLS | PASS |
| 12 | **List all files in photos bucket** | **200, returned customer photo filenames** | **FAIL → fixed in SQL (apply required)** |

## Worker tests (v51, executed locally)

| Test | Result |
|---|---|
| HTML pages send CSP, X-Frame-Options, HSTS, nosniff, COOP | PASS |
| Admin page: `no-store`, `noindex` | PASS |
| POST / PUT to any path | 405 PASS |
| `http://` redirects to `https://` | 301 PASS |
| Path traversal `/../../etc/passwd`, `%2e%2e%2f` | 404 PASS (no filesystem) |

## Findings

| ID | Category | Severity | Finding | Fix applied | Status |
|---|---|---|---|---|---|
| F1 | Business logic | **HIGH** | Builder orders go live on your domain immediately, with no payment or review. Anyone can publish up to 20 public cards per hour per IP, with any name, bio and https links. This could be used for phishing or spam on card.nexbizrise.com. | None. It changes the product; needs your decision (see below). | OPEN |
| F2 | Storage | MEDIUM | Anon could list every uploaded photo (customer portraits, filenames with slugs). | SQL drops anon SELECT policies on `photos` objects and adds an admin-only read policy. Public image URLs keep working. | FIXED IN SQL, NOT YET APPLIED |
| F3 | Input validation | MEDIUM | `place_order_core` stored URLs, email, photo URL and text as sent by the browser. XSS was only stopped by client-side `safeUrl`. Anyone calling the RPC directly could store `javascript:` links or tracking-pixel photo URLs. | Server-side allowlist added: http(s) only for links, and photo only from our storage path or a `data:image` URL. Also a basic email format check, cleaned-up phone numbers, and length caps on every text field. | FIXED IN SQL, NOT YET APPLIED |
| F4 | Headers | MEDIUM | No CSP, no frame protection on public pages (clickjacking), no COOP, no HTTP→HTTPS redirect in the Worker. | v51 adds CSP (`object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'`), X-Frame-Options SAMEORIGIN, COOP, Permissions-Policy, a GET/HEAD-only allowlist and the HTTPS redirect. | FIXED (deploy v51) |
| F5 | CSP | MEDIUM | CSP has no `script-src`. The page runtime uses inline scripts, so a strict script policy needs testing to avoid breaking the site. | Partial: the directives above are safe. | NEEDS MANUAL REVIEW |
| F6 | Abuse | MEDIUM | Anonymous photo uploads to `orders/` have no rate limit, which risks storage-cost abuse. Orders and leads rely on IP rate limits only, with no bot check. | None | OPEN: add Cloudflare Turnstile on order and lead forms, or move uploads behind an Edge Function |
| F7 | Auth | MEDIUM | Admin login is email and password only. MFA isn't enforced. Public sign-ups may be enabled in Supabase; sign-up alone does **not** grant admin (test 3). | None | NEEDS MANUAL REVIEW: disable sign-ups and enable MFA in the Supabase dashboard |
| F8 | Admin | LOW | The "Not an admin yet" SQL snippet put the email into SQL text without escaping. Only the admin copies it, but a crafted email could change the SQL they paste. | Quotes are now escaped | FIXED |
| F9 | Privacy | LOW | Order draft (including photo) and offline orders are kept in browser localStorage. That's a risk on shared devices. | Draft is cleared on completion or reset | PARTIAL: disclose in the Privacy Policy |
| F10 | Upload | LOW | Magic bytes aren't checked. An HTML file labelled as `image/jpeg` is accepted, but it's served from supabase.co as image/jpeg, so it isn't same-origin with our site. | None | ACCEPTED RISK / revisit with an Edge Function |
| F11 | Rate limit | LOW | `rate_check` falls back to `x-forwarded-for` if the `cf-connecting-ip` header is missing. | None | NEEDS MANUAL REVIEW (Supabase sits behind Cloudflare, so `cf-connecting-ip` should always be present) |
| F12 | Secrets | INFO | Repo searched for service-role, Stripe, Twilio, Google and private keys: none found. Only the publishable key is in the browser. | — | PASS |
| F13 | Legal | INFO | No Privacy Policy, Terms, SMS Terms or data-deletion page are live. | None | OPEN (on the change list). **REQUIRES LEGAL REVIEW.** |

## Not applicable here (components don't exist in this project)

These areas are marked **NEEDS MANUAL REVIEW** once the code is shared:
- Twilio webhooks, SMS sending, TCPA/A2P consent (no SMS is sent by this code today)
- n8n
- Gemini
- Google Calendar OAuth
- Edge Functions
- Multi-tenant business accounts (none exist yet; only one admin role)
- Dependencies and CI/CD

The consent, STOP/HELP and kill-switch requirements in your brief should be built into the missed-call product **before** any SMS is sent.

## What you need to do

1. **Run** `supabase/ALL-IN-ONE.sql` in Supabase → SQL Editor. This applies F2 and F3.
2. **Deploy** `_worker.js` v51. This applies F4 and F8.
3. **Test:** place one test order and confirm the card still shows its photo and links.
4. **Supabase dashboard:** Auth → disable sign-ups, and enable MFA for admin accounts (F7).
5. **Decide on F1:** keep instant publishing, or hold new cards until payment or admin approval.

## Secrets to rotate

None found exposed. The publishable key is designed to be public.

## Recurring checks

Re-run the 12 live tests above after every SQL change. Re-scan for secrets before each deploy. Review the Supabase Auth logs monthly.

## Coupons (added v52)

Coupons are admin-managed in the Admin → Coupons tab.

- **Access:** the `coupons` and `coupon_redemptions` tables are admin-only (RLS) and anonymous visitors have no grants. Nobody outside the admins can list, read or change codes.
- **Server-side totals:** the checkout sends only the code text. Price, discount, GST and total are computed in `place_order_core`, and any price sent by the browser is ignored.
- **Re-checked on order:** the coupon is validated again when the order is placed, with a row lock, so it can't be spent twice at the same moment. Uses are counted and each redemption is recorded against the order.
- **Limits enforced on the server:** active/paused, start and expiry dates, country, plan, total uses and uses per email.
- **Guessing codes:** `check_coupon` is rate limited to 15 checks per hour per connection. Every failure returns the same generic "not valid" answer, so it doesn't reveal whether a code exists. Admins can generate 10-character random codes.
- **Price limits:** percent discounts must be 1–100, and fixed-amount coupons require a country so the currency is clear. The discount can never exceed the plan price.
- **Known limit:** "uses per email" relies on an email the customer types, which isn't verified until payment exists. Use "Total uses" for high-value codes. **NEEDS REVIEW** once Stripe checkout is built.
