import { Router, type IRouter } from "express";
import { createHash, randomBytes } from "node:crypto";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "./db";
import {
  christverseMessages,
  christverseProducts,
  christverseTips,
  christverseWearables,
  type ChristverseMessageRow,
  type ChristverseProductRow,
  type ChristverseTipRow,
  type ChristverseWearableRow,
} from "./schema";
import {
  ListChristverseMessagesResponse,
  CreateChristverseMessageBody,
  CreateChristverseMessageResponse,
  GetChristverseMessageResponse,
  TipChristverseMessageBody,
  TipChristverseMessageResponse,
  ListChristverseWearablesResponse,
  MintChristverseWearableBody,
  MintChristverseWearableResponse,
  GetChristverseWearableResponse,
  ListChristverseProductsResponse,
  GetChristverseProductResponse,
  GetChristverseStatsResponse,
} from "./validation/generated/api";

/**
 * ChristVerse Fashion API.
 *
 * The blockchain layer is SIMULATED in this MVP and the API is honest about
 * it: contentHash is a REAL sha256 of the content, but txId ("cvtx_...") and
 * tokenId ("cvt_...") are mock identifiers minted here, not on any chain.
 * Wallet addresses are client-supplied mock identities (no signatures) —
 * swap points for a real chain + real wallet auth are documented in
 * docs/ARCHITECTURE.md.
 */

const router: IRouter = Router();

const sha256 = (input: string) =>
  createHash("sha256").update(input, "utf8").digest("hex");
const mockTxId = () => `cvtx_${randomBytes(12).toString("hex")}`;
const mockTokenId = () => `cvt_${randomBytes(8).toString("hex")}`;

function parseId(raw: string | undefined): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

const tipAgg = {
  tipCount: sql<number>`count(${christverseTips.id})::int`,
  tipTotal: sql<number>`coalesce(sum(${christverseTips.amount}), 0)::float8`,
};

function serializeMessage(
  row: ChristverseMessageRow,
  tipCount: number,
  tipTotal: number,
) {
  return {
    id: row.id,
    walletAddress: row.walletAddress,
    content: row.content,
    scriptureRef: row.scriptureRef,
    contentHash: row.contentHash,
    txId: row.txId,
    tipCount,
    tipTotal,
    createdAt: row.createdAt.toISOString(),
  };
}

function serializeTip(row: ChristverseTipRow) {
  return {
    id: row.id,
    messageId: row.messageId,
    walletAddress: row.walletAddress,
    amount: row.amount,
    txId: row.txId,
    createdAt: row.createdAt.toISOString(),
  };
}

function serializeWearable(row: ChristverseWearableRow) {
  return {
    id: row.id,
    walletAddress: row.walletAddress,
    name: row.name,
    description: row.description,
    category: row.category,
    imageUrl: row.imageUrl,
    prompt: row.prompt,
    price: row.price,
    royaltyBps: row.royaltyBps,
    tokenId: row.tokenId,
    txId: row.txId,
    contentHash: row.contentHash,
    createdAt: row.createdAt.toISOString(),
  };
}

router.get("/christverse/messages", async (req, res) => {
  let limit = 50;
  if (req.query["limit"] !== undefined) {
    const parsed = Number(req.query["limit"]);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100) {
      res.status(400).json({ error: "limit must be an integer 1-100" });
      return;
    }
    limit = parsed;
  }
  const rows = await db
    .select({ msg: christverseMessages, ...tipAgg })
    .from(christverseMessages)
    .leftJoin(
      christverseTips,
      eq(christverseTips.messageId, christverseMessages.id),
    )
    .groupBy(christverseMessages.id)
    .orderBy(desc(christverseMessages.createdAt), desc(christverseMessages.id))
    .limit(limit);
  res.json(
    ListChristverseMessagesResponse.parse(
      rows.map((r) => serializeMessage(r.msg, r.tipCount, r.tipTotal)),
    ),
  );
});

router.post("/christverse/messages", async (req, res) => {
  const parsed = CreateChristverseMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { walletAddress, content, scriptureRef } = parsed.data;
  const trimmed = content.trim();
  if (!trimmed) {
    res.status(400).json({ error: "Message content cannot be empty" });
    return;
  }
  const [row] = await db
    .insert(christverseMessages)
    .values({
      walletAddress,
      content: trimmed,
      scriptureRef: scriptureRef?.trim() || null,
      contentHash: sha256(trimmed),
      txId: mockTxId(),
    })
    .returning();
  if (!row) {
    res.status(500).json({ error: "Failed to create message" });
    return;
  }
  res
    .status(201)
    .json(CreateChristverseMessageResponse.parse(serializeMessage(row, 0, 0)));
});

router.get("/christverse/messages/:id", async (req, res) => {
  const id = parseId(req.params["id"]);
  if (id === null) {
    res.status(404).json({ error: "Message not found" });
    return;
  }
  const [row] = await db
    .select()
    .from(christverseMessages)
    .where(eq(christverseMessages.id, id));
  if (!row) {
    res.status(404).json({ error: "Message not found" });
    return;
  }
  const tips = await db
    .select()
    .from(christverseTips)
    .where(eq(christverseTips.messageId, id))
    .orderBy(desc(christverseTips.createdAt), desc(christverseTips.id));
  const tipTotal = tips.reduce((sum, t) => sum + t.amount, 0);
  res.json(
    GetChristverseMessageResponse.parse({
      message: serializeMessage(row, tips.length, tipTotal),
      tips: tips.map(serializeTip),
    }),
  );
});

router.post("/christverse/messages/:id/tip", async (req, res) => {
  const id = parseId(req.params["id"]);
  if (id === null) {
    res.status(404).json({ error: "Message not found" });
    return;
  }
  const parsed = TipChristverseMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { walletAddress, amount } = parsed.data;
  const [message] = await db
    .select()
    .from(christverseMessages)
    .where(eq(christverseMessages.id, id));
  if (!message) {
    res.status(404).json({ error: "Message not found" });
    return;
  }
  if (message.walletAddress === walletAddress) {
    res.status(400).json({ error: "You cannot tip your own message" });
    return;
  }
  const [row] = await db
    .insert(christverseTips)
    .values({ messageId: id, walletAddress, amount, txId: mockTxId() })
    .returning();
  if (!row) {
    res.status(500).json({ error: "Failed to record tip" });
    return;
  }
  res.status(201).json(TipChristverseMessageResponse.parse(serializeTip(row)));
});

router.get("/christverse/wearables", async (req, res) => {
  const category =
    typeof req.query["category"] === "string" && req.query["category"].trim()
      ? req.query["category"].trim()
      : null;
  const base = db.select().from(christverseWearables);
  const rows = await (category
    ? base.where(eq(christverseWearables.category, category))
    : base
  ).orderBy(desc(christverseWearables.createdAt), desc(christverseWearables.id));
  res.json(
    ListChristverseWearablesResponse.parse(rows.map(serializeWearable)),
  );
});

router.post("/christverse/wearables", async (req, res) => {
  const parsed = MintChristverseWearableBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const {
    walletAddress,
    name,
    description,
    category,
    imageUrl,
    prompt,
    price,
    royaltyBps,
  } = parsed.data;
  const trimmedName = name.trim();
  const trimmedDescription = description.trim();
  const trimmedCategory = category.trim();
  if (!trimmedName || !trimmedDescription || !trimmedCategory) {
    res
      .status(400)
      .json({ error: "Name, description, and category cannot be empty" });
    return;
  }
  // The hash covers the metadata that would live on-chain/IPFS for a real mint.
  const metadata = JSON.stringify({
    name: trimmedName,
    description: trimmedDescription,
    category: trimmedCategory,
    imageUrl: imageUrl ?? null,
    prompt: prompt?.trim() || null,
    creator: walletAddress,
  });
  const [row] = await db
    .insert(christverseWearables)
    .values({
      walletAddress,
      name: trimmedName,
      description: trimmedDescription,
      category: trimmedCategory,
      imageUrl: imageUrl?.trim() || null,
      prompt: prompt?.trim() || null,
      price,
      royaltyBps: royaltyBps ?? 500,
      tokenId: mockTokenId(),
      txId: mockTxId(),
      contentHash: sha256(metadata),
    })
    .returning();
  if (!row) {
    res.status(500).json({ error: "Failed to mint wearable" });
    return;
  }
  res
    .status(201)
    .json(MintChristverseWearableResponse.parse(serializeWearable(row)));
});

router.get("/christverse/wearables/:id", async (req, res) => {
  const id = parseId(req.params["id"]);
  if (id === null) {
    res.status(404).json({ error: "Wearable not found" });
    return;
  }
  const [row] = await db
    .select()
    .from(christverseWearables)
    .where(eq(christverseWearables.id, id));
  if (!row) {
    res.status(404).json({ error: "Wearable not found" });
    return;
  }
  res.json(GetChristverseWearableResponse.parse(serializeWearable(row)));
});

// --- Physical clothing collection ("Fashion Universe" shop pillar). ---
// Checkout is SIMULATED in this MVP: the catalog is browsable, but no real
// payment is processed. Real commerce is a documented roadmap item.

function serializeProduct(row: ChristverseProductRow) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    imageUrl: row.imageUrl,
    scriptureRef: row.scriptureRef,
    price: row.price,
    sizes: row.sizes,
    createdAt: row.createdAt.toISOString(),
  };
}

router.get("/christverse/products", async (req, res) => {
  const category =
    typeof req.query["category"] === "string" && req.query["category"].trim()
      ? req.query["category"].trim()
      : null;
  const base = db.select().from(christverseProducts);
  const rows = await (category
    ? base.where(eq(christverseProducts.category, category))
    : base
  ).orderBy(desc(christverseProducts.createdAt), desc(christverseProducts.id));
  res.json(ListChristverseProductsResponse.parse(rows.map(serializeProduct)));
});

router.get("/christverse/products/:id", async (req, res) => {
  const id = parseId(req.params["id"]);
  if (id === null) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  const [row] = await db
    .select()
    .from(christverseProducts)
    .where(eq(christverseProducts.id, id));
  if (!row) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(GetChristverseProductResponse.parse(serializeProduct(row)));
});

router.get("/christverse/stats", async (_req, res) => {
  const [[msgStats], [tipStats], [wearableStats], [productStats], creatorRows] =
    await Promise.all([
      db
        .select({ total: sql<number>`count(*)::int` })
        .from(christverseMessages),
      db
        .select({
          total: sql<number>`count(*)::int`,
          volume: sql<number>`coalesce(sum(${christverseTips.amount}), 0)::float8`,
        })
        .from(christverseTips),
      db
        .select({ total: sql<number>`count(*)::int` })
        .from(christverseWearables),
      db
        .select({ total: sql<number>`count(*)::int` })
        .from(christverseProducts),
      db.execute(sql`
        select count(distinct wallet_address)::int as creators from (
          select wallet_address from christverse_messages
          union
          select wallet_address from christverse_wearables
        ) as all_wallets
      `),
    ]);
  const creators = Number(
    (creatorRows.rows[0] as { creators?: number } | undefined)?.creators ?? 0,
  );
  res.json(
    GetChristverseStatsResponse.parse({
      totalMessages: msgStats?.total ?? 0,
      totalTips: tipStats?.total ?? 0,
      tipVolume: tipStats?.volume ?? 0,
      totalWearables: wearableStats?.total ?? 0,
      totalProducts: productStats?.total ?? 0,
      totalCreators: creators,
    }),
  );
});

export default router;
