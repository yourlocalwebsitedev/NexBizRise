-- ================================================================
-- NexBizRise — COMPLETE database setup (latest). Paste ALL of this into
-- Supabase → SQL Editor → Run. Safe to run again any time.
-- Replaces: orders.sql, fix-colour-check.sql, security.sql
-- ================================================================

-- 0) Make sure the cards table has every column the order form and admin use (safe to re-run)
alter table public.cards
  add column if not exists layout text default 'original',
  add column if not exists region text default 'IN',
  add column if not exists notes text default '',
  add column if not exists plan text default 'basic',
  add column if not exists renewal date,
  add column if not exists active boolean default true,
  add column if not exists city text default '',
  add column if not exists profession text default '',
  add column if not exists profession_other text default '',
  add column if not exists phone_display text default '',
  add column if not exists signature text default '',
  add column if not exists titles text default '',
  add column if not exists contact_photo_url text default '',
  add column if not exists show_powered_by boolean default true,
  add column if not exists photo_x numeric default 50,
  add column if not exists photo_y numeric default 50,
  add column if not exists photo_zoom numeric default 1,
  add column if not exists extras jsonb not null default '{}'::jsonb;  -- per-profession fields (brokerage, license, listings, booking, office, lead_capture…)

-- Permanent card IDs for QR codes (/c/nbr_xxxxxx). Never change once set, so printed QRs keep working if the name link changes.
create or replace function public.new_public_id() returns text language plpgsql volatile set search_path = public as $$
declare v text;
begin
  loop
    v := 'nbr_' || substr(md5(gen_random_uuid()::text), 1, 6);
    exit when not exists (select 1 from public.cards where public_id = v);
  end loop;
  return v;
end $$;
alter table public.cards add column if not exists public_id text;
alter table public.cards alter column public_id set default public.new_public_id();
update public.cards set public_id = public.new_public_id() where public_id is null;
create unique index if not exists cards_public_id_key on public.cards (public_id);
create or replace function public.keep_public_id() returns trigger language plpgsql as $$
begin new.public_id := old.public_id; return new; end $$;
drop trigger if exists cards_keep_public_id on public.cards;
create trigger cards_keep_public_id before update on public.cards for each row when (old.public_id is not null) execute function public.keep_public_id();

-- Colour holds Personal colours and Professional/Luxury style ids (pro-*, lux-*)
alter table public.cards drop constraint if exists cards_colour_check;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text unique not null,
  mode text not null check (mode in ('builder','dfm')),
  plan text not null check (plan in ('basic','motion')),
  region text not null default 'US' check (region in ('IN','US')),
  price numeric not null,
  currency text not null default 'USD',
  status text not null default 'new' check (status in ('new','in_progress','delivered')),
  customer_name text, customer_email text, customer_phone text, notes text,
  card jsonb not null,
  card_id uuid references public.cards(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.orders add column if not exists region text not null default 'US';
alter table public.orders add column if not exists tax numeric not null default 0;
alter table public.orders add column if not exists total numeric;
alter table public.orders add column if not exists coupon text;
alter table public.orders add column if not exists discount numeric not null default 0;
alter table public.orders enable row level security;
create index if not exists orders_created_idx on public.orders (created_at desc);
drop policy if exists "admins manage orders" on public.orders;
create policy "admins manage orders" on public.orders for all
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- ================================================================
-- RATE LIMITS by visitor IP (Cloudflare / proxy header)
-- ================================================================
create table if not exists public.rate_hits (
  id bigserial primary key, bucket text not null, ip text not null, created_at timestamptz not null default now());
create index if not exists rate_hits_idx on public.rate_hits (bucket, ip, created_at desc);
alter table public.rate_hits enable row level security;  -- no policies: nobody can read it from the site

create or replace function public.rate_check(p_bucket text, p_max int, p_window interval)
returns void language plpgsql security definer set search_path = public as $$
declare h json := coalesce(nullif(current_setting('request.headers', true), ''), '{}')::json;
        v_ip text := coalesce(h->>'cf-connecting-ip', split_part(h->>'x-forwarded-for', ',', 1), 'unknown');
begin
  delete from rate_hits where created_at < now() - interval '2 days';
  if (select count(*) from rate_hits where bucket = p_bucket and ip = v_ip and created_at > now() - p_window) >= p_max then
    raise exception 'too many requests';
  end if;
  insert into rate_hits (bucket, ip) values (p_bucket, v_ip);
end $$;
revoke all on function public.rate_check(text, int, interval) from public, anon, authenticated;

-- ================================================================
-- COUPONS (admin-managed). Prices and discounts are only ever computed here, never trusted from the browser.
-- ================================================================
create table if not exists public.coupons (
  code text primary key check (code ~ '^[A-Z0-9_-]{4,32}$'),
  kind text not null check (kind in ('percent','amount')),
  value numeric not null check (value > 0),
  region text check (region in ('IN','US')),             -- null = any region (percent only)
  plan text check (plan in ('basic','motion')),          -- null = any plan
  max_uses int check (max_uses is null or max_uses > 0), -- null = unlimited
  per_email int not null default 1 check (per_email > 0),
  uses int not null default 0,
  starts_at timestamptz,
  expires_at timestamptz,
  active boolean not null default true,
  note text default '',
  created_at timestamptz not null default now(),
  constraint coupon_percent_range check (kind <> 'percent' or value <= 100),
  constraint coupon_amount_region check (kind <> 'amount' or region is not null)
);
alter table public.coupons enable row level security;
drop policy if exists "admins manage coupons" on public.coupons;
create policy "admins manage coupons" on public.coupons for all
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));
revoke all on public.coupons from anon;

create table if not exists public.coupon_redemptions (
  id bigserial primary key,
  code text not null references public.coupons(code) on delete cascade,
  order_no text not null,
  email text not null default '',
  discount numeric not null,
  created_at timestamptz not null default now()
);
create index if not exists coupon_redemptions_idx on public.coupon_redemptions (code, lower(email));
alter table public.coupon_redemptions enable row level security;
drop policy if exists "admins read redemptions" on public.coupon_redemptions;
create policy "admins read redemptions" on public.coupon_redemptions for select
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));
revoke all on public.coupon_redemptions from anon;

-- Internal: validate a coupon and return the discount on the base price. Same generic error for every failure (no hints for guessing).
create or replace function public.coupon_discount(p_code text, p_plan text, p_region text, p_email text, p_lock boolean default false)
returns numeric language plpgsql security definer set search_path = public as $$
declare c coupons; v_base numeric;
begin
  v_base := case when p_region = 'IN' then (case p_plan when 'motion' then 3999 else 799 end) else (case p_plan when 'motion' then 129 else 49 end) end;
  if p_lock then select * into c from coupons where code = upper(trim(p_code)) for update;
  else select * into c from coupons where code = upper(trim(p_code)); end if;
  if c.code is null or not c.active
     or (c.starts_at is not null and now() < c.starts_at)
     or (c.expires_at is not null and now() > c.expires_at)
     or (c.region is not null and c.region <> p_region)
     or (c.plan is not null and c.plan <> p_plan)
     or (c.max_uses is not null and c.uses >= c.max_uses)
     or (coalesce(p_email,'') <> '' and (select count(*) from coupon_redemptions r where r.code = c.code and lower(r.email) = lower(trim(p_email))) >= c.per_email)
  then raise exception 'invalid coupon'; end if;
  return least(v_base, case when c.kind = 'percent' then round(v_base * c.value / 100) else c.value end);
end $$;
revoke all on function public.coupon_discount(text, text, text, text, boolean) from public, anon, authenticated;

-- Public: preview a code at checkout. Rate limited to slow down guessing: 15 checks per hour per connection.
create or replace function public.check_coupon(p_code text, p_plan text, p_region text, p_email text default '')
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_region text := case when p_region = 'IN' then 'IN' else 'US' end;
        v_plan text := case when p_plan = 'motion' then 'motion' else 'basic' end;
        v_base numeric; v_disc numeric; v_tax numeric;
begin
  perform rate_check('coupon', 15, interval '1 hour');
  if coalesce(p_code,'') !~* '^[A-Z0-9_-]{4,32}$' then return jsonb_build_object('ok', false); end if;
  begin v_disc := coupon_discount(p_code, v_plan, v_region, left(coalesce(p_email,''), 200));
  exception when others then return jsonb_build_object('ok', false); end;
  v_base := case when v_region = 'IN' then (case v_plan when 'motion' then 3999 else 799 end) else (case v_plan when 'motion' then 129 else 49 end) end;
  v_tax := case when v_region = 'IN' then round((v_base - v_disc) * 0.18) else 0 end;
  return jsonb_build_object('ok', true, 'code', upper(trim(p_code)), 'base', v_base, 'discount', v_disc, 'tax', v_tax, 'total', v_base - v_disc + v_tax);
end $$;
revoke all on function public.check_coupon(text, text, text, text) from public;
grant execute on function public.check_coupon(text, text, text, text) to anon, authenticated;

-- ================================================================
-- ORDERS: public entry point. Creates the order AND its client card in one step.
-- Builder orders go live immediately; "design it for me" cards start paused until delivered.
-- ================================================================
create or replace function public.place_order_core(payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_card jsonb := payload->'card';
  v_base text := left(regexp_replace(lower(coalesce(v_card->>'slug','card')), '[^a-z0-9-]', '', 'g'), 38);
  v_slug text := v_base;
  v_no text := 'NBR-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
  v_mode text := payload->>'mode';
  v_plan text := payload->>'plan';
  v_region text := case when payload->>'region' = 'IN' then 'IN' else 'US' end;
  v_price numeric;
  v_tax numeric;
  v_card_id uuid;
  v_ex jsonb;
  v_coupon text := nullif(upper(trim(coalesce(payload->>'coupon',''))), '');
  v_disc numeric := 0;
  v_pid text;
begin
  if v_mode not in ('builder','dfm') or v_plan not in ('basic','motion') then raise exception 'invalid order'; end if;
  if coalesce(v_card->>'first_name','') = '' or coalesce(v_card->>'phone','') = '' then raise exception 'missing fields'; end if;
  if length(payload::text) > 3000000 then raise exception 'payload too large'; end if;
  while exists (select 1 from cards where slug = v_slug) loop
    v_slug := v_base || (10 + floor(random() * 90))::int;
  end loop;
  v_card := v_card || jsonb_build_object('region', v_region, 'slug', v_slug, 'active', v_mode = 'builder', 'renewal', (current_date + interval '1 year')::date);

  -- Server-side input hardening (never trust the browser)
  v_ex := case when jsonb_typeof(v_card->'extras') = 'object' then v_card->'extras' else '{}'::jsonb end;
  v_ex := v_ex || jsonb_build_object(
    'facebook',     case when v_ex->>'facebook'     ~* '^https://[^\s<>"'']+$' then left(v_ex->>'facebook', 500)     else '' end,
    'listings_url', case when v_ex->>'listings_url' ~* '^https://[^\s<>"'']+$' then left(v_ex->>'listings_url', 500) else '' end,
    'booking_url',  case when v_ex->>'booking_url'  ~* '^https://[^\s<>"'']+$' then left(v_ex->>'booking_url', 500)  else '' end,
    'iabs_url',     case when v_ex->>'iabs_url'     ~* '^https://[^\s<>"'']+$' then left(v_ex->>'iabs_url', 500)     else '' end);
  v_card := v_card || jsonb_build_object(
    'extras', v_ex,
    'website',   case when v_card->>'website'   ~* '^https?://[^\s<>"'']+$' then left(v_card->>'website', 500)   else '' end,
    'instagram', case when v_card->>'instagram' ~* '^https://[^\s<>"'']+$'  then left(v_card->>'instagram', 500) else '' end,
    'linkedin',  case when v_card->>'linkedin'  ~* '^https://[^\s<>"'']+$'  then left(v_card->>'linkedin', 500)  else '' end,
    'photo_url', case when v_card->>'photo_url' ~ '^https://hyaqvmrtqafqhbhcdecd\.supabase\.co/storage/v1/object/public/photos/orders/[A-Za-z0-9._-]+$'
                        or v_card->>'photo_url' ~ '^https://(img\.nexbizrise\.com|(www\.|card\.)?nexbizrise\.com/img)/p/[a-f0-9]{24}\.(webp|jpg|png|gif)$'
                        or v_card->>'photo_url' ~ '^data:image/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$' then v_card->>'photo_url' else '' end,
    'contact_photo_url', '',
    'email',     case when v_card->>'email' ~* '^[^\s@<>]+@[^\s@<>]+\.[a-z]{2,}$' then left(v_card->>'email', 200) else '' end,
    'phone',     left(regexp_replace(coalesce(v_card->>'phone',''), '[^0-9+ ()-]', '', 'g'), 30),
    'whatsapp',  left(regexp_replace(coalesce(v_card->>'whatsapp',''), '[^0-9+ ()-]', '', 'g'), 30),
    'first_name', left(v_card->>'first_name', 60), 'last_name', left(coalesce(v_card->>'last_name',''), 60),
    'title', left(coalesce(v_card->>'title',''), 120), 'company', left(coalesce(v_card->>'company',''), 120),
    'tagline', left(coalesce(v_card->>'tagline',''), 120), 'category', left(coalesce(v_card->>'category',''), 60),
    'quote', left(coalesce(v_card->>'quote',''), 300), 'bio', left(coalesce(v_card->>'bio',''), 1200),
    'city', left(coalesce(v_card->>'city',''), 80), 'notes', left(coalesce(v_card->>'notes',''), 2000));
  if length(regexp_replace(v_card->>'phone', '\D', '', 'g')) < 7 then raise exception 'missing fields'; end if;

  insert into cards (extras, region, layout, photo_x, photo_y, photo_zoom, phone_display, signature, titles, contact_photo_url, show_powered_by,
    profession, profession_other, city, notes, slug, prefix, first_name, last_name, title, company, preset, colour, category, tagline,
    phone, whatsapp, email, linkedin, instagram, website, quote, bio, photo_url, plan, renewal, active)
  select coalesce(v_card->'extras', '{}'::jsonb), r.region, r.layout, r.photo_x, r.photo_y, r.photo_zoom, r.phone_display, r.signature, r.titles, r.contact_photo_url, r.show_powered_by,
    r.profession, r.profession_other, r.city, r.notes, r.slug, r.prefix, r.first_name, r.last_name, r.title, r.company, r.preset, r.colour, r.category, r.tagline,
    r.phone, r.whatsapp, r.email, r.linkedin, r.instagram, r.website, r.quote, r.bio, r.photo_url, v_plan, r.renewal, r.active
  from jsonb_populate_record(null::cards, v_card) r
  returning id, public_id into v_card_id, v_pid;

  v_price := case when v_region = 'IN' then (case v_plan when 'motion' then 3999 else 799 end) else (case v_plan when 'motion' then 129 else 49 end) end;
  if v_coupon is not null then
    v_disc := coupon_discount(v_coupon, v_plan, v_region, left(coalesce(payload->>'customer_email',''), 200), true);  -- row lock: no double-spend under concurrency
    update coupons set uses = uses + 1 where code = v_coupon;
    insert into coupon_redemptions (code, order_no, email, discount) values (v_coupon, v_no, left(coalesce(payload->>'customer_email',''), 200), v_disc);
  end if;
  v_tax := case when v_region = 'IN' then round((v_price - v_disc) * 0.18) else 0 end;
  insert into orders (order_no, mode, plan, region, price, tax, total, currency, customer_name, customer_email, customer_phone, notes, card, card_id, coupon, discount)
  values (v_no, v_mode, v_plan, v_region, v_price, v_tax, v_price - v_disc + v_tax,
    case when v_region = 'IN' then 'INR' else 'USD' end,
    left(payload->>'customer_name', 120), left(payload->>'customer_email', 200), left(payload->>'customer_phone', 40), left(payload->>'notes', 4000),
    v_card, v_card_id, v_coupon, v_disc);

  return jsonb_build_object('order_no', v_no, 'slug', v_slug, 'public_id', v_pid, 'discount', v_disc, 'total', v_price - v_disc + v_tax);
end $$;
revoke all on function public.place_order_core(jsonb) from public, anon, authenticated;

-- Production TODO: move photo data URLs into the "photos" storage bucket, add a bot check (Turnstile), email alert via Resend.

-- Let website orders upload their photo into photos/orders/ (images only; no read/update/delete for the public)
drop policy if exists "public order photo uploads" on storage.objects;
create policy "public order photo uploads" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = 'orders'
    and lower(storage.extension(name)) in ('jpg','jpeg','png','webp','gif'));

-- Stop the public from LISTING every uploaded photo (public URLs keep working because the bucket is public).
do $$ declare p record; begin
  for p in select policyname from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and cmd = 'SELECT'
      and (roles @> array['anon']::name[] or roles @> array['public']::name[])
      and coalesce(qual,'') ilike '%photos%'
  loop execute format('drop policy %I on storage.objects', p.policyname); end loop;
end $$;
drop policy if exists "admins read photos" on storage.objects;
create policy "admins read photos" on storage.objects for select to authenticated
  using (bucket_id = 'photos' and exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- ================================================================
-- Real-estate extras + lead capture (safe to re-run)
-- ================================================================

-- Leads captured from "Share your contact" on a card
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references public.cards(id) on delete cascade,
  slug text not null,
  name text not null,
  phone text not null,
  email text default '',
  topic text default '',
  message text default '',
  source text default 'card',
  status text not null default 'new' check (status in ('new','contacted','closed')),
  created_at timestamptz not null default now()
);
create index if not exists leads_card_idx on public.leads (card_id, created_at desc);
alter table public.leads enable row level security;
drop policy if exists "admins manage leads" on public.leads;
create policy "admins manage leads" on public.leads for all
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- Public entry point for the lead form. Light rate limit: 5 per phone per card per day.
create or replace function public.submit_lead_core(p_slug text, p_name text, p_phone text, p_email text default '', p_topic text default '', p_message text default '', p_source text default 'card')
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_card uuid; v_phone text := left(regexp_replace(coalesce(p_phone,''), '[^0-9+]', '', 'g'), 20);
begin
  select id into v_card from cards where slug = lower(p_slug) and active is not false and coalesce((extras->>'lead_capture')::boolean, true);
  if v_card is null then raise exception 'card not found'; end if;
  if length(coalesce(trim(p_name),'')) = 0 or length(regexp_replace(v_phone, '\D', '', 'g')) < 7 then raise exception 'missing fields'; end if;
  if (select count(*) from leads where card_id = v_card and phone = v_phone and created_at > now() - interval '1 day') >= 5 then raise exception 'too many'; end if;
  insert into leads (card_id, slug, name, phone, email, topic, message, source)
  values (v_card, lower(p_slug), left(trim(p_name), 120), v_phone, left(coalesce(p_email,''), 200), left(coalesce(p_topic,''), 40), left(coalesce(p_message,''), 1000), left(coalesce(p_source,'card'), 40));
  return jsonb_build_object('ok', true);
end $$;
revoke all on function public.submit_lead_core(text, text, text, text, text, text, text) from public, anon, authenticated;


-- ================================================================
-- SECURITY + PUBLIC VIEWS
-- ================================================================
-- A) Public card view: only the fields the card page shows, only live cards
drop view if exists public.public_cards;
create view public.public_cards as
  select public_id, slug, region, layout, preset, colour, category, tagline,
         prefix, first_name, last_name, title, company,
         photo_url, contact_photo_url, photo_x, photo_y, photo_zoom,
         quote, bio, signature, titles,
         phone, phone_display, whatsapp, email, linkedin, instagram, website, city,
         show_powered_by
  from public.cards
  where active is not false;
grant select on public.public_cards to anon, authenticated;

drop view if exists public.public_card_extras;
create view public.public_card_extras as
  select public_id, slug, jsonb_strip_nulls(jsonb_build_object(
    'brokerage', extras->'brokerage', 'license_no', extras->'license_no', 'license_state', extras->'license_state',
    'facebook', extras->'facebook', 'listings_url', extras->'listings_url', 'booking_url', extras->'booking_url',
    'office_address', extras->'office_address', 'iabs_url', extras->'iabs_url', 'lead_capture', extras->'lead_capture',
    'seasonal', extras->'seasonal', 'seasonal_addon', extras->'seasonal_addon', 'greeting', extras->'greeting', 'motion', to_jsonb(plan = 'motion'))) as extras
  from public.cards where active is not false;
grant select on public.public_card_extras to anon, authenticated;

-- B) Public entry points with limits.
-- Orders: 20 per hour per connection (a manager ordering for a team fits; bigger teams go through admin).
-- Leads: 10 per hour per connection.
drop function if exists public.place_order_limited(jsonb);
create or replace function public.place_order(payload jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
begin perform rate_check('order', 20, interval '1 hour'); return place_order_core(payload); end $$;
revoke all on function public.place_order(jsonb) from public;
grant execute on function public.place_order(jsonb) to anon, authenticated;

create or replace function public.submit_lead(p_slug text, p_name text, p_phone text, p_email text default '', p_topic text default '', p_message text default '', p_source text default 'card')
returns jsonb language plpgsql security definer set search_path = public as $$
begin perform rate_check('lead', 10, interval '1 hour'); return submit_lead_core(p_slug, p_name, p_phone, p_email, p_topic, p_message, p_source); end $$;
revoke all on function public.submit_lead(text, text, text, text, text, text, text) from public;
grant execute on function public.submit_lead(text, text, text, text, text, text, text) to anon, authenticated;

-- C) Photo uploads: images only, 5 MB max
update storage.buckets set file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif']
where id = 'photos';

-- D) Only safe link types stored on cards (https, tel, sms, mailto)
update public.cards set
  website   = case when website   ~* '^https?://' then website   else '' end,
  instagram = case when instagram ~* '^https?://' then instagram else '' end,
  linkedin  = case when linkedin  ~* '^https?://' then linkedin  else '' end
where coalesce(website,'') <> '' or coalesce(instagram,'') <> '' or coalesce(linkedin,'') <> '';


-- ================================================================
-- OPTIONAL one-time cleanup (keeps only 3 cards). Remove the "-- " to run.
-- ================================================================
-- Deletes every card and order EXCEPT these three cards (and their orders).
-- Run once in Supabase → SQL Editor. Check the preview result first, then run the delete block.

-- 1) Preview: what will be deleted
-- select slug, first_name, last_name, plan, region from public.cards
-- where slug not in ('neeharika7747', 'swamy3649', 'sandeep3649')
-- order by slug;

-- 2) Delete (runs as one transaction)
-- begin;
-- delete from public.orders
-- where card_id is null
--    or card_id not in (select id from public.cards where slug in ('neeharika7747', 'swamy3649', 'sandeep3649'));
-- delete from public.cards
-- where slug not in ('neeharika7747', 'swamy3649', 'sandeep3649');
-- commit;

-- 3) Confirm: should list only the three kept cards
-- select slug, first_name, last_name from public.cards order by slug;
