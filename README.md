# ChristVerse Fashion

A Christ-centered fashion universe: a physical clothing collection, AI-designed digital wearables, and permanent faith messages — in one app.

Three pillars:

1. **Collection (physical clothing)** — a browsable faith-inspired apparel catalog. Checkout is **simulated** in this MVP (no real payments); real commerce is a documented roadmap item.
2. **Digital wearables** — mint AI-styled fashion pieces as collectible wearables.
3. **Faith messages** — post scripture-anchored messages and tip others with CVT.

> **Honest simulation notice:** the blockchain layer is SIMULATED. `contentHash` is a real sha256 of the content, but `txId` (`cvtx_...`) / `tokenId` (`cvt_...`) are mock identifiers minted by the API server, wallets are mock local identities, and CVT is a mock token. Swap points for a real chain are documented in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Stack

- **client/** — React 19 + Vite 7, Tailwind CSS 4, TanStack Query, wouter. API hooks generated from the OpenAPI contract (checked in under `client/src/api/generated`).
- **server/** — Express 5 + Drizzle ORM + PostgreSQL, Zod validation (generated schemas under `server/src/validation/generated`). Runs with `tsx` (no build step needed).

## Quick start (local)

Requirements: Node 20+ and a PostgreSQL database.

```bash
# 1. Server
cd server
npm install
export DATABASE_URL=postgres://user:pass@localhost:5432/christverse
npm run db:push   # create tables
npm run seed      # demo data (idempotent)
npm run dev       # http://localhost:3001

# 2. Client (second terminal)
cd client
npm install
npm run dev       # http://localhost:5173 — /api is proxied to :3001
```

## Environment variables

| Variable | Where | Required | Purpose |
| --- | --- | --- | --- |
| `DATABASE_URL` | server | yes | PostgreSQL connection string |
| `PORT` | server | no | API port (default 3001) |
| `VITE_API_URL` | client build | no | API origin when client and server are hosted separately (default: same origin) |

## Deploying

The client is a static Vite build; the server is a small Express + Postgres app. Host them together or separately:

- `vercel.json` — deploy the client to Vercel (set `VITE_API_URL` to your API origin).
- `netlify.toml` — deploy the client to Netlify (same note).
- Server: any Node host (Render, Railway, Fly.io, a VPS). `npm install && npm start` with `DATABASE_URL` set. CORS is open by default.

See [`docs/HOSTING_OPTIONS.md`](docs/HOSTING_OPTIONS.md) for a full walkthrough and [`docs/GITHUB_SETUP.md`](docs/GITHUB_SETUP.md) for repo notes.

## Docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — the three pillars, data model, simulated-blockchain design, and swap points for a real chain.
- [`docs/HOSTING_OPTIONS.md`](docs/HOSTING_OPTIONS.md) — hosting matrix (Vercel, Netlify, Render, Railway, Fly.io, VPS).
- [`docs/GITHUB_SETUP.md`](docs/GITHUB_SETUP.md) — how this repo is laid out and kept in sync.

## License

MIT
