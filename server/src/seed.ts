/**
 * Idempotent seed for the ChristVerse Fashion demo data.
 * Run once after `npm run db:push`: `npm run seed`.
 * Skips any table that already has rows.
 */
import { createHash, randomBytes } from "node:crypto";
import { sql } from "drizzle-orm";
import { db, pool } from "./db";
import {
  christverseMessages,
  christverseProducts,
  christverseWearables,
} from "./schema";

const sha256 = (input: string) =>
  createHash("sha256").update(input, "utf8").digest("hex");
const mockTxId = () => `cvtx_${randomBytes(12).toString("hex")}`;
const mockTokenId = () => `cvt_${randomBytes(8).toString("hex")}`;
const mockWallet = () => `cv_${randomBytes(8).toString("hex")}`;

async function count(table: string): Promise<number> {
  const result = await db.execute(
    sql.raw(`select count(*)::int as n from ${table}`),
  );
  return Number((result.rows[0] as { n?: number } | undefined)?.n ?? 0);
}

async function seedMessages() {
  if ((await count("christverse_messages")) > 0) {
    console.log("messages: already seeded, skipping");
    return;
  }
  const rows = [
    {
      content:
        "Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.",
      scriptureRef: "Joshua 1:9",
    },
    {
      content:
        "I was lost for years — this community and the Word brought me home. Grateful beyond words.",
      scriptureRef: "Luke 15:24",
    },
    {
      content:
        "Prayed for my brother's healing for months. Last week the doctors called it a miracle. God is faithful.",
      scriptureRef: "James 5:15",
    },
  ];
  for (const r of rows) {
    await db.insert(christverseMessages).values({
      walletAddress: mockWallet(),
      content: r.content,
      scriptureRef: r.scriptureRef,
      contentHash: sha256(r.content),
      txId: mockTxId(),
    });
  }
  console.log(`messages: seeded ${rows.length}`);
}

async function seedWearables() {
  if ((await count("christverse_wearables")) > 0) {
    console.log("wearables: already seeded, skipping");
    return;
  }
  const rows = [
    {
      name: "Robe of Light",
      description:
        "A flowing ceremonial robe woven from threads of dawn — a digital garment for the redeemed.",
      category: "Robes",
      imageUrl: "/api/static/christverse/robe-of-light.png",
      prompt:
        "ethereal white and gold ceremonial robe, radiant light, editorial fashion photo",
      price: 120,
      royaltyBps: 500,
    },
    {
      name: "Faith Over Fear Hoodie",
      description:
        "Streetwear statement piece: FAITH OVER FEAR embroidered across a midnight hoodie.",
      category: "Streetwear",
      imageUrl: "/api/static/christverse/faith-over-fear-hoodie.png",
      prompt:
        "black streetwear hoodie with embroidered FAITH OVER FEAR typography, studio shot",
      price: 45,
      royaltyBps: 500,
    },
    {
      name: "Ichthys Bracelet",
      description:
        "A minimal digital bracelet carrying the ancient fish symbol of the early church.",
      category: "Accessories",
      imageUrl: "/api/static/christverse/ichthys-bracelet.png",
      prompt: "minimal silver bracelet with ichthys fish charm, macro product photo",
      price: 18,
      royaltyBps: 500,
    },
  ];
  for (const r of rows) {
    const walletAddress = mockWallet();
    const metadata = JSON.stringify({
      name: r.name,
      description: r.description,
      category: r.category,
      imageUrl: r.imageUrl,
      prompt: r.prompt,
      creator: walletAddress,
    });
    await db.insert(christverseWearables).values({
      walletAddress,
      ...r,
      tokenId: mockTokenId(),
      txId: mockTxId(),
      contentHash: sha256(metadata),
    });
  }
  console.log(`wearables: seeded ${rows.length}`);
}

async function seedProducts() {
  if ((await count("christverse_products")) > 0) {
    console.log("products: already seeded, skipping");
    return;
  }
  const rows = [
    {
      name: "Faith Walk Tee",
      description:
        "Organic-cotton tee in warm cream with a minimalist embroidered gold cross at the chest. Cut for everyday wear — a quiet witness you can live in.",
      category: "Tees",
      imageUrl: "/api/static/christverse/faith-walk-tee.png",
      scriptureRef: "1 John 1:7",
      price: 34,
      sizes: ["S", "M", "L", "XL", "2XL"],
    },
    {
      name: "Armor of God Hoodie",
      description:
        "Heavyweight charcoal hoodie with tonal ARMOR OF GOD embroidery across the chest. Brushed fleece interior, built to be worn like a daily reminder.",
      category: "Hoodies",
      imageUrl: "/api/static/christverse/armor-of-god-hoodie.png",
      scriptureRef: "Ephesians 6:11",
      price: 62,
      sizes: ["S", "M", "L", "XL", "2XL"],
    },
    {
      name: "Grace & Truth Cap",
      description:
        "Ivory structured 6-panel cap with an embroidered olive-branch and dove motif. Adjustable strap, one size fits most.",
      category: "Headwear",
      imageUrl: "/api/static/christverse/grace-truth-cap.png",
      scriptureRef: "John 1:14",
      price: 28,
      sizes: ["One Size"],
    },
  ];
  for (const r of rows) {
    await db.insert(christverseProducts).values(r);
  }
  console.log(`products: seeded ${rows.length}`);
}

async function main() {
  await seedMessages();
  await seedWearables();
  await seedProducts();
  await pool.end();
  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
