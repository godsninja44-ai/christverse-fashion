import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import routes from "./routes";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Static product / wearable images.
app.use(
  "/api/static",
  express.static(path.resolve(__dirname, "..", "public"), {
    maxAge: "1d",
    fallthrough: true,
  }),
);

app.get("/api/healthz", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api", routes);

// Honest error handler: no silent fallbacks.
app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  },
);

const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () => {
  console.log(`ChristVerse Fashion API listening on :${port}`);
});
