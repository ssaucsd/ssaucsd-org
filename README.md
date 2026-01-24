# SSAUCSD

Monorepo for SSA UCSD web applications, built with Turborepo.

## Applications

| App | Description | Port | Tech Stack |
|-----|-------------|------|------------|
| `@ssaucsd/dashboard` | Member management dashboard | 3000 | Next.js 16, React 19, Supabase |
| `@ssaucsd/web` | Public website (ssaucsd.org) | 4321 | Astro 5, React 19 |

## Prerequisites

- **Node.js** 20+
- **pnpm** 9.15.0+ (`corepack enable && corepack prepare pnpm@9.15.0 --activate`)
- **Docker** (for local Supabase)

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Copy the example environment files and configure them:

```bash
# Dashboard app
cp apps/dashboard/.env.example apps/dashboard/.env
```

Required variables for the dashboard:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (local: `http://127.0.0.1:54321`) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anonymous key |
| `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

### 3. Start Local Supabase

```bash
pnpm db:start
```

This starts a local Supabase instance with:
- API: `http://127.0.0.1:54321`
- Studio UI: `http://127.0.0.1:54323`

### 4. Start Development Servers

```bash
pnpm dev
```

This starts both apps in parallel:
- Dashboard: http://localhost:3000
- Web: http://localhost:4321

## Development Workflow

### Running Commands

All commands should be run from the monorepo root:

```bash
# Start all apps
pnpm dev

# Start a specific app
pnpm --filter @ssaucsd/dashboard dev
pnpm --filter @ssaucsd/web dev

# Build all apps
pnpm build

# Run linting
pnpm lint

# Run type checking
pnpm typecheck
```

### Database Commands

```bash
# Start/stop local Supabase
pnpm db:start
pnpm db:stop

# Reset database (runs migrations + seed)
pnpm db:reset

# Generate TypeScript types from schema
pnpm db:generate-types
```

### Database Migrations

From within `apps/dashboard/`:

```bash
# Create a new migration
pnpm db:migrate <migration_name>

# Generate migration from schema changes
pnpm db:diff -f <migration_name>

# Push migrations to remote database
pnpm db:push
```

### Adding Dependencies

```bash
# Add to a specific app
pnpm add <package> --filter @ssaucsd/dashboard
pnpm add <package> --filter @ssaucsd/web

# Add to root (dev dependencies only)
pnpm add -D <package> -w
```

## Project Structure

```
ssaucsd/
├── apps/
│   ├── dashboard/          # Next.js dashboard app
│   │   ├── src/
│   │   │   ├── app/        # Next.js App Router
│   │   │   ├── components/ # React components
│   │   │   └── lib/        # Utilities and queries
│   │   └── supabase/       # Migrations and config
│   └── web/                # Astro static site
│       ├── src/
│       │   ├── pages/      # File-based routing
│       │   ├── layouts/    # Page layouts
│       │   └── components/ # Astro components
│       └── public/         # Static assets
├── packages/
│   ├── database/           # Shared Supabase types
│   ├── ui/                 # Shared utilities (cn())
│   └── typescript-config/  # Shared TS configs
├── turbo.json              # Turborepo configuration
├── pnpm-workspace.yaml     # pnpm workspace config
└── package.json
```

## Shared Packages

### @ssaucsd/database

Contains auto-generated Supabase database types:

```typescript
import { Tables, Database, Enums } from "@ssaucsd/database";
```

Regenerate types after schema changes:

```bash
pnpm db:generate-types
```

### @ssaucsd/ui

Shared utilities:

```typescript
import { cn } from "@ssaucsd/ui";
```

## Deployment

### Dashboard (Next.js)

Deploy to Vercel:

1. Connect your repository to Vercel
2. Set the root directory to `apps/dashboard`
3. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Production Supabase URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Production anon key
   - `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET` - Google OAuth secret
4. Set build command: `cd ../.. && pnpm build --filter @ssaucsd/dashboard`
5. Set output directory: `.next`

### Web (Astro)

Deploy to Vercel or any static host:

1. Connect your repository to Vercel
2. Set the root directory to `apps/web`
3. Configure build command: `cd ../.. && pnpm build --filter @ssaucsd/web`
4. Set output directory: `dist`

### Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Link your local project:
   ```bash
   cd apps/dashboard
   pnpx supabase link --project-ref <project-id>
   ```
3. Push migrations to production:
   ```bash
   pnpm db:push
   ```
4. Configure Google OAuth in Supabase Dashboard under Authentication > Providers

## Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Dashboard**: Next.js 16, React 19, Tailwind CSS v4, shadcn/ui
- **Web**: Astro 5, React 19, Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with Google OAuth
- **Monitoring**: Sentry, PostHog
