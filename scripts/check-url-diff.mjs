import fs from "fs";
import path from "path";

const outDir = path.join(process.cwd(), "out");
const baseline = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "scripts/url-baseline.json"), "utf8"),
);

function pathToFile(urlPath) {
  if (urlPath === "/") return path.join(outDir, "index.html");
  if (urlPath.endsWith(".html") || urlPath.endsWith(".xml") || urlPath.endsWith(".txt") || urlPath.endsWith(".json")) {
    return path.join(outDir, urlPath.replace(/^\//, ""));
  }
  const trimmed = urlPath.replace(/^\//, "").replace(/\/$/, "");
  return path.join(outDir, trimmed, "index.html");
}

if (!fs.existsSync(outDir)) {
  console.error("FAIL: out/ missing. Run npm run build first.");
  process.exit(1);
}

const missing = [];
for (const p of baseline.paths) {
  const file = pathToFile(p);
  if (!fs.existsSync(file)) missing.push({ path: p, file });
}

if (missing.length) {
  console.error("URL diff FAIL — missing paths:");
  for (const m of missing) console.error(`  ${m.path}  →  ${m.file}`);
  process.exit(1);
}

console.log(`URL diff OK — ${baseline.paths.length} baseline paths present in out/`);
