# NexBizRise — Infra plan review + task list
_Reviewed 28 Sep 2026 against the live build (v53)._

## What's good (keep)
- **Split by job:** Supabase = data, R2 = images, Cloudflare = delivery, Razorpay = payments. Right shape for ~$0/month.
- **Opaque permanent QR ID** (`/c/nbr_7F42K9`): no phone leak, no enumeration, survives renewals and edits.
- **Automatic image optimization** (user crops, system compresses to WebP ~300 KB). Don't keep originals.
- **No customer login**; secret management link instead. Big complexity saving.
- **Hard limits** (1 / 5 photos, no video, 1 QR, 1 card). This is what makes ₹500 profitable.
- **Expiry → grace → disabled → same QR reactivates.** Good renewal lever.
- **Basic analytics only**, transactional email only, Razorpay invoices instead of custom invoicing.

## What's wrong or missing
1. **Pricing conflict.** Plan says ₹500/yr; site sells ₹799 / ₹3999 + 18% GST. Pick one. Also: you can only add GST if you're GST-registered (mandatory above ₹20 L turnover; 1,000 × ₹500 = ₹5 L). If not registered, price must be GST-free.
2. **Cards hit Supabase on every view today.** `Tap Card` makes 2 REST calls per visit (`public_cards` + `public_card_extras`). This contradicts section 11. Fix: Worker route `/c/:id` that reads Supabase once, caches the card JSON at the edge, purges on admin save.
3. **Worker request limit not considered.** The whole site runs through `_worker.js`, so every request (HTML, JS, images) counts toward Workers Free **100K requests/day**. Fine at 1K customers (~9K views/day), but static assets should bypass the worker, and images must be served straight from R2 (custom domain), not proxied.
4. **Analytics writes also hit the DB per view.** Counting views/clicks in Supabase row-by-row undoes the caching. Use Workers Analytics Engine (free tier) or batch counts, then sync daily.
5. **Existing slugs.** Live cards and printed QRs use `/sandeep3649`-style links. Keep them working forever; new QRs use `/c/<id>`, vanity slug optional.
6. **Payment must be server-verified.** Card activates only from a signature-checked Razorpay webhook in the Worker, never from the browser. US customers still need Stripe (Razorpay is India-only for cards/UPI). Razorpay KYC requires Privacy, Terms, Refund and Contact pages live first.
7. **Supabase Free risks not mentioned:** project pauses after 7 days of no activity, and no automatic backups. Add a nightly backup (GitHub Action `pg_dump`) and a keep-alive.
8. **R2 upload security.** Uploads must go through a Worker-issued signed URL with size/type checks; bucket must not allow listing (same bug we just fixed in Supabase storage).
9. **Management link:** store only a hash, allow rotate/revoke from admin, expire on non-renewal. Customer edits should re-purge the cache.
10. **Email provider not chosen.** Need one (e.g. Resend / Brevo free tier) plus SPF/DKIM on nexbizrise.com.
11. **India privacy law (DPDP Act 2023)** and US SMS rules (TCPA/A2P 10DLC) aren't covered; needed before automation.

## Task list (merged with previous pending work, in order)

### Phase 1 — Decide
- [x] Final price: keep ₹799 / ₹3999 (GST: applying — add 18% only once GSTIN issued)
- [x] Grace period: 15 days, then "Renew this card" page

### Phase 7 — Payments & legal (moved to end by choice; cards still go live without payment until then)
- [x] Legal pages: Privacy, Terms, Refund, SMS Terms at `#/legal/*` + footer links + consent line on order Pay step (v54) — **needs legal review**
- [ ] Razorpay signup + KYC (you) — needs legal pages live ✅
- [ ] Razorpay (India) + Stripe (US) checkout; webhook verification in Worker
- [ ] Store order ID, payment ID, amount, status, paid date, expiry date in Supabase
- [ ] Card goes live only after verified payment (top security risk)
- [ ] Coupons apply server-side at checkout (already locked in DB; wire to payment amount)

### Phase 2 — Card serving & cost control
- [ ] Opaque card IDs (`nbr_xxxxxx`) + `/c/:id` route; keep old slugs working
- [x] Edge-cached card data: `/api/card/<slug>` in Worker, 1 Supabase fetch per 5 min per Cloudflare location (v55). Edits show within 5 min.
- [x] Photos to R2: `/api/upload` (checks it's a real image, 2 MB cap, random name) + `/img/` serving; falls back to Supabase until R2 is connected (v56). **You: create bucket + binding.**
- [x] Auto-compress on upload (order form + admin): up to 15 MB in → 1080 px WebP, ~150–300 KB
- [ ] Split static assets out of `_worker.js` so they don't count as worker requests
- [ ] Dynamic vCard endpoint (check current Save Contact covers all fields)

### Phase 4 — Customer operations
- [ ] Management link (hashed token, rotate/revoke in admin)
- [ ] Transactional email: card ready (URL, QR, manage link, expiry) + renewal reminders (30 / 7 / 0 days)
- [ ] Admin: expiry, renewal, suspend, payment status, image management
- [ ] Basic analytics: views, scans, call / WhatsApp / website / Save Contact clicks (Analytics Engine)

### Phase 5 — Safety & reliability
- [ ] Cloudflare Turnstile on order and lead forms
- [ ] Nightly Supabase backup + keep-alive
- [ ] Monthly free-tier usage check (Workers, R2, Supabase egress)

### Phase 6 — Website change list (from `Website v2 change list.md`)
- [ ] Missed-call cost calculator
- [ ] Pricing strip (update to final prices)
- [ ] Services reordered by revenue, each with "from" price
- [ ] How It Works as numbered workflow
- [ ] Contact form: "What happens next"; About: founder story

### Phase 8 — Growth
- [ ] Premium tier (₹999: more photos, motion, advanced analytics, branding)
- [ ] Missed-call automation with Twilio, consent + STOP handling, DPDP / TCPA compliance
