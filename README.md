# SSAUCSD

Monorepo for the Symphonic Student Association at UC San Diego:

- **@ssaucsd/dashboard** - Next.js member/admin dashboard (Clerk + Convex)
- **@ssaucsd/web** - Astro public site (reads from Convex)

## Monorepo Structure

```text
ssaucsd/
├── apps/
│   ├── dashboard/
│   └── web/
├── packages/
│   ├── database/
│   ├── ui/
│   └── typescript-config/
├── convex/
├── scripts/
├── supabase/           # Legacy source schema/data for migration
├── turbo.json
└── package.json
```

## Prerequisites

- [mise](https://mise.jdx.dev/)
- [Bun](https://bun.sh/) (or `mise install` to install Bun from `mise.toml`)

## Development Setup

1. Clone and install tools

```bash
git clone <repo-url>
cd ssaucsd
mise install
```

2. Install dependencies

```bash
bun install
```

3. Configure env files

```bash
cp .env.example .env
cp apps/dashboard/.env.example apps/dashboard/.env
cp apps/web/.env.example apps/web/.env
```

4. Run apps

```bash
bun run dev
```

- Dashboard: http://localhost:3000
- Web: http://localhost:4321

## Environment Variables

### Root (`.env`)

- `SUPABASE_DB_URL` (source DB for migration script)
- `CONVEX_URL`
- `CONVEX_DEPLOY_KEY`
- `MIGRATION_SECRET`
- `CLERK_JWT_ISSUER_DOMAIN`

### Dashboard (`apps/dashboard/.env`)

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

### Web (`apps/web/.env`)

- `PUBLIC_CONVEX_URL`

## Commands

```bash
bun run dev
bun run build
bun run lint
bun run typecheck
bun run format:check
bun run check
bun run format
```

### Data Migration (Supabase -> Convex)

```bash
# Optional: set CLEAR_EXISTING=true for full replace
# Optional: set MIGRATION_SNAPSHOT_PATH=./snapshot.json to persist export
bun run data:migrate
```

This script:

1. Pulls `profiles/events/resources/tags/resource_tags/rsvps` from `SUPABASE_DB_URL`.
2. Imports them into Convex via `migrations:importSnapshot`.
3. Prints resulting Convex table counts.

## Deployment Notes

- Dashboard deploys from `apps/dashboard`.
- Web deploys from `apps/web`.
- Use Bun in CI/CD install/build commands.

## Tech Stack

- **Monorepo**: Turborepo + Bun workspaces
- **Dashboard**: Next.js, Clerk, Convex, Tailwind
- **Web**: Astro, Convex
- **Data migration source**: Supabase Postgres
- **Monitoring**: Sentry, PostHog
