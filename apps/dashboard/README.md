# SSA UCSD Dashboard V2

A member and admin dashboard for SSA at UCSD built with Next.js 16, Supabase, and Tailwind CSS v4. Members can view events, browse resources, RSVP to events, and manage their profiles. Admins can manage events, resources, tags, and user roles.

## Tech Stack

- **Frontend**: Next.js 16 (React 19), Tailwind CSS v4, shadcn/ui
- **Backend**: Supabase (Auth, Postgres, RLS)
- **File Uploads**: UploadThing
- **Analytics**: PostHog, Sentry

## Setup

1. **Install dependencies**

   ```bash
   bun install
   ```

2. **Configure environment**
   Copy `.env.example` to `.env` and fill in the required values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - Google OAuth credentials for Supabase Auth

3. **Start local Supabase**

   ```bash
   bun run db:start
   ```

   Studio UI available at http://127.0.0.1:54323

4. **Run dev server**
   ```bash
   bun dev
   ```

## Development Workflow

| Command                     | Description                             |
| --------------------------- | --------------------------------------- |
| `bun dev`                   | Start development server                |
| `bun run lint`              | Run ESLint                              |
| `bun run format:fix`        | Format code with Prettier               |
| `bun run typecheck`         | Run TypeScript type checking            |
| `bun run db:reset`          | Reset database (runs migrations + seed) |
| `bun run db:migrate <name>` | Create new migration file               |
| `bun run db:diff -f <name>` | Generate migration from schema changes  |
| `bun run db:push`           | Push migrations to remote database      |

## Key Files & Directories

```
src/
├── app/
│   ├── (auth)/           # Auth pages (login)
│   ├── (dashboard)/      # Main dashboard pages
│   │   ├── admin/        # Admin-only pages
│   │   ├── events/       # Events listing
│   │   ├── resources/    # Resources listing
│   │   └── settings/     # User settings
│   ├── onboarding/       # New user onboarding flow
│   └── api/              # API routes (uploadthing)
├── components/           # React components (shadcn/ui + custom)
├── lib/
│   ├── queries.ts        # Server actions for data fetching
│   └── supabase/         # Supabase client setup (client.ts, server.ts)
└── utils/                # Utility functions

supabase/
├── migrations/           # Database migrations (timestamped SQL)
└── seed.sql              # Seed data for local development
```

## Database Schema

- **profiles** – User data (synced from Supabase Auth, includes role, instrument, major)
- **events** – Organization events with RSVPs
- **resources** – Member links and tools
- **tags** / **resource_tags** – Resource categorization (many-to-many)
- **rsvps** – Event RSVPs linked to profiles
