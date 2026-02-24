# CLAUDE.md

This file provides guidance for working in `apps/dashboard`.

## Project Overview

SSA UCSD member/admin dashboard built with Next.js, Clerk auth, and Convex.

## Monorepo Context

Run commands from monorepo root:

- `bun run dev` - Start all apps
- `bun --filter @ssaucsd/dashboard run dev` - Dashboard only

## Commands

From monorepo root:

- `bun run build`
- `bun run lint`
- `bun run typecheck`
- `bun run format:check`

## Architecture

### Auth and Access Control

- Clerk handles authentication.
- Convex validates Clerk JWTs via `convex/auth.config.ts`.
- `(dashboard)` layout enforces authentication and onboarding.
- Admin access is role-based (`users.role === "admin"`) and enforced in Convex mutations/queries.

### Data Layer

- All data is served from Convex functions in `/convex`.
- App-facing server wrappers are in `src/lib/convex/server.ts`.
- UI-facing query helpers are in `src/lib/queries.ts`.

### Tables (Convex)

- `users`
- `events`
- `resources`
- `tags`
- `resource_tags`
- `rsvps`

### Migration Utilities

- Supabase -> Convex data import is handled by `scripts/migrate-supabase-to-convex.ts`.
- Convex import mutation is `migrations:importSnapshot`.

## Environment Variables

Required for this app:

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

## Notes

- Keep this file updated when architectural changes are made.
