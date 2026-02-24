# CLAUDE.md

Guidance for working in `apps/web`.

## Monorepo Context

Run from monorepo root:

- `bun run dev` - Start all apps
- `bun --filter @ssaucsd/web run dev` - Web only

## Commands

- `bun run build`
- `bun run preview`
- `bun run typecheck`

## Architecture

- Astro public site for ssaucsd.org.
- Event data is fetched from Convex via `src/lib/events.ts` and `src/lib/convex.ts`.
- Uses shared packages:
  - `@ssaucsd/ui`
  - `@ssaucsd/database`

## Environment

- `PUBLIC_CONVEX_URL`
