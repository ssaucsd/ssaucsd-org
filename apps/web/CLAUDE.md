# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Context

This app is part of the ssaucsd monorepo. Run commands from the **monorepo root** (`../../`):

- `pnpm dev` - Start all apps
- `pnpm --filter @ssaucsd/web dev` - Start only this app

## Commands

From monorepo root:

```bash
pnpm dev                           # Start dev server at localhost:4321
pnpm build                         # Build production site to ./dist/
pnpm --filter @ssaucsd/web preview # Preview production build locally
pnpm typecheck                     # Run TypeScript diagnostics
```

## Architecture

This is an Astro 5 static site for the public-facing ssaucsd.org website.

**Project Structure:**

- `src/pages/` - File-based routing (`.astro` files become routes)
- `src/layouts/` - Page wrapper components (currently `Layout.astro`)
- `src/components/` - Reusable Astro components
- `src/assets/` - Images and assets processed by Astro
- `public/` - Static files served as-is (favicon, etc.)

**Key Patterns:**

- Astro components use frontmatter (`---`) for imports and server-side logic
- Styles are scoped to components by default via `<style>` tags
- TypeScript is configured in strict mode via `astro/tsconfigs/strict`

## Shared Packages

This app uses shared packages from the monorepo:

- `@ssaucsd/ui` - Shared utilities like `cn()` for className merging
- `@ssaucsd/database` - Shared Supabase database types (if needed)
