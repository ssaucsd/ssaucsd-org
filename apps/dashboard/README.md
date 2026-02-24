# SSA UCSD Dashboard

Next.js dashboard for SSA members/admins using Clerk authentication and Convex backend.

## Stack

- Next.js 16 (React 19)
- Clerk (Google sign-in)
- Convex (queries, mutations, auth integration)
- Tailwind CSS + shadcn/ui
- UploadThing
- PostHog + Sentry

## Setup

From monorepo root:

```bash
bun install
cp apps/dashboard/.env.example apps/dashboard/.env
bun run dev
```

## Required Env

- `NEXT_PUBLIC_CONVEX_URL`
- `CONVEX_URL`
- `CONVEX_DEPLOY_KEY`
- `CLERK_JWT_ISSUER_DOMAIN`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`
- `UPLOADTHING_TOKEN`

## Key Paths

- `src/lib/queries.ts` - Dashboard data access layer
- `src/lib/convex/server.ts` - Server-side Convex client wrappers
- `src/app/(dashboard)/` - Protected dashboard routes
- `src/app/onboarding/` - First-login onboarding
- `src/app/api/uploadthing/` - File upload routes
- `../../convex/` - Convex schema/functions
