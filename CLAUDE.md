# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SSAUCSD is a Turborepo monorepo containing:

- **@ssaucsd/dashboard** - Next.js dashboard application for managing SSA UCSD member data
- **@ssaucsd/web** - Astro static site for the public-facing ssaucsd.org website

## Monorepo Structure

```
ssaucsd/
├── apps/
│   ├── dashboard/          # Next.js dashboard (@ssaucsd/dashboard)
│   └── web/                # Astro website (@ssaucsd/web)
├── packages/
│   ├── database/           # Shared Supabase types (@ssaucsd/database)
│   ├── ui/                 # Shared utilities like cn() (@ssaucsd/ui)
│   └── typescript-config/  # Shared TypeScript configs
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

## Development Commands

Run all commands from the monorepo root:

### Application Development

- `pnpm dev` - Start all apps in development mode (dashboard: 3000, web: 4321)
- `pnpm build` - Build all apps for production
- `pnpm lint` - Run linting across all packages
- `pnpm typecheck` - Run TypeScript type checking across all packages

### Database (Supabase)

- `pnpm db:start` - Start local Supabase instance
- `pnpm db:stop` - Stop local Supabase instance
- `pnpm db:reset` - Reset database to initial state
- `pnpm db:generate-types` - Generate TypeScript types from database schema

### Running Commands for Specific Apps

- `pnpm --filter @ssaucsd/dashboard dev` - Run only dashboard
- `pnpm --filter @ssaucsd/web dev` - Run only web

## Shared Packages

### @ssaucsd/database

Contains generated Supabase database types. Both apps import types from here:

```typescript
import { Tables, Database, Enums } from "@ssaucsd/database";
```

Types are regenerated with `pnpm db:generate-types` which outputs to `packages/database/src/types.ts`.

### @ssaucsd/ui

Contains shared utility functions:

```typescript
import { cn } from "@ssaucsd/ui";
```

### @ssaucsd/typescript-config

Shared TypeScript configurations:

- `base.json` - Base config for all packages
- `nextjs.json` - Next.js specific config
- `astro.json` - Astro specific config

## Package Manager

This monorepo uses **pnpm** with workspaces. Always use pnpm commands from the root:

- `pnpm install` - Install all dependencies
- `pnpm add <package> --filter @ssaucsd/dashboard` - Add dependency to specific app

## Turborepo

Turbo handles task orchestration with:

- Build caching for faster rebuilds
- Parallel task execution
- Dependency-aware task ordering (packages build before apps)

## Environment Variables

Each app has its own `.env` file. See the respective app's CLAUDE.md for details:

- `apps/dashboard/CLAUDE.md`
- `apps/web/CLAUDE.md`
