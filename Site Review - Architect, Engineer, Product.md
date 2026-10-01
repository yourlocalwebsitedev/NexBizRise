# NexBizRise — Review: Architect · Lead Engineer · Product Owner
_28 Sep 2026 · against build v62 (not yet pushed) · review only, no code changed_

Severity: 🔴 fix before real customers · 🟠 fix soon · 🟡 nice to have

---

## 🔴 Top 8 (read these first)

1. **Anyone can get a free live card right now.** `place_order` sets `active = true` for "Build it myself" orders with no payment. Payments are postponed, so every self-built order is a free card. *Fix:* until Razorpay is live, start every order paused (`active = false`) and turn it on from the Admin Panel once paid.
2. **Expired cards never switch off.** The public view only checks `active`, not `renewal`. The "15-day grace, delete after 90 days" rule only applies to edit links; the card itself stays live forever. *Fix:* have `public_cards` also require `renewal + 15 days >= today`, show a "Renew this card" page, and add a nightly cleanup for day 90.
3. **Leads go nowhere.** Visitors can "Share your contact" on a card and it's saved in the `leads` table, but no screen shows leads and nobody is notified. Clients will think the feature is broken. *Fix:* add a Leads tab in the Admin Panel, then email or WhatsApp the card owner (needs the email step).
4. **Rate limits turn global after v61.** Orders and leads now reach Supabase through the site worker. Until the `app_secrets` "worker" row is added, Supabase sees the **worker's** IP address for every visitor, so the limits (20 orders/hour, 10 leads/hour) are shared by **everyone**. One busy hour and nobody can order. *Fix:* do the Turnstile + secret setup in the same session as the push, or have the check trust `x-nbr-ip` without the secret for now.
5. **Turnstile setup order can block all orders.** If `TURNSTILE_SECRET` is added in Cloudflare before the **site key** is in the pages, the check can never pass. Also, the widget only appears when you *navigate* to Payment; a returning visitor whose saved draft opens directly on Payment gets no widget, so their order fails. *Fix:* add the site key first, then the secret, and show the widget whenever Payment is visible.
6. **Edit link is shown once and never sent.** It's shown on the confirmation screen only. If the client closes the tab it's gone (by design, since it's hashed). *Fix:* the Admin Panel "Send to client" WhatsApp message should include a fresh edit link, then send it in the "card ready" email.
7. **Admin changes can take 5 minutes to appear.** Client edits refresh the cache; Admin Panel saves don't. Clients you're on the phone with will say "I don't see it". *Fix:* the Admin Panel should call the cache refresh after saving (same as edit links).
8. **Test branch writes to the live database.** Test orders, coupon uses, leads and edits on `test.nexbizrise.pages.dev` are real, and coupon usage counts go up. *Fix:* use a `TEST` coupon, delete test rows afterwards, or later set up a second free Supabase project for testing.

---

## Architect (how the pieces fit)

- 🟠 **The worker file is 1.1 MB and growing.** Every page is stored inside `_worker.js`. The Workers Free limit is 3 MB (compressed), so there's room, but each new page or feature grows it, and a big worker starts more slowly. *Next step:* serve the HTML pages as static files too, and keep the worker for routes and APIs only.
- 🟠 **Anyone can call some of the site's APIs:**
  - `/api/purge/<card>`: anyone can clear a card's cache over and over, which pushes traffic back onto Supabase. *Fix:* only allow it right after a real save (for example, have the save response return a short-lived key).
  - `/api/hit`: anyone can inflate a card's visit counts. That's acceptable for "basic analytics", but label the numbers as approximate.
  - `/api/upload`: this only checks the browser `Origin` header, which scripts can fake. Anyone could fill R2 with 2 MB images. *Fix:* require a Turnstile token or a short-lived upload ticket, cap uploads per IP, and clean up images no card uses.
- 🟠 **Photos can still be saved inside the database.** `place_order` and edit saves still accept `data:image…` photos (up to 3 MB of text). If an R2 upload fails, the photo ends up in the database and every card view sends it again. *Fix:* now that R2 works, reject `data:` photos on the server.
- 🟠 **The old Supabase upload route is still open.** Anonymous users can upload to `photos/orders/`. R2 replaced it; remove the policy once R2 has run fine for a week.
- 🟠 **Backups miss some data.** The nightly backup covers the `public` database schema only. It doesn't include admin logins (`auth` schema), Supabase storage photos, or R2 photos. *Fix:* add the `auth` schema to the dump, and write a short "how to restore" note. R2 photos can be re-uploaded if needed, but that should be a deliberate choice.
- 🟡 **The cache is per region.** Cloudflare's cache lives in each data centre. A client edit refreshes only the region they saved from; other regions can show the old card for up to 5 minutes. The confirmation message already says this. It's fine at your size.
- 🟡 **The code exists in three places:** the project files, `github-repo/`, and the pages inside `_worker.js`. Uploading by hand through the GitHub website makes it easy to miss a file. *Fix:* use GitHub Desktop to push the whole folder, not single files.

## Lead Engineer (does the code do what it says)

- 🟠 **A client edit overwrites some admin customisations.** The edit form rebuilds `category`, `tagline` and `preset` from the chosen design, so a custom tagline you wrote in the Admin Panel is replaced when the client saves. "Other" professions also lose their custom text. *Fix:* keep the existing values unless the client changes the design.
- 🟠 **Turnstile tokens work once.** After a failed attempt (e.g. an invalid coupon) or a second lead from the same page, the old token is reused and rejected. Only the "bot check" error resets the widget. *Fix:* reset the widget after every submit, whatever the result.
- 🟠 **Order numbers are made in the browser first.** The server replaces them, which is correct. But if the network drops after the server saves the order, the client sees an error and may order again, creating a duplicate order and card. *Fix:* send a unique order key with each submit and have the server ignore repeats.
- 🟠 **The link-name check is only a hint.** It checks `public_cards`, which hides paused cards, so it can suggest a name that's already taken. The server then adds a number to make it unique, so this is safe. The link shown before the order is placed may differ from the final one. Minor.
- 🟡 **The 6 MB GIF** on your own card is the slowest thing on the site and it's the first card people see. Re-export it as a small MP4/WebM (~500 KB) or a smaller GIF.
- 🟡 **The Admin Panel stores links for the session only.** A new edit link disappears on refresh (by design). Make the note next to it more prominent so you don't lose one.
- 🟡 **Analytics count one visit per browser session.** Bots and link previews (WhatsApp, iMessage) may count as visits. Label them "approximate".
- ✅ **Checked and fine:**
  - The site routes (`/`, `/c/`, `/e/`, `/order`, slugs) and the files each page loads
  - Upload checks by file content, not the name
  - Edit links stored only as a hash, and blocked after expiry
  - Coupon prices and discounts worked out on the server
  - Security headers, `noindex` on the edit and Admin pages
  - Admin-only stats

## Product Owner (does it make sense for customers and the business)

- 🔴 Top 8 items 1, 2, 3 and 6 are product problems first.
- 🟠 **GST.** You can only charge 18% GST if you're GST-registered. If you're not registered yet, charging it is a problem. Confirm before payments go live.
- 🟠 **The two roadmaps disagree on premium pricing.** Motion is ₹3,999 on the site, but the growth plan talks about a "₹999 premium tier". Pick one ladder, for example Digital ₹799 → Motion ₹3,999, and drop the ₹999 idea, or define it.
- 🟠 **No renewal flow.** There are no reminders (30 / 7 / 0 days), no "Renew" button on expired cards, and no renewal payment. Renewals are the whole recurring-revenue model. Build this straight after payments.
- 🟠 **Clients can't see their own stats.** You collect visits, saves and taps but only admins see them. Showing clients "37 people saved your contact this month" on their edit page is the best reason for them to renew.
- 🟠 **Legal pages need updating** for what the site now does:
  - Visit and tap tracking (with visitor country)
  - Cloudflare Turnstile
  - Lead capture, and who sees the leads
  - Photo storage on R2
  - The nightly backups and how long they're kept (30 days)

  This matters for India's DPDP Act and for app-store and payment-provider checks.
- 🟡 **The card home page shows your card.** `card.nexbizrise.com/` opens Sandeep's card. That's fine as a demo, but a first-time visitor may be confused. Consider a short "Get your card" page there.
- 🟡 **Design-for-me orders have no follow-up.** The order says "we'll message you" but there's no reminder for you (email or WhatsApp to admin) when a new order comes in.
- 🟡 **Your setup list is getting long.** Cloudflare bindings, 5 variables, 2 GitHub secrets, 1 SQL row. Keep one checklist in `Roadmap & Infra Review.md` so none are missed.

---

## Suggested order after your test round

1. Stop free live cards (#1) and enforce expiry (#2): both small database changes.
2. Finish the Turnstile + worker secret setup in one go (#4, #5), and reset the token after every submit.
3. Admin Panel: leads tab, cache refresh after save, send the edit link on WhatsApp (#3, #6, #7).
4. Reject `data:` photos, lock down `/api/upload` and `/api/purge`.
5. Emails (card ready, new lead, renewal reminders), then payments, then renewals.
6. Legal page updates, GST decision.

_Things I couldn't check from here: the live Cloudflare and Supabase settings, real phones and browsers, and whether Pages applies `_routes.json` with this worker setup. Please check these during your test round._
