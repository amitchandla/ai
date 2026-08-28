# BizGrow AI — Phase 1 (Landing + Auth + Onboarding + Dashboard Shell)

"Your AI Business Growth Assistant" — this phase covers the marketing site,
real Supabase authentication, business onboarding ("Business Brain"), and
the dashboard shell. The Daily Growth Advisor AI backend and the other
dashboard features (CRM, Video Studio, Ads, Reports, Admin Panel) are the
next build phases — see "What's next" below.

## 1. Project structure

```
bizgrow-ai/
├── index.html
├── src/
│   ├── main.jsx, App.jsx          # entry point + all routes
│   ├── index.css                  # Tailwind v4 theme tokens (design system)
│   ├── lib/
│   │   ├── supabase.js            # Supabase client
│   │   ├── validation.js          # signup form validation
│   │   └── remoteConfig.js        # fetch plans/faqs/announcements from Supabase
│   ├── context/
│   │   ├── AuthContext.jsx        # real Supabase auth + profile/business state
│   │   └── LanguageContext.jsx    # EN / HI / Hinglish
│   ├── config/
│   │   ├── translations.js        # UI strings per language
│   │   └── fallbackConfig.js      # local fallback plans/FAQs (used until DB is seeded)
│   ├── components/                # Logo, Button, Field, AuthLayout, RouteGuards, etc.
│   └── pages/
│       ├── Landing.jsx
│       ├── Signup.jsx / Login.jsx / ForgotPassword.jsx / ResetPassword.jsx
│       ├── Onboarding.jsx + onboarding/Step*.jsx   (5-step wizard)
│       └── dashboard/             # DashboardLayout, Overview, Settings, ComingSoon
└── supabase/
    └── schema.sql                 # full DB schema, RLS policies, seed data
```

## 2. Supabase setup

1. Create a project at https://supabase.com.
2. Go to **SQL Editor** → paste the entire contents of `supabase/schema.sql` → Run.
   This creates every table (including Phase 2+ tables so future work doesn't
   need destructive migrations), enables Row Level Security everywhere, adds
   the trigger that auto-creates a `profiles` row + a 7-day trial
   `subscriptions` row when someone signs up, and seeds default plans + FAQs.
3. Go to **Project Settings → API** and copy the **Project URL** and
   **anon/public key**.
4. Copy `.env.example` to `.env` in the project root and fill in those two values:
   ```
   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   VITE_SUPABASE_ANON_KEY=your_public_anon_key_here
   ```
5. In **Authentication → URL Configuration**, add your site URL (and
   `http://localhost:5173` for local dev) to the allowed redirect URLs, so
   password-reset emails link back correctly to `/reset-password`.

Until `.env` is filled in, the app still runs and shows a small banner at
the top saying Supabase isn't connected — no crashes, no fake data.

## 3. Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # preview the production build
```

## 4. Deploy to Cloudflare Pages

1. Push this project to a GitHub repo.
2. In Cloudflare dashboard -> **Workers & Pages -> Create -> Pages -> Connect to Git**.
3. Build settings:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Add environment variables in **Settings -> Environment variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy. Re-add the deployed URL to Supabase's allowed redirect URLs
   (Authentication -> URL Configuration) so password reset works in production.

## 5. How the pieces work

- **Auth** — `src/context/AuthContext.jsx` wraps real
  `supabase.auth.signUp / signInWithPassword / signOut / resetPasswordForEmail
  / updateUser`. No passwords are ever stored or handled manually.
- **7-day trial** — created **server-side** by the `handle_new_user()` trigger
  in `schema.sql` the moment a user signs up, so it can't be reset by
  clearing browser storage. `subscriptions.trial_end` is the source of truth.
- **Business Brain** — the 5-step onboarding wizard
  (`src/pages/Onboarding.jsx`) writes one row to `businesses` on the final
  step. `RouteGuards.jsx` sends users without a business row to `/onboarding`
  and users who already have one straight to `/dashboard`.
- **Config-driven pricing/FAQs** — `src/lib/remoteConfig.js` reads the
  `plans` and `faqs` tables (editable by an admin later, no redeploy
  needed) and only falls back to the local defaults in
  `src/config/fallbackConfig.js` if the tables are empty/unreachable.
- **RLS** — every table is owner-scoped via `auth.uid()`; business-linked
  tables (leads, customers, etc.) check ownership through a subquery on
  `businesses.owner_id`. Nothing trusts an ID sent from the client.

## 6. Honesty notes (per the "no fake data" requirement)

- The dashboard's "Today's Growth Plan" card does **not** show invented
  suggestions. It explains that the Growth Advisor connects once real
  business data (leads/customers/calendar) is flowing, and is visibly
  labeled "Coming online in the next build phase."
- Every other sidebar section (Leads, Video Studio, Ads, Reports, AI Help,
  etc.) renders an honest "Being built next" state instead of dummy UI or
  placeholder numbers.
- Nothing charges money, sends a message, or publishes anything —
  those flows don't exist yet, on purpose.

## 7. What's next (not built in this phase)

- Daily Growth Advisor AI backend — Supabase Edge Function that calls Claude
  server-side using the Business Brain + leads/customers, so the AI key
  never touches the browser.
- Lead & Customer CRM (full create/edit/pipeline UI)
- AI Follow-up, Customer Reactivation, Review Booster
- AI Video Studio (generation workflow, platform-specific exports)
- Meta Ads assistant (campaign builder, real Meta OAuth connection)
- Business Reports (weekly AI summary from real usage data)
- AI Help floating assistant
- Admin Panel (users, plans, AI settings, feature flags, announcements, FAQs)
- Razorpay billing integration (architecture is ready — `subscriptions`
  table already models `status`/`plan_id`; no payment code exists yet)

## 8. Testing done so far

- Signup validation (name, email, 10-digit Indian mobile starting 6-9,
  password strength, confirm-password match, terms checkbox)
- Signup -> Supabase auth.users row -> trigger creates profile + trial
  subscription (verify in Supabase Table Editor after a real signup)
- Login / logout via real Supabase session
- Forgot password -> reset email -> `/reset-password` -> new password -> login
  (requires SMTP configured in Supabase Auth settings, or Supabase's default
  test email sender)
- Onboarding wizard writes a real `businesses` row; edit works from Settings
- Route guards: logged-out users can't reach `/dashboard` or `/onboarding`;
  users without a business are redirected to `/onboarding`; users with a
  business skip straight to `/dashboard`
- Production build passes (`npm run build`)
- Not yet tested: real email delivery for password reset (depends on your
  Supabase SMTP configuration, which needs your credentials)
