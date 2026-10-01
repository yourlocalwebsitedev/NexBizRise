# QA report: release candidate v129 (30 Sep 2026)

Scope: website (all routes), order flow (4 steps), tap card, admin panel (live data, read-only), deploy bundle and worker, Supabase pricing logic.
Method: source DCs rendered at 924px desktop and 390px mobile, DOM checks (overflow, tap targets, font sizes), form validation, code review of the worker and SQL.
Legend: 🔴 release blocker · 🟠 fix before promoting · ⚪ polish · ✅ pass

## 🔴 Release blockers
1. **Free-demo form doesn't send anything.** `onSubmit` in the website waits 900 ms and then shows success. It never calls `/api/lead`, and there's no Turnstile check. Every demo request on nexbizrise.com is lost, while the visitor is told "we reply within one business day".
2. **No payment is collected.** "Pay $49" places the order, and the self-built card goes **live immediately** (`active = mode = 'builder'`). The Payment step says "we'll send a secure payment link", but the order email has no payment link and the worker has no Stripe/Razorpay code. The admin panel shows 25 active clients and "$1,158 revenue", none of it paid.
3. **The production database holds test data.** There are 25 test clients ("Sandeep · H · H", "Diary Souls"), 22 test orders and a lead that says "Ddd". The revenue and order counts are wrong, and the test card links are publicly reachable. Purge them before launch.
4. **The footer and contact page use a placeholder phone number, (402) 555-0187.** It appears 4 times in the worker (footer, contact page, `tel:` link, hero demo).
5. **The footer social icons (LinkedIn, X, Instagram, YouTube) all link to `#`.**

## 🟠 Should fix
6. **No favicon, no Open Graph or Twitter tags, no canonical, no robots.txt or sitemap.** Shared links (the site and every card on WhatsApp or iMessage) show no preview image or title. This is important for a product people share by link.
7. **The page title never changes.** Every route shows "NexBizRise — Websites, AI Automations…", and card pages don't set a description either.
8. **Hash routing** (`#/services/...`): search engines only index the home page. Service and legal pages won't rank on their own.
9. **Unknown routes show the home page silently** (`#/nonexistent` → home). There's no 404 page.
10. **Analytics isn't wired up.** `track()` calls `window.posthog`, which is never loaded, and it logs `console.info("[analytics]")` in production.
11. **The confirmation message still says "Your plan includes 2 changes a year".** This is the admin panel's WhatsApp "send card" text (`CHANGES_INCLUDED`). The admin panel also shows a "Changes this year" counter. Both contradict the new "just ask" policy.
12. **Phone validation is weak on the server.** A US order was accepted with a 9-digit phone number (987654321), and a lead with 8 digits (18167723).
13. **The two business-type lists don't match.** The demo form offers 9 types; the order form has more (legal, health, founder…).
14. **"Appointment Booking" links to the same page as "AI Automations"** (`#/services/automations`), from both the home page and the footer.
15. **The Payment step says "Card payment is being set up"** next to a "Pay $49" button. This will confuse people and cause abandoned orders until payment is live (see #2).
16. **Order step 1 (Plan):** the dark "active" pill in the step bar stayed on "Your card" after going back to Plan. Recheck on a real device.
17. **The admin editor label still says "Photo or GIF… GIFs animate"** even though video uploads are now supported.
18. **The tap card took more than 7 s before it responded to scripts in the preview** (223 KB page plus portrait). Measure on a 4G phone; the card is the most-viewed page.

## ⚪ Polish
19. The admin panel says "1 orders", "1 leads", "1 coupons". The plurals are wrong.
20. Admin client rows at about 900px: the "Active" badge drops under the avatar, the QR/Edit buttons wrap to a second line, and "Classic · Professional" wraps to 2 lines.
21. Order form step 2: yes/no fields ("Insured?", "24×7 emergency?") are free text, and their placeholders "Yes" and "Yes / No" look like filled-in answers. Use toggles.
22. Order form step 2: single half-width fields (Instagram, licence no., 24×7) leave an empty column beside them.
23. Order form: the placeholders use an Indian name ("Rahul Sharma") with a US phone format for US visitors.
24. The Payment step has a large empty gap between the coupon field and the payment note. The coupon placeholder "ENTER CODE" is all caps.
25. Headings mix fonts: the order steps use a serif ("Choose a plan", "Payment") and the website uses the sans font.
26. Plan tile: "Upload a short selfie video or GIF (up to 10 seconds)" wraps to 2 lines, and the grey bars on the thumbnail look like a loading skeleton.
27. The home stat "100% Calls answered" is an absolute claim that could be challenged. Consider "Every missed call answered".
28. Desktop service pages (Websites, Missed Call, Automations) leave the right half of the hero empty.
29. The demo form's "Select business type" dropdown text is larger than the other input text.
30. There's a large empty band between the final CTA and the footer on the home page.
31. The tap card's "Get a card like this →" text is small, although its button tap area is 60px, which passes.
32. The header logo image has `alt=""` while the link text is "NexBizRise". That's fine for screen readers; noted only.

## ✅ Passed
- The deploy copies match the source DCs byte-for-byte after the path rewrite (index, order, card, admin), and all three are embedded in the worker. Health check is `ok v129`.
- `_routes.json` and `_headers` match CLAUDE.md, and static files are cached with `nosniff`.
- All website routes render: home, services, 4 service pages, results, about, contact, how it works, 4 legal pages. The nav highlights the current page.
- Mobile at 390px: no horizontal overflow on the website or order form, no text under 12px (except an 11px "now" label), and every tap target is at least 40px (the logo link is 38px).
- Demo form validation: name, business, email, phone, type and message (10+ characters) all show inline errors; the honeypot field is present.
- Order form validation: required fields, email and phone errors, and it scrolls to the first error. The draft is saved to localStorage and restored.
- The order API has idempotency (no duplicates on double-tap), Turnstile, rate limits, and sensible error messages for coupons, bot checks and network failures.
- **Prices are set on the server** (₹799 / ₹1,799 + 18% GST, $49 / $79). Coupons are checked on the server with a row lock and a per-email limit, so a tampered browser can't change the price.
- The card page has the correct title, `tel:` / `sms:` / `mailto:` links, Save contact, Share, a QR dialog, copy buttons, and social links that open in a new tab with `noopener`.
- The admin panel loads live data. The Clients, Orders (with country split), Leads and Coupons tabs work, the edit screen opens, Cancel discards changes, and the panel refreshes every 20 s.
- The order email and admin notification email are sent from the worker, and edit links get `noindex` and `no-referrer`.

## Not tested (needs a real device or live transaction)
- A real payment (not built yet, see #2).
- Delivery of the order email and a real edit-link round trip.
- Video upload and playback on iPhone Safari and Android Chrome.
- The Turnstile widget on the live domain.
- Renewal reminders cron (`/api/cron/reminders`).
- Contact save (vCard) on iOS and Android.
