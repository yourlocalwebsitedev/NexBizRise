# Security Checklist: status at v69
_28 Sep 2026 · review only, no code changed · ✅ done · ⚠️ partly / needs a check · ❌ missing · ➖ not built yet (payments)_

## Payments (Razorpay/Stripe not built yet)
| Item | Status | Notes |
|---|---|---|
| Payment amount cannot be manipulated | ➖ | The price is already worked out in the database (`place_order_core` + `coupon_discount`), not in the browser. Payment must be created **server-side** from that total. |
| Payment plan cannot be manipulated | ➖ | The plan is limited to basic/motion on the server. Keep the payment tied to the saved order, never to what the browser sends. |
| Payment success cannot be spoofed | ➖ | Activate cards **only from the webhook**, never from the "success" redirect page. |
| Webhook signature verified | ➖ | Razorpay: HMAC-SHA256 of the raw body with the webhook secret. Stripe: `Stripe-Signature`. Check it in the worker. |
| Webhook replay prevented | ➖ | Reject events older than 5 minutes, and store event IDs. |
| Payment webhook is idempotent | ➖ | Add a `payment_events` table with a unique event ID, and "mark paid" only if not already paid. |
| Order amount verified server-side | ✅ | The total and discount come from the database. The browser's number is ignored. |
| Refund authorization protected | ➖ | Refunds should be admin-only, logged, and done from the provider dashboard at first. |
| Payment events logged | ➖ | The `payment_events` table above. |

## Access control
| Item | Status | Notes |
|---|---|---|
| Customer cannot access another customer's order | ✅ | There are no customer logins. `orders` can be read by admins only (RLS). |
| Customer cannot edit another customer's card | ✅ | Edits need a private edit link. Only its hash is stored. The link expires 15 days after renewal. |
| Customer cannot access another customer's data | ✅ | The public view shows only card fields (by design). `leads`, `orders`, `coupons` and redemptions are admin-only. |
| Admin APIs require real admin authorization | ✅ | `/api/stats` and `/api/purge` check `is_admin()` using the admin's Supabase login. Admin database writes go through RLS. |
| **Supabase RLS verified on every sensitive table** | ⚠️ **check** | `cards` and `admins` were set up before `ALL-IN-ONE.sql`, so their RLS **isn't in the file**. Run the check below. If `cards` can be read by anon, emails, notes and `edit_hash` are exposed. |
| Service-role key never reaches browser | ✅ | Searched every file: only the publishable key is used. |

**RLS check (run in the Supabase SQL editor, read-only):**
```sql
select tablename, rowsecurity from pg_tables where schemaname = 'public' order by 1;
select tablename, policyname, roles, cmd from pg_policies where schemaname = 'public' order by 1;
```
Every table should show `rowsecurity = true`. `cards` and `admins` should have **no** policy that includes `anon` or `public`. I'll add the fix to `ALL-IN-ONE.sql` if either does.

## Edit links (now admin-only)
| Item | Status | Notes |
|---|---|---|
| Cryptographically random | ✅ | Two `gen_random_uuid()` values (strong random), about 150 bits. |
| Can be revoked | ✅ | Admin → **Create new edit link** replaces the old one. Links also stop 15 days after expiry. |
| Don't leak through logs/URLs/referrers | ⚠️ | Referrer policy sends only the site name to other sites, and the page is `noindex`. **But** the link is in the URL, so Cloudflare **Workers logs** (on for nbr-test) record it. Only you can see those logs. Fix later: add `no-referrer` on the edit page and turn off invocation logs on the live Worker. |

## Uploads
| Item | Status | Notes |
|---|---|---|
| File uploads validated | ✅ | The real file type is checked from its first bytes, not its name. Only JPG, PNG, WebP and GIF are accepted. |
| Upload size limits enforced | ✅ | 2 MB, checked on the server. Photos are also resized in the browser first. |
| SVG/active content handled safely | ✅ | SVG and HTML files are rejected. Files are served with a fixed type and `nosniff`, under random names. |
| Upload rate limit | ✅ | 20 per 10 minutes per visitor. ⚠️ Anyone can still upload images without placing an order. Add unused-photo cleanup later. |

## Web protections
| Item | Status | Notes |
|---|---|---|
| XSS protection verified | ⚠️ | Pages escape all text, emails escape all fields, and link fields must start with `https://`. **Missing:** a strict CSP `script-src` rule (the current CSP only blocks plugins and framing). |
| CSRF protection | ✅ | The admin login uses a token, not cookies, so CSRF doesn't apply. Form APIs check the Origin header. |
| Rate limiting | ✅ | Orders 20/hour, leads 10/hour, coupon checks 15/hour, edits 40/hour, uploads 20 per 10 minutes. ⚠️ The worker's limits count per Cloudflare data centre, so the database limits are the firm ones. |
| Coupon abuse prevented | ✅ / ⚠️ | Checked on the server, with the coupon row locked and a per-email limit. ⚠️ Someone can use a new email each time. Use one-per-phone limits for valuable codes. |
| Race conditions tested | ⚠️ | Coupon use is locked (`for update`). **Not handled:** double-clicking or retrying an order can create 2 orders. Needs a unique order key per submit. |
| Security headers | ✅ / ⚠️ | HSTS, nosniff, Referrer-Policy, Permissions-Policy, frame-ancestors and X-Frame-Options are set. CSP is weak (see XSS). |
| CORS restricted | ✅ | The worker sends no CORS headers, so other sites can't read its responses. Writes check Origin. The Supabase REST API is open by design, and RLS is what protects it. |
| **Production debug endpoints disabled** | ❌ | `/api/upload-check` shows which settings are on (true/false only, no secret values). **Remove it or make it admin-only before go-live.** |
| Dependency vulnerabilities | ⚠️ | No npm packages. The Admin Panel loads `supabase-js@2` from esm.sh without pinning a version, so a bad release would load automatically. Pin an exact version. |
| HTTPS enforced | ✅ | http redirects to https, plus HSTS. Also turn on Cloudflare **Always Use HTTPS**. |
| Secrets removed from GitHub/frontend | ✅ | Only public keys are in the code (Supabase publishable key, Turnstile site key). Secrets live in Cloudflare and GitHub secret variables. `.env` is in `.gitignore`. |

## Monitoring
| Item | Status | Notes |
|---|---|---|
| Admin actions logged | ❌ | There's no record of who changed or deleted a card or coupon. Add an `admin_log` table with a database trigger. |
| Failed authentication monitored | ⚠️ | Supabase Auth keeps logs (Dashboard → Logs), but there are no alerts. Check them weekly, or add a leaked-password check and CAPTCHA on login. |

---

## Fix before go-live (small)
1. Run the **RLS check** above and send me the result.
2. Remove `/api/upload-check`, or make it admin-only.
3. Pin `supabase-js` to an exact version.
4. Add `no-referrer` on the edit page, and turn off Workers invocation logs on the live site.
5. Order idempotency key (prevents double orders).

## Fix soon after
6. Stricter CSP (`script-src`), after checking every script the pages load.
7. `admin_log` table and trigger.
8. Unused-photo cleanup in R2.

## With payments
9. Server-created payment, webhook-only activation, signature check, replay protection, the `payment_events` table (idempotent), admin-only refunds.
