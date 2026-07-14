# ChristVerse Fashion — Roadmap

## Phase 1 — MVP (this build)

- [x] Landing page with live community stats
- [x] Faith messages: post (with optional scripture reference), browse, detail
- [x] Tipping in mock CVT tokens (no self-tips, capped at 1000/tip)
- [x] Wearable marketplace: mint (name, description, category, AI design
      prompt, price, royalty), browse with category filter, detail
- [x] Simulated chain: real sha256 content hashes, mock tx/token ids,
      visible disclaimers everywhere
- [x] Mock wallet connect (localStorage identity)
- [x] PostgreSQL persistence, OpenAPI-first API contract

## Phase 2 — Real identity & AI

- [ ] Real wallet connect (MetaMask / WalletConnect or Phantom) with signature
      verification on every write (replace trusted `walletAddress` body field)
- [ ] AI image generation from the stored design prompt (the prompt field and
      display surfaces already exist; wire a provider and persist the output)
- [ ] Creator profiles (message + wearable history per wallet)
- [ ] Moderation/reporting tools for community content

## Phase 3 — Real chain

- [ ] Deploy message-anchoring contract (store sha256 hashes on-chain or pin
      content to IPFS and store the CID)
- [ ] ERC-721/1155 (or Solana equivalent) wearable mint with real royalties
- [ ] Real token or stablecoin tipping with fee handling
- [ ] Compliance review before anything is presented as having monetary value

## Phase 4 — Marketplace depth

- [ ] Secondary sales / transfers with enforced creator royalties
- [ ] Wearable interoperability exports (glTF for metaverse platforms)
- [ ] Curated drops and featured creators
