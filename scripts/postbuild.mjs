import fs from "fs";
import path from "path";

const outDir = path.join(process.cwd(), "out");

function ensureOut() {
  if (!fs.existsSync(outDir)) {
    console.error("out/ directory missing — run next build first");
    process.exit(1);
  }
}

function writeRedirect(filePath, targetPath, title = "Redirecting…") {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>${title}</title>
  <link rel="canonical" href="https://godotawesome.com${targetPath}"/>
  <meta http-equiv="refresh" content="0;url=${targetPath}"/>
  <script>location.replace(${JSON.stringify(targetPath)});</script>
</head>
<body>
  <p>Redirecting to <a href="${targetPath}">${targetPath}</a>…</p>
</body>
</html>
`;
  fs.writeFileSync(filePath, html, "utf8");
}

ensureOut();

// Prevent GitHub Pages Jekyll from ignoring `_next/`
fs.writeFileSync(path.join(outDir, ".nojekyll"), "", "utf8");

// Legacy authors.html → /authors/
writeRedirect(path.join(outDir, "authors.html"), "/authors/", "Authors");

// Removed test / docs paths → home (keep URL resolvable for GSC)
for (const legacy of ["analytics-test", "cookie-test", "THEME_GUIDE"]) {
  const dir = path.join(outDir, legacy);
  fs.mkdirSync(dir, { recursive: true });
  writeRedirect(path.join(dir, "index.html"), "/", legacy);
}

// Slashless HTML aliases commonly indexed without trailing slash
for (const page of ["about", "categories", "tags", "privacy-policy", "cookie-policy", "welcome"]) {
  writeRedirect(path.join(outDir, `${page}.html`), `/${page}/`, page);
}

console.log("postbuild: wrote .nojekyll, authors.html and legacy redirect stubs");
