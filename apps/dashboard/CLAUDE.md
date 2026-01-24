# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SSAUCSD Dashboard V2 - A Next.js dashboard application for managing SSA UCSD member data with Supabase authentication and database integration.

## Monorepo Context

This app is part of the ssaucsd monorepo. Run commands from the **monorepo root** (`../../`):
- `pnpm dev` - Start all apps
- `pnpm --filter @ssaucsd/dashboard dev` - Start only this app

## Development Commands

### Running the Application (from monorepo root)

- `pnpm dev` - Start Next.js development server (port 3000)
- `pnpm build` - Build production bundle
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking

### Database (Supabase Local Development)

- `pnpm db:start` - Start local Supabase instance (runs on port 54321)
- `pnpm db:stop` - Stop local Supabase instance
- `pnpm db:reset` - Reset database to initial state (runs migrations and seeds)
- `pnpm db:generate-types` - Regenerate TypeScript types from database schema

From within this directory:
- `pnpm db:migrate` - Create a new migration file
- `pnpm db:diff -f <migration_name>` - Generate migration from schema changes
- `pnpm db:push` - Push local migrations to remote database

## Architecture

### Authentication & Route Protection

The app uses Supabase Auth with Google OAuth integration. Authentication follows this pattern:

1. **Supabase Client Creation**:
   - `src/lib/supabase/client.ts` - Browser client (client components)
   - `src/lib/supabase/server.ts` - Server client (server components/actions)
   - Both use `@supabase/ssr` for proper Next.js integration

2. **OAuth Flow**:
   - Entry point: `/auth` page triggers `supabase.auth.signInWithOAuth()` with Google provider
   - Callback handler: `src/app/auth/callback/route.ts` exchanges OAuth code for session
   - Handles both local (`localhost:3000`) and production redirects
   - Auto-creates profile via database trigger on first signup

3. **Protected Routes**:
   - Use `<ProtectedPage>` component (src/components/ProtectedPage.tsx) to wrap protected content
   - Server-side auth check redirects to `/auth` if no session exists
   - Pattern: Wrap children in dashboard pages with this component

4. **Admin Authorization**:
   - PostgreSQL function `is_admin()` checks if `profiles.role = 'admin'`
   - RLS policies reference this function for admin-only operations
   - Only admins can update user roles via RLS policy

### Database Schema

Five core tables with relationships:

- **profiles** - User data synced from Supabase Auth (`auth.users`)
  - Auto-created on signup via `handle_new_user()` trigger
  - Fields: `first_name`, `last_name`, `email`, `instrument`, `role` (enum: 'admin' | 'user')
  - RLS enabled with user/admin policies

- **events** - Organization events with location, timing, and images
  - Fields: `title`, `description`, `location`, `start_time`, `end_time`, `image_url`
  - Ordered by `start_time` in queries

- **resources** - Links and tools for members
  - Fields: `name`, `link`, `description`, `is_pinned`
  - Pinned resources appear first in listings

- **tags** - Resource categorization
  - Fields: `name`, `slug`, `display_order`
  - Unique constraint on `name` and `slug`

- **resource_tags** - Many-to-many junction table
  - Links resources to tags
  - Primary key: (`resource_id`, `tag_id`)

### Data Fetching Pattern

All queries in `src/lib/queries.ts` are Server Actions (marked `'use server'`):

- `getFirstName()` - Get authenticated user's first name
- `getEvents()` / `getUpcomingEvents()` - Event listings
- `getResources()` / `getPinnedResources()` - Resource listings
- `getTags()` - Tag listings
- `getResourcesWithTags()` - Resources with nested tags via join query

All queries respect Row-Level Security policies. Queries are called directly from Server Components (no API routes needed).

### Route Groups & Layouts

The app uses Next.js route groups for different layout contexts:

- `src/app/(auth)/` - Authentication pages (centered layout, no sidebar)
  - `/auth` - Google OAuth login page

- `src/app/(dashboard)/` - Main dashboard pages (sidebar layout)
  - Uses `<SidebarProvider>` and `<AppSidebar>` components
  - Fixed header with `<DynamicBreadcrumb>` for navigation context
  - All dashboard pages share this layout with navigation sidebar

### Server Components by Default

- Pages are async server components that fetch data directly
- Use Client Components (`"use client"`) only for interactivity:
  - Auth page (OAuth flow)
  - Resources filtering (tag selection)
  - Theme toggling
  - Breadcrumb navigation (pathname tracking)

### UI Components

- Built with shadcn/ui components in `src/components/ui/` (based on Base UI primitives)
- Uses Tailwind CSS v4 with custom theme system
- Theme provider supports dark mode via `next-themes`
- Styling uses OKLCH color space for perceptually uniform colors
- Shared utility function `cn()` from `@ssaucsd/ui` (re-exported in `src/lib/utils.ts`)
- Icons from Hugeicons (`@hugeicons/react`)

### Fonts

Three custom fonts configured in root layout:

- Figtree (sans-serif, primary font)
- Geist Mono (monospace)
- Calistoga (serif, display font)

Access via CSS variables: `--font-sans`, `--font-geist-mono`, `--font-calistoga`

### Environment Variables

Required environment variables (see `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (local: http://127.0.0.1:54321)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Supabase anonymous key
- `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET` - Google OAuth secret (for auth)

Local development uses Supabase local instance on port 54321. The Studio UI is available at http://127.0.0.1:54323.

### Path Aliases

TypeScript configured with `@/*` alias mapping to `src/*` - use this for all imports.

### Database Types

Database types are shared via the `@ssaucsd/database` package:
```typescript
import { Tables, Database, Enums } from "@ssaucsd/database";
```

Types are regenerated with `pnpm db:generate-types` from the monorepo root, which outputs to `packages/database/src/types.ts`.

### Database Migrations

Migrations are timestamped SQL files in `supabase/migrations/`:

- Use `pnpm db:migrate` to create a new migration
- Use `pnpm db:diff -f <migration_name>` to auto-generate from schema changes
- Migrations run automatically on `db:reset`
- Seeding data in `supabase/seed.sql` runs after migrations

Key migration patterns:

- RLS policies defined in dedicated migration files
- Triggers for auto-profile creation on signup (`handle_new_user()`)
- Admin role enforcement via PostgreSQL functions

## Important Notes

- **Keep CLAUDE.md up to date**: When making significant architectural changes or adding new patterns, update this file to reflect the current state of the codebase.
