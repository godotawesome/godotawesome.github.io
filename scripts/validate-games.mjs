// Checks content/games/godot-games.json before a commit.
// Usage: node scripts/validate-games.mjs
import fs from "node:fs";

const FILE = "content/games/godot-games.json";
const STORES = ["steam", "epic", "gog", "itch", "xbox", "playstation", "nintendo", "app_store", "google_play", "microsoft_store"];
const STATUS = ["released", "early_access", "upcoming"];
const PROOF = ["official_showcase", "developer_statement", "postmortem", "store_page", "press", "steamdb_tech"];
const DATE = /^\d{4}(-\d{2}(-\d{2})?)?$/;

const errors = [];
const warn = [];
const err = (id, msg) => errors.push(`${id}: ${msg}`);

let data;
try {
  data = JSON.parse(fs.readFileSync(FILE, "utf8"));
} catch (e) {
  console.error(`Invalid JSON in ${FILE}: ${e.message}`);
  process.exit(1);
}

const { meta, games } = data;
if (!meta || typeof meta.mock !== "boolean" || !DATE.test(meta.last_checked ?? "")) err("meta", "needs mock (boolean) and last_checked (YYYY-MM-DD)");
if (!Array.isArray(games)) err("games", "must be an array");

const ids = new Set();
for (const g of games ?? []) {
  const id = g.id || "(no id)";
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(g.id ?? "")) err(id, "id must be kebab-case");
  if (ids.has(g.id)) err(id, "duplicate id");
  ids.add(g.id);
  if (!g.name) err(id, "name missing");
  if (!DATE.test(g.release_date ?? "")) err(id, "release_date must be YYYY, YYYY-MM or YYYY-MM-DD");
  if (!STATUS.includes(g.status)) err(id, `status must be one of ${STATUS.join(", ")}`);
  if (!Array.isArray(g.developers) || !g.developers.length) err(id, "at least one developer");
  if (!Array.isArray(g.publishers)) err(id, "publishers must be an array");
  if (!g.godot_proof?.url) err(id, "godot_proof.url missing (no proof, no row)");
  if (!PROOF.includes(g.godot_proof?.type)) err(id, "godot_proof.type invalid");
  const storeKeys = Object.keys(g.stores ?? {});
  if (!storeKeys.length) err(id, "at least one store link");
  for (const k of storeKeys) if (!STORES.includes(k)) err(id, `unknown store "${k}"`);
  const pct = g.reviews?.positive_pct;
  if (pct != null && (pct < 0 || pct > 100)) err(id, "positive_pct must be 0 to 100");
  if (g.reviews?.total != null && !Number.isInteger(g.reviews.total)) err(id, "reviews.total must be an integer");
  if (g.revenue?.usd != null && g.revenue.usd < 0) err(id, "revenue.usd must be positive");
  if (g.revenue?.usd != null && !g.revenue.url) err(id, "revenue.usd needs revenue.url");
  if (g.time_to_beat?.hours_min != null && !g.time_to_beat.url) err(id, "time_to_beat needs a url");
  if (!g.description) err(id, "description missing");
  if (g.description?.length > 240) warn.push(`${id}: description over 240 characters`);
  if (/[–—]/.test(JSON.stringify(g))) err(id, "contains an en dash or em dash");
  if (!DATE.test(g.last_checked ?? "")) err(id, "last_checked must be YYYY-MM-DD");
  if (!meta.mock && /example\.com|lorem ipsum/i.test(JSON.stringify(g))) err(id, "mock content left in real data");
  if (g.article && !g.article.startsWith("/")) err(id, "article must be an internal path like /slug/");
}

if (!meta?.mock && (games?.length ?? 0) < 30) warn.push(`only ${games.length} games (target 30 to 50)`);

warn.forEach((w) => console.warn(`warn  ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`error ${e}`));
  console.error(`\n${errors.length} error(s). Fix them before committing.`);
  process.exit(1);
}
console.log(`OK: ${games.length} games, mock=${meta.mock}, last_checked=${meta.last_checked}`);
