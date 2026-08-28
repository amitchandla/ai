-- ============================================================
-- BizGrow AI — Supabase schema
-- Run this in Supabase Dashboard -> SQL Editor (or via `supabase db push`).
-- Safe to re-run: uses `create table if not exists` and `drop policy if exists`.
-- ============================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";

-- ============================================================
-- PHASE 1 TABLES (used by this build: auth, onboarding, dashboard shell)
-- ============================================================

-- One row per authenticated user, created automatically on signup.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  mobile text,
  preferred_language text not null default 'en' check (preferred_language in ('en','hi','hinglish')),
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The "Business Brain" — one business per owner for now (multi-business per
-- owner can be added later by dropping the uniqueness constraint).
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text,
  owner_name text,
  phone text,
  whatsapp text,
  contact_email text,
  country text,
  state text,
  city text not null,
  area text,
  address text,
  website text,
  instagram text,
  facebook text,
  products text[] default '{}',
  services text[] default '{}',
  prices text,
  target_customers text,
  usp text,
  offers text,
  opening_hours text,
  brand_info text,
  language text not null default 'en' check (language in ('en','hi','hinglish')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id)
);

-- Subscription / trial state — server-controlled, never trust the client.
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null default 'trial',
  status text not null default 'trial' check (status in ('trial','active','past_due','canceled','expired')),
  trial_start timestamptz not null default now(),
  trial_end timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

-- Admin-editable plans (Pricing section reads this table).
create table if not exists public.plans (
  id text primary key,
  name text not null,
  price text not null,
  period text not null default '/month',
  description text,
  features text[] default '{}',
  highlighted boolean not null default false,
  sort_order int not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Admin-editable FAQ content.
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Admin-managed announcements shown in the user dashboard.
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  type text not null default 'info' check (type in ('info','warning','success')),
  start_date timestamptz not null default now(),
  end_date timestamptz not null default (now() + interval '30 days'),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Admin accounts (separately controlled — NOT the same as profiles.is_admin
-- alone; use this table to explicitly allowlist who can reach /admin).
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin','superadmin')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- PHASE 2+ TABLES (schema ready now so later phases don't require
-- destructive migrations; RLS included; app code does not use these yet)
-- ============================================================

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  source text,
  requirement text,
  status text not null default 'new' check (status in ('new','contacted','interested','quotation','won','lost')),
  notes text,
  next_follow_up timestamptz,
  last_contact timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  source text,
  last_interaction timestamptz,
  total_interactions int not null default 0,
  notes text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  type text not null,
  message text,
  status text not null default 'pending' check (status in ('pending','sent','skipped')),
  scheduled_for timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.content (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  type text not null, -- reel_script, caption, post, story, etc.
  platform text,
  body text,
  status text not null default 'draft' check (status in ('draft','approved','archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  title text,
  use_cases text[] default '{}', -- instagram_reel, instagram_story, meta_ad, whatsapp_status, youtube_short
  status text not null default 'draft' check (status in ('draft','generating','ready','approved','failed')),
  asset_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  type text not null default 'meta_ads',
  goal text,
  budget numeric,
  duration_days int,
  status text not null default 'draft' check (status in ('draft','pending_approval','pending_meta_connection','launched','paused')),
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  rating int check (rating between 1 and 5),
  sentiment text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.usage (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  metric text not null, -- e.g. 'videos_generated', 'ai_messages'
  period_start date not null,
  count int not null default 0,
  unique (business_id, metric, period_start)
);

create table if not exists public.ai_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.feature_flags (
  key text primary key,
  enabled boolean not null default true,
  plan_limits jsonb default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

-- ============================================================
-- Auto-create profile + subscription row on signup
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, mobile)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'mobile')
  on conflict (id) do nothing;

  insert into public.subscriptions (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.subscriptions enable row level security;
alter table public.plans enable row level security;
alter table public.faqs enable row level security;
alter table public.announcements enable row level security;
alter table public.admin_users enable row level security;
alter table public.leads enable row level security;
alter table public.customers enable row level security;
alter table public.follow_ups enable row level security;
alter table public.content enable row level security;
alter table public.videos enable row level security;
alter table public.campaigns enable row level security;
alter table public.reviews enable row level security;
alter table public.usage enable row level security;
alter table public.ai_settings enable row level security;
alter table public.feature_flags enable row level security;
alter table public.activity_logs enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- profiles: user can read/update only their own row
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id or public.is_admin());
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- businesses: owner-only CRUD; admin can read
drop policy if exists "businesses_select_own" on public.businesses;
create policy "businesses_select_own" on public.businesses for select using (auth.uid() = owner_id or public.is_admin());
drop policy if exists "businesses_insert_own" on public.businesses;
create policy "businesses_insert_own" on public.businesses for insert with check (auth.uid() = owner_id);
drop policy if exists "businesses_update_own" on public.businesses;
create policy "businesses_update_own" on public.businesses for update using (auth.uid() = owner_id);
drop policy if exists "businesses_delete_own" on public.businesses;
create policy "businesses_delete_own" on public.businesses for delete using (auth.uid() = owner_id);

-- subscriptions: read-only for the owner; only admin/service-role can write
drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "subscriptions_admin_write" on public.subscriptions;
create policy "subscriptions_admin_write" on public.subscriptions for update using (public.is_admin());

-- plans / faqs / announcements: public read of active rows, admin-only write
drop policy if exists "plans_public_read" on public.plans;
create policy "plans_public_read" on public.plans for select using (is_active or public.is_admin());
drop policy if exists "plans_admin_write" on public.plans;
create policy "plans_admin_write" on public.plans for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "faqs_public_read" on public.faqs;
create policy "faqs_public_read" on public.faqs for select using (is_active or public.is_admin());
drop policy if exists "faqs_admin_write" on public.faqs;
create policy "faqs_admin_write" on public.faqs for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "announcements_public_read" on public.announcements;
create policy "announcements_public_read" on public.announcements for select using (is_active or public.is_admin());
drop policy if exists "announcements_admin_write" on public.announcements;
create policy "announcements_admin_write" on public.announcements for all using (public.is_admin()) with check (public.is_admin());

-- admin_users: only admins can see the admin list
drop policy if exists "admin_users_admin_only" on public.admin_users;
create policy "admin_users_admin_only" on public.admin_users for select using (public.is_admin());

-- business-scoped tables (leads, customers, follow_ups, content, videos,
-- campaigns, reviews, usage, activity_logs): owner-of-business only
do $$
declare
  t text;
begin
  foreach t in array array['leads','customers','follow_ups','content','videos','campaigns','reviews','usage','activity_logs']
  loop
    execute format($f$
      drop policy if exists "%1$s_owner_all" on public.%1$s;
      create policy "%1$s_owner_all" on public.%1$s for all
        using (exists (select 1 from public.businesses b where b.id = %1$s.business_id and b.owner_id = auth.uid()) or public.is_admin())
        with check (exists (select 1 from public.businesses b where b.id = %1$s.business_id and b.owner_id = auth.uid()));
    $f$, t);
  end loop;
end $$;

-- ai_settings / feature_flags: admin-only, everyone else has no access
drop policy if exists "ai_settings_admin_only" on public.ai_settings;
create policy "ai_settings_admin_only" on public.ai_settings for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "feature_flags_read" on public.feature_flags;
create policy "feature_flags_read" on public.feature_flags for select using (true);
drop policy if exists "feature_flags_admin_write" on public.feature_flags;
create policy "feature_flags_admin_write" on public.feature_flags for insert with check (public.is_admin());
drop policy if exists "feature_flags_admin_update" on public.feature_flags;
create policy "feature_flags_admin_update" on public.feature_flags for update using (public.is_admin());

-- ============================================================
-- Seed default plans + FAQs (safe to re-run)
-- ============================================================

insert into public.plans (id, name, price, period, description, features, highlighted, sort_order)
values
  ('starter','Starter','₹999','/month','For a single business getting started with AI growth.',
   array['Daily Growth Advisor','Lead & customer CRM','5 AI videos / month','3 languages (EN / HI / Hinglish)','Email support'], false, 1),
  ('growth','Growth','₹2,499','/month','For businesses actively running social media and ads.',
   array['Everything in Starter','25 AI videos / month','Meta Ads assistant','Customer reactivation campaigns','Priority support'], true, 2),
  ('pro','Pro','₹4,999','/month','For growing teams who want the full toolkit.',
   array['Everything in Growth','100 AI videos / month','Weekly AI business reports','Multiple team members','Dedicated onboarding'], false, 3)
on conflict (id) do update set
  name = excluded.name, price = excluded.price, period = excluded.period,
  description = excluded.description, features = excluded.features,
  highlighted = excluded.highlighted, sort_order = excluded.sort_order;

insert into public.faqs (question, answer, sort_order)
values
  ('Do I need to know how to use AI?', 'No. Tell BizGrow AI about your business once, and it studies your business and tells you what to do next in plain language.', 1),
  ('Will my videos look like cartoons?', 'No. BizGrow AI generates realistic, professional, commercial-style videos by default, using your own product photos and brand assets where possible.', 2),
  ('What happens after the 7-day free trial?', 'You''ll be asked to choose a plan to continue. Your trial period and dates are tracked securely on our servers, not in your browser.', 3),
  ('Can I use BizGrow AI in Hindi?', 'Yes. Choose English, Hindi or Hinglish at signup, and switch anytime from Settings.', 4),
  ('Will BizGrow AI run ads or spend money without asking me?', 'Never. Every ad campaign and every message is shown to you for approval first.', 5)
on conflict do nothing;
