# Yacob Tech Academy — production-readiness audit

Audit date: 2026-10-25
Scope: repository `yaikobdiriba22-web/metech`, Vercel project `yacobtechacademy`, and the supplied Google AI Studio URL.

## Verified in source

- React + TypeScript + Vite frontend.
- Existing UI components for course browsing, AI learning assistance, student/admin dashboards, authentication, quizzes, certificates, pricing, and payment receipt flows.
- Supabase JS client is used in the frontend.
- `server.ts` uses Express, a JSON file store under `data/db.json`, and an optional MongoDB connection/fallback. This is not yet a clean Vercel Functions + Supabase/Postgres architecture.
- The Supabase client previously contained a hard-coded project URL and a placeholder-looking key. This creates a risk of silently targeting the wrong backend and makes configuration status unclear.
- App code builds user state from local storage and derives role/plan/progress fields in client code. These values must not be treated as authoritative for access control, paid access, or progress.
- Demo course/review/project data includes fixed counts and testimonial-style content. Before launch, clearly label demos or replace them with verified records.
- The current Vercel project has a latest production deployment recorded as ERROR; an earlier deployment is recorded as READY. Live access was not independently verified in this audit.
- The provided `https://yacob-tech-academy.ai.studio/` URL could not be fetched by public web retrieval, so the exact AI Studio editor state cannot be confirmed from that URL alone.

## Safety changes on this branch

- Removed the hard-coded Supabase project URL/key fallback from `src/lib/supabase.ts`.
- Added an explicit `isSupabaseConfigured` flag.
- Kept legacy `VITE_SUPABASE_ANON_KEY` support while preferring `VITE_SUPABASE_PUBLISHABLE_KEY`.
- When configuration is missing, the app no longer silently targets the old project; backend requests will not work until the correct environment variables are configured.

## Recommended production architecture

1. Use the existing `metech` source as the starting point; preserve main and continue on a separate branch.
2. Use Vercel for the Vite frontend and Vercel Functions for server-side APIs.
3. Use one confirmed Supabase project for Postgres, Auth, and Storage as needed.
4. Migrate persistent writes away from local JSON files and the MongoDB fallback into Supabase/Postgres.
5. Enforce authorization on the server and with Supabase RLS. Never authorize an admin from client-editable user metadata or localStorage.
6. Implement course/enrollment/progress/quiz/certificate records with RLS policies and server-verified rules.
7. Keep AI and payment-provider secrets server-side. Verify Telebirr/provider callbacks before granting paid access.
8. Implement English, Afaan Oromoo, and Amharic using a shared translation dictionary and test navigation, course pages, forms, and dashboards in all three languages.
9. Label unverified courses, testimonials, learner counts, prices, and certificates honestly.
10. Run install/build/type-check and auth/RLS/API smoke tests before promoting any deployment.

## Required deployment configuration

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` (or the legacy `VITE_SUPABASE_ANON_KEY` during migration)
- Server-only Supabase configuration for privileged operations, if any; never expose service-role secrets in browser variables.
- A server-side AI provider key only if the AI tutor API is enabled.
- Payment-provider credentials only after a provider integration and callback verification are implemented.

## Not verified

- Successful production build of the current commit.
- Correct Supabase project/URL and schema availability.
- Production sign-up/sign-in, data persistence, RLS, admin authorization, AI API, email delivery, Telebirr payment verification, or certificate issuance.
- A successful latest Vercel production deployment.
