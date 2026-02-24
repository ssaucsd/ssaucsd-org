# SSA UCSD Web

Public Astro website for ssaucsd.org. Event data is read from Convex.

## Setup

From monorepo root:

```bash
bun install
cp apps/web/.env.example apps/web/.env
bun run dev
```

## Env

- `PUBLIC_CONVEX_URL`

## Commands

```bash
bun run dev
bun run build
bun run preview
bun run typecheck
```

## Key Paths

- `src/lib/events.ts` - Convex-backed event data helpers
- `src/pages/` - Astro routes
- `src/components/` - UI components
