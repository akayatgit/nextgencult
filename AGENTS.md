## Cursor Cloud specific instructions

### Overview

NG Cult is an IT career counselling platform built with **Next.js 16** (App Router) + **TypeScript** + **Supabase**. It is a single Next.js application (not a monorepo).

### Running the app

Standard commands from `package.json`:
- `npm run dev` — starts dev server on port 3000
- `npm run build` — production build
- `npm run lint` — ESLint

### Environment variables

A `.env.local` file is needed with at minimum:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` — Supabase anon key

Without real Supabase credentials, the web UI still loads but API routes (roadmaps, admin, telegram) will return errors. Placeholder values allow the dev server to start and the homepage to render (roadmap cards show "No roadmaps available").

Optional env vars: `TELEGRAM_BOT_TOKEN`, `GOOGLE_SCRIPT_URL`, `GOOGLE_PLACES_API_KEY`, `CRON_SECRET`.

### Gotchas

- Lint currently has 21 pre-existing errors (mostly `@typescript-eslint/no-explicit-any` and `react/no-unescaped-entities`). These are in the existing codebase and not regressions.
- The Supabase client (`src/lib/supabase.ts`) sets `NODE_TLS_REJECT_UNAUTHORIZED=0` in server-side code. This is a development-only workaround.
- No automated test suite exists (no `test` script in `package.json`). Testing is manual.
