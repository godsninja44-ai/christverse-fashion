# ChristVerse Fashion — Deployment

## How it runs in this workspace

ChristVerse is one artifact inside a pnpm monorepo, served behind a shared
reverse proxy:

- **Frontend** — `artifacts/christverse` (React + Vite SPA), mounted at
  `/christverse/`. Dev workflow: `artifacts/christverse: web`
  (`pnpm --filter @workspace/christverse run dev`).
- **Backend** — the shared API server (`artifacts/api-server`), mounted at
  `/api`. All ChristVerse endpoints live under `/api/christverse/*`.
- **Database** — the workspace PostgreSQL instance (`DATABASE_URL`). Tables are
  defined in `lib/db/src/schema/christverse.ts` and applied with
  `pnpm --filter @workspace/db run push`.
- **Seed images** — static files in `artifacts/api-server/public/christverse/`,
  served at `/api/static/christverse/*`.

## Publishing

Publishing the Repl deploys the whole monorepo: the proxy, the API server, and
every web artifact together. No ChristVerse-specific steps are needed beyond:

1. Ensure the production database has the tables (schema push / migration).
2. Publish. The app is available at `https://<domain>/christverse/`.

## Environment

- `DATABASE_URL` — required (already configured in this workspace).
- No blockchain keys, wallet secrets, or AI keys are needed: the chain is
  simulated and AI image generation is a Phase 2 stub (see ROADMAP.md).

## Checks before shipping

- `pnpm run typecheck` — full monorepo typecheck
- `pnpm --filter @workspace/christverse run typecheck` — frontend only
- Smoke: `curl localhost:80/api/christverse/stats`
