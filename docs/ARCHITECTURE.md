# ChristVerse Fashion — Architecture

ChristVerse Fashion is a standalone product living in this workspace as its own
artifact (`artifacts/christverse`), fully separate from the SANCTUS NOVA app.
It is a unified "Christ-centered Fashion Universe" with three pillars sharing
one identity:

1. **Collection (shop)** — a physical clothing catalog anchored in Scripture:
   tees, hoodies, and headwear with per-piece scripture references. Checkout is
   **simulated** in this MVP (browsable catalog, size picker, an "Order" action
   that clearly states no real payment is processed).
2. **Messages** — a decentralized-style faith messaging wall: post scripture /
   testimony messages, browse them, and tip authors.
3. **Fashion** — an AI fashion wearable (NFT-style) marketplace: mint wearable
   designs with an AI design prompt, browse and inspect them.

## Honest-simulation principle

The original product vision calls for a real blockchain. This MVP **simulates**
the chain and says so in the UI:

| Concern            | MVP implementation                          | Real-chain swap point                      |
| ------------------ | ------------------------------------------- | ------------------------------------------ |
| Content integrity  | Real `sha256` hash computed server-side     | Same hash, anchored on-chain / IPFS CID     |
| Transactions       | Mock ids (`cvtx_<hex>`) minted by the API   | Real tx submission + receipt                |
| NFT tokens         | Mock ids (`cvt_<hex>`)                      | ERC-721/1155 (or Solana) mint               |
| Wallet identity    | Client-generated mock address (`cv_<hex>`) stored in localStorage; no signatures | Real wallet extension (MetaMask, Phantom) + signature verification |
| Tips (CVT token)   | Rows in Postgres, mock token amounts        | Real token transfer                         |

Nothing pretends to be on-chain: every surface showing a tx/token id carries a
"simulated" disclaimer. Do not remove those disclaimers without shipping the
real integration.

## Deliberate adaptations from the original build prompt

- **Next.js → React + Vite** (workspace convention; all web artifacts here are
  Vite SPAs behind a shared reverse proxy). Routing via wouter with base path
  `/christverse/`.
- **JSON-file/in-memory storage → PostgreSQL** (workspace convention; honest
  multi-user persistence). Tables: `christverse_messages`, `christverse_tips`,
  `christverse_wearables`, `christverse_products`
  (`lib/db/src/schema/christverse.ts`).
- **Real commerce → simulated checkout.** The physical shop is a seeded,
  ChristVerse-branded catalog. No payment provider is wired up yet; the order
  button is explicitly labeled as simulated. Real checkout (e.g. Stripe or a
  print-on-demand pipeline) is a ROADMAP item.
- **Standalone Express server → shared API server.** Routes are namespaced
  under `/api/christverse/*` in `artifacts/api-server/src/routes/christverse.ts`.
  The contract is OpenAPI-first (`lib/api-spec/openapi.yaml`, `christverse` tag)
  with generated React Query hooks + Zod validation on both ends.
- **AI outfit generation → stored design prompt.** Minting stores the AI design
  prompt and displays it; actual image generation from the prompt is a Phase 2
  stub (see ROADMAP). Wearables may carry an optional `imageUrl`.

## Frontend

- `artifacts/christverse/src/` — React + Vite + Tailwind + wouter.
- Pages: `/` (landing + live stats), `/shop`, `/shop/:id`, `/messages`,
  `/messages/:id`, `/fashion`, `/fashion/:id`, `/fashion/mint`.
- Shared components: Header (nav + WalletConnect), Footer (disclaimer).
- Mock wallet: generated `cv_<hex>` address kept in localStorage; connect /
  disconnect only — no keys, no signatures, clearly labeled a demo wallet.
- Data access exclusively through `@workspace/api-client-react` generated hooks.

## Backend

- `artifacts/api-server/src/routes/christverse.ts` — all endpoints:
  - `GET/POST /api/christverse/messages`, `GET /api/christverse/messages/:id`,
    `POST /api/christverse/messages/:id/tip`
  - `GET/POST /api/christverse/wearables`, `GET /api/christverse/wearables/:id`
  - `GET /api/christverse/products` (optional `?category=`),
    `GET /api/christverse/products/:id` (read-only; catalog is seeded)
  - `GET /api/christverse/stats`
- Rules enforced server-side: non-empty content, tip amount 0–1000 CVT,
  no self-tipping, royalty 0–2000 bps (default 500 = 5%).
- No auth: wallet addresses are trusted client-supplied mock identities in this
  MVP (documented limitation — see ROADMAP Phase 2 for real wallet auth).
