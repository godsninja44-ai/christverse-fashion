# GitHub Setup — `christverse-fashion`

ChristVerse Fashion is mirrored to a **public GitHub repository** as a curated,
standalone export — NOT the whole Replit workspace monorepo.

## What gets pushed

The export lives at `export/christverse-fashion/` in the workspace and contains:

```
christverse-fashion/
├── client/            # React + Vite frontend (imports rewritten to local ./src/api)
├── server/            # Standalone Express API + Drizzle/Postgres + seed script
│   └── public/        # Static product/wearable images served at /api/static
├── docs/              # ARCHITECTURE, DEPLOYMENT, ROADMAP, GITHUB_SETUP, HOSTING_OPTIONS
├── vercel.json        # Vercel config (client static build + serverless-friendly notes)
├── netlify.toml       # Netlify config (client static build + redirects)
└── README.md
```

Key differences from the in-workspace artifact:

| In workspace                              | In the exported repo                       |
| ----------------------------------------- | ------------------------------------------ |
| `@workspace/api-client-react` hooks       | Same generated hooks, vendored at `client/src/api/generated` |
| Shared api-server (`/api/christverse/*`)  | Standalone Express server (`server/`)      |
| `@workspace/db` shared schema             | Local Drizzle schema (`server/src/schema.ts`) |
| Base path `/christverse/`                 | Root base path `/`                         |

## How the push works

The export is pushed with the GitHub **Git Data API** (blobs → tree → commit →
update ref) using the Replit GitHub connection — no local `git` involved. Never
push the monorepo itself; only the contents of `export/christverse-fashion/`.

## Refreshing the repo after changes

1. Make changes in the workspace (`artifacts/christverse`, api-server routes,
   `lib/api-spec/openapi.yaml`).
2. Re-copy the client sources into `export/christverse-fashion/client/` and
   re-run the filtered codegen (`export/_codegen/orval.config.ts`, tag
   `christverse`) so the vendored hooks/Zod schemas match the API.
3. Mirror any route logic changes into `server/src/routes.ts`.
4. Verify locally: `npm install && npm run build` in `client/` and `server/`.
5. Push a new commit via the Git Data API.

## Running the exported repo locally

```bash
# server (needs DATABASE_URL pointing at any Postgres)
cd server && npm install && npm run db:push && npm run seed && npm run dev
# client (proxies /api to the server in dev)
cd client && npm install && npm run dev
```
