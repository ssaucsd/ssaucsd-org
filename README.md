# SSAUCSD

Monorepo for the Symphonic Student Association at UC San Diego, containing:

- **@ssaucsd/dashboard** - Next.js dashboard for managing member data (port 3000)
- **@ssaucsd/web** - Astro static site for ssaucsd.org (port 4321)

## Monorepo Structure

```
ssaucsd/
├── apps/
│   ├── dashboard/          # Next.js dashboard (@ssaucsd/dashboard)
│   └── web/                # Astro website (@ssaucsd/web)
├── packages/
│   ├── database/           # Shared Supabase types (@ssaucsd/database)
│   ├── ui/                 # Shared utilities (@ssaucsd/ui)
│   └── typescript-config/  # Shared TypeScript configs
├── supabase/               # Supabase migrations and config
├── turbo.json
└── package.json
```

## Prerequisites

- [mise](https://mise.jdx.dev/) - Tool version manager
- [Docker](https://www.docker.com/) - Required for local Supabase

## Development Setup

### 1. Install mise

```bash
# macOS
brew install mise

# Or see https://mise.jdx.dev/getting-started.html for other methods
```

Add mise to your shell (if not already configured):

```bash
# For zsh (~/.zshrc)
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc

# For bash (~/.bashrc)
echo 'eval "$(mise activate bash)"' >> ~/.bashrc
```

### 2. Clone and install tools

```bash
git clone <repo-url>
cd ssaucsd
mise install
```

This installs Node.js 24 and enables corepack for pnpm 9.15.0.

### 3. Install dependencies

```bash
pnpm install
```

### 4. Configure environment variables

Copy the example files and fill in the values:

```bash
cp .env.example .env
cp apps/dashboard/.env.example apps/dashboard/.env
cp apps/web/.env.example apps/web/.env
```

See [Environment Variables](#environment-variables) for details.

### 5. Start local Supabase

```bash
pnpm db:start
```

This starts the local Supabase instance:

- API: http://127.0.0.1:54321
- Studio UI: http://127.0.0.1:54323

After starting, copy the displayed `anon key` to your environment files.

For local development, use these values in `apps/dashboard/.env`:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key shown after db:start>
```

### 6. Start development servers

```bash
pnpm dev
```

- Dashboard: http://localhost:3000
- Web: http://localhost:4321

## Environment Variables

### Root Level (`.env`)

| Variable                                      | Description                                  |
| --------------------------------------------- | -------------------------------------------- |
| `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET` | Google OAuth client secret for Supabase Auth |

### Dashboard (`apps/dashboard/.env`)

| Variable                                      | Description                       |
| --------------------------------------------- | --------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                    | Supabase project URL              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`               | Supabase anonymous/public key     |
| `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET` | Google OAuth client secret        |
| `NEXT_PUBLIC_POSTHOG_KEY`                     | PostHog project API key           |
| `NEXT_PUBLIC_POSTHOG_HOST`                    | PostHog host URL                  |
| `NEXT_PUBLIC_SENTRY_DSN`                      | Sentry DSN for error tracking     |
| `SENTRY_AUTH_TOKEN`                           | Sentry auth token for source maps |

### Web (`apps/web/.env`)

| Variable                   | Description                   |
| -------------------------- | ----------------------------- |
| `PUBLIC_SUPABASE_URL`      | Supabase project URL          |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |

## Development Commands

Run all commands from the monorepo root.

### Application Development

```bash
pnpm dev          # Start all apps in development mode
pnpm build        # Build all apps for production
pnpm lint         # Run linting across all packages
pnpm typecheck    # Run TypeScript type checking
```

### Database (Supabase)

```bash
pnpm db:start           # Start local Supabase instance
pnpm db:stop            # Stop local Supabase instance
pnpm db:reset           # Reset database (runs migrations + seed)
pnpm db:generate-types  # Generate TypeScript types from schema
pnpm db:diff -f <name>  # Generate migration from schema changes
pnpm db:migrate <name>  # Create a new empty migration file
pnpm db:push            # Push migrations to remote database
```

### Running Specific Apps

```bash
pnpm --filter @ssaucsd/dashboard dev  # Run only dashboard
pnpm --filter @ssaucsd/web dev        # Run only web
```

### Adding Dependencies

```bash
# Add to a specific app
pnpm add <package> --filter @ssaucsd/dashboard
pnpm add <package> --filter @ssaucsd/web

# Add to root (dev dependencies only)
pnpm add -D <package> -w
```

## Deployment

### Dashboard (Vercel)

1. Connect your repository to Vercel
2. Configure the project:
   - **Root Directory:** `apps/dashboard`
   - **Build Command:** `cd ../.. && pnpm build --filter @ssaucsd/dashboard`
   - **Output Directory:** `.next`
   - **Install Command:** `cd ../.. && pnpm install`
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET`
   - `NEXT_PUBLIC_POSTHOG_KEY`
   - `NEXT_PUBLIC_POSTHOG_HOST`
   - `NEXT_PUBLIC_SENTRY_DSN`
   - `SENTRY_AUTH_TOKEN`

### Web (Vercel)

1. Connect your repository to Vercel
2. Configure the project:
   - **Root Directory:** `apps/web`
   - **Build Command:** `cd ../.. && pnpm build --filter @ssaucsd/web`
   - **Output Directory:** `dist`
   - **Install Command:** `cd ../.. && pnpm install`
3. Add environment variables:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`

### Supabase (Production)

1. Create a project at [supabase.com](https://supabase.com)
2. Link your local project:
   ```bash
   npx supabase link --project-ref <project-id>
   ```
3. Push migrations to production:
   ```bash
   pnpm db:push
   ```
4. Configure Google OAuth in Supabase Dashboard:
   - Go to Authentication > Providers > Google
   - Add your Google OAuth credentials
   - Set the authorized redirect URL to your production domain

## Shared Packages

### @ssaucsd/database

Generated Supabase database types shared across apps:

```typescript
import { Tables, Database, Enums } from "@ssaucsd/database";
```

Regenerate types after schema changes:

```bash
pnpm db:generate-types
```

### @ssaucsd/ui

Shared utility functions:

```typescript
import { cn } from "@ssaucsd/ui";
```

### @ssaucsd/typescript-config

Shared TypeScript configurations extended by all packages.

## Turborepo

This monorepo uses Turborepo for:

- **Build caching** - Faster rebuilds by caching unchanged packages
- **Parallel execution** - Run tasks across packages simultaneously
- **Dependency ordering** - Packages build before dependent apps

## Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Dashboard**: Next.js, React 19, Tailwind CSS v4, shadcn/ui
- **Web**: Astro 5, React 19, Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with Google OAuth
- **Monitoring**: Sentry, PostHog
