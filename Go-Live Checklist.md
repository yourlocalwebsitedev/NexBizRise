# Go-live checklist (nbr-test → nexbizrise)

Test everything on `https://nbr-test.yourlocalwebsitedev.workers.dev` first. When it all works, do the steps below once.

## 1. Supabase (already done if you ran it for testing)
- [ ] `supabase/ALL-IN-ONE.sql` run (latest version)
- [ ] `insert … ('worker', '<NBR_WORKER_SECRET>')`, after Turnstile works on live
- [ ] `insert … ('cron', '<CRON_KEY>')`, for renewal emails

## 2. Cloudflare Pages project `nexbizrise` → Settings
Set each of these in **both Production and Preview**. Names must match exactly (capitals).

**Bindings**
- [ ] R2 bucket: `PHOTOS` → `nbr-photos`
- [ ] Analytics Engine: `STATS` → `nbr_events`

**Variables and secrets**
- [ ] `IMG_BASE` = `https://img.nexbizrise.com/`
- [ ] `CF_API_TOKEN` (secret)
- [ ] `CF_ACCOUNT_ID`
- [ ] `NBR_WORKER_SECRET` (secret, the same value as in Supabase `app_secrets`)
- [ ] `TURNSTILE_SECRET` (secret), only after the site key is in the pages
- [ ] `BREVO_API_KEY` (secret, main email provider)
- [ ] `RESEND_API_KEY` (secret, backup provider, used when Brevo fails or hits its limit)
- [ ] `MAIL_FROM` = `NexBizRise <cards@nexbizrise.com>`
- [ ] `MAIL_PROVIDERS` (optional, default `brevo,resend`: the order to try providers in)
- [ ] `ADMIN_EMAIL` (optional: leave out to skip admin alert emails and save quota)

**Turnstile widget**
- [ ] Domains: `nexbizrise.com`, `card.nexbizrise.com`, `nexbizrise.pages.dev`, `nbr-test.yourlocalwebsitedev.workers.dev`

**Test-only / safety**
- [ ] `DEBUG_CHECK` = `1` on **nbr-test only** (turns on `/api/upload-check`). Never on the live site.
- [ ] Live Worker/Pages → Settings → Observability: turn **off** invocation logs (they record URLs, including edit links)

## 3. GitHub repo → Settings → Secrets → Actions
- [ ] `SUPABASE_DB_URL`
- [ ] `BACKUP_PASSPHRASE`
- [ ] `CRON_KEY`

## 4. Push
- [ ] Push the whole `github-repo/` folder to `main`, once
- [ ] Wait for the Cloudflare deployment to finish, then click **Retry deployment** if you added variables after it started
- [ ] `https://nexbizrise.com/__health` shows the latest version
- [ ] `https://nexbizrise.com/api/upload-check` shows every setting as `true`
- [ ] Actions → **Nightly database backup + keep-alive** → Run workflow → all green

## 5. Quick live check
- [ ] Order with a photo: the photo appears in R2 `p/`
- [ ] Card opens at `card.nexbizrise.com/c/nbr_…`
- [ ] Edit link saves
- [ ] Lead shows in Admin → Leads
- [ ] Emails arrive

## 6. Afterwards
- [ ] Delete test orders, cards and leads in the Admin Panel
- [ ] Keep or delete the `nbr-test` Worker (it costs nothing idle)
