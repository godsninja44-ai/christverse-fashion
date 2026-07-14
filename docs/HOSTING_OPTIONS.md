# Hosting Options — ChristVerse Fashion

The exported `christverse-fashion` repo is a classic two-piece app:

- **client/** — static React + Vite SPA (can be hosted anywhere static files can)
- **server/** — Node Express API + PostgreSQL (needs a Node host + a Postgres)

Any combination below works. The client only needs `VITE_API_URL` set to the
server's public URL at build time (defaults to same-origin `/api`).

## Option 1 — Replit (current home, easiest full-stack)

The app already runs and deploys on Replit (`/christverse/` path). One click
publish, managed Postgres, HTTPS, no config. This is the reference deployment.

## Option 2 — Vercel (client) + any Node host (server)

`vercel.json` in the repo root builds `client/` as a static site.

- Client: import the GitHub repo in Vercel, framework = Vite, root = `client/`.
- Server: host on Render/Railway/Fly (see below), then set the Vercel env
  `VITE_API_URL=https://<your-api-host>` and redeploy.
- SPA fallback rewrites are included so deep links like `/shop/2` work.

## Option 3 — Netlify (client) + any Node host (server)

`netlify.toml` mirrors the Vercel setup: base `client/`, publish `dist/`,
SPA redirect included. Set `VITE_API_URL` in Netlify build env.

## Option 4 — Render / Railway / Fly.io (full stack)

Host both pieces in one place:

- **Web service**: `server/` — `npm install && npm run build && npm start`,
  env `DATABASE_URL` (managed Postgres add-on) and `PORT` (provided by host).
- **Static site**: `client/` — `npm install && npm run build`, publish `dist/`.
- Run `npm run db:push && npm run seed` once against the production database.

## Environment variables

| Variable       | Where  | Purpose                                        |
| -------------- | ------ | ---------------------------------------------- |
| `DATABASE_URL` | server | Postgres connection string (required)          |
| `PORT`         | server | Listen port (default 3001)                     |
| `VITE_API_URL` | client | API origin at build time (default same-origin) |

## Notes

- The blockchain layer is **simulated** (documented in ARCHITECTURE.md) — no
  chain infrastructure is needed to host this.
- Shop checkout is **simulated** — no payment provider keys are needed.
- Product/wearable images ship in `server/public/` and are served at
  `/api/static/*` by the Express server.
