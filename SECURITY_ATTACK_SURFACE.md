# NexBizRise: attack surface inventory

Scope: the code and configuration that exists in this project, as of 2026-09-27. Anything not listed here does not exist in this project (see "Not in this project").

## Architecture

- **Cloudflare Worker** (`deploy/single/_worker.js`) serves every page from strings embedded in the file. There is no server-side application logic: static pages plus routing and headers only.
- **Browser pages** (Design Components, plain JS, no build step): website (`index.html`), order form (`order.html`), client card (`card.html`), admin panel (`Admin Panel.dc.html`).
- **Supabase** project `hyaqvmrtqafqhbhcdecd`: PostgREST, Auth (email and password, admin only) and Storage bucket `photos`. The browser uses only the **publishable** key.

## Public routes (Worker)

| Host | Path | Serves |
|---|---|---|
| nexbizrise.com / www | `/`, `/index` | Website |
| card.nexbizrise.com | `/order` | Order form |
| card.nexbizrise.com | `/<slug>` (`[a-z0-9-]`) | Client card |
| any | `/card`, `/order`, `/index` (+ `.html`) | Same pages |
| any | `/Admin Panel.dc.html` | Admin panel (auth enforced by Supabase, not the Worker) |
| any | `/Order Card.dc.html`, `/Tap Card.dc.html`, `/support.js`, `/qrcode.js`, `/assets/*`, `/portrait.*` | Assets |
| any | `/__health` | Version string |
| any | `/portrait.gif` | Falls back to a 302 redirect to a fixed workers.dev URL (not user-controlled) |

Methods: GET and HEAD only (others return 405 from v51). HTTP redirects to HTTPS (v51).

## Supabase endpoints used by the browser

| Endpoint | Caller | Auth | Notes |
|---|---|---|---|
| `GET /rest/v1/public_cards` | card page, order form (slug check) | anon | View of live cards; limited columns |
| `GET /rest/v1/public_card_extras` | card page | anon | Allowlisted extras keys |
| `POST /rest/v1/rpc/place_order` | order form | anon | SECURITY DEFINER; rate limit 20/h/IP |
| `POST /rest/v1/rpc/submit_lead` | card lead form | anon | SECURITY DEFINER; 10/h/IP and 5/day per phone per card |
| `POST /storage/v1/object/photos/orders/*` | order form | anon | Insert only, images only, 5 MB |
| `auth/v1/token` (password) | admin panel | email+password | Supabase Auth |
| `cards`, `orders`, `leads`, `admins`, `storage.objects` | admin panel | authenticated + in `admins` | RLS |

## Tables and functions

- **Tables:** `cards` (no anon grant), `orders` (RLS admin-only), `leads` (RLS admin-only), `admins` (RLS), `rate_hits` (RLS, no policies).
- **Views:** `public_cards`, `public_card_extras` (anon SELECT).
- **Functions:**
  - `place_order` and `submit_lead` are public wrappers.
  - `place_order_core`, `submit_lead_core` and `rate_check` are revoked from anon and authenticated.
  - All of these are SECURITY DEFINER with `search_path = public`.
- **Storage:** bucket `photos` is public-read by URL. Anon can insert into `orders/` only.

## Roles

- **Anonymous visitor:** views cards, places orders, submits leads.
- **Admin:** a Supabase Auth user listed in `public.admins`.

There are no business or tenant accounts yet. Card owners have no login.

## Secrets

- In the browser: the Supabase URL and the publishable key (intended to be public).
- The service-role key, Stripe and Twilio keys are **not** present anywhere in the project (grep verified).

## Browser storage

| Key | Where | Contents |
|---|---|---|
| `nbr-order-draft` | order form | Unfinished order: name, phone, email, photo. Cleared after the order is placed or reset. |
| `nbr-orders` | order form, admin | Local copy of orders placed when Supabase was unreachable |
| `nbr-theme` | admin | UI theme |
| `sb-…-auth-token` | admin | Supabase session (supabase-js default) |

There are no cookies set by NexBizRise. Google Fonts is the only third-party request (it sees visitor IPs). There are no analytics or advertising scripts.

## Not in this project

These are needed before the related parts of the audit can happen:
- Twilio
- n8n
- Gemini
- Google Calendar
- Supabase Edge Functions
- React/TypeScript app
- package.json and other dependencies
- CI/CD
- GitHub repository

If they exist elsewhere, share them for audit (**NEEDS MANUAL REVIEW**).
