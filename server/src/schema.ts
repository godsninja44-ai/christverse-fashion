import {
  pgTable,
  serial,
  text,
  integer,
  doublePrecision,
  timestamp,
} from "drizzle-orm/pg-core";

// ChristVerse Fashion — the "blockchain" is simulated: contentHash is a real
// sha256 of the content, but txId / tokenId are mock identifiers minted by
// the API server. See docs/ARCHITECTURE.md.

export const christverseMessages = pgTable("christverse_messages", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  content: text("content").notNull(),
  scriptureRef: text("scripture_ref"),
  contentHash: text("content_hash").notNull(),
  txId: text("tx_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const christverseTips = pgTable("christverse_tips", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id")
    .notNull()
    .references(() => christverseMessages.id, { onDelete: "cascade" }),
  walletAddress: text("wallet_address").notNull(),
  amount: doublePrecision("amount").notNull(),
  txId: text("tx_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const christverseWearables = pgTable("christverse_wearables", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  prompt: text("prompt"),
  price: doublePrecision("price").notNull(),
  royaltyBps: integer("royalty_bps").notNull().default(500),
  tokenId: text("token_id").notNull(),
  txId: text("tx_id").notNull(),
  contentHash: text("content_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Physical clothing collection ("Fashion Universe" shop pillar).
// Checkout is SIMULATED in this MVP — catalog display only, no real payments.
export const christverseProducts = pgTable("christverse_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  scriptureRef: text("scripture_ref"),
  price: doublePrecision("price").notNull(),
  sizes: text("sizes").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ChristverseMessageRow = typeof christverseMessages.$inferSelect;
export type ChristverseProductRow = typeof christverseProducts.$inferSelect;
export type ChristverseTipRow = typeof christverseTips.$inferSelect;
export type ChristverseWearableRow = typeof christverseWearables.$inferSelect;
