import fs from "fs";
import path from "path";
import matter from "gray-matter";

const SITE_URL = "https://godotawesome.com";
const postsDir = path.join(process.cwd(), "content/posts");
const publicDir = path.join(process.cwd(), "public");

const POST_RE = /^(\d{4}-\d{1,2}-\d{1,2})-(.+)\.md$/i;

function stripMd(text) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/[#>*_~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isPublished(data, fileDate) {
  if (data.draft === true || data.hidden === true) return false;
  const dateStr = data.date ? String(data.date).slice(0, 10) : fileDate;
  const t = Date.parse(dateStr);
  return !Number.isNaN(t) && t <= Date.now();
}

function getPosts() {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  const posts = [];
  for (const filename of files) {
    const m = filename.match(POST_RE);
    if (!m) continue;
    const parts = m[1].split("-").map((p) => p.padStart(2, "0"));
    const fileDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
    const slug = m[2];
    const raw = fs.readFileSync(path.join(postsDir, filename), "utf8");
    const { data, content } = matter(raw);
    if (!isPublished(data, fileDate)) continue;
    const date = data.date ? String(data.date).slice(0, 10) : fileDate;
    posts.push({
      slug,
      title: data.title || slug,
      date,
      description: data.description || stripMd(content).split(/\s+/).slice(0, 30).join(" "),
      content,
      tags: Array.isArray(data.tags) ? data.tags : [],
      categories: Array.isArray(data.categories) ? data.categories : [],
    });
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

function rfc822(dateStr) {
  return new Date(dateStr).toUTCString();
}

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const posts = getPosts();

const searchDocs = posts.map((p) => ({
  id: p.slug,
  url: `/${p.slug}/`,
  title: p.title,
  body: `${p.description} ${stripMd(p.content).slice(0, 500)}`,
}));

fs.writeFileSync(
  path.join(publicDir, "search-index.json"),
  JSON.stringify(searchDocs),
  "utf8",
);

const items = posts
  .slice(0, 10)
  .map((p) => {
    const cats = [...p.tags, ...p.categories]
      .map((c) => `        <category>${xmlEscape(c)}</category>`)
      .join("\n");
    return `      <item>
        <title>${xmlEscape(p.title)}</title>
        <description>${xmlEscape(stripMd(p.content).slice(0, 500))}</description>
        <pubDate>${rfc822(p.date)}</pubDate>
        <link>${SITE_URL}/${p.slug}/</link>
        <guid isPermaLink="true">${SITE_URL}/${p.slug}/</guid>
${cats}
      </item>`;
  })
  .join("\n");

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>GodotAwesome</title>
    <description>Your place for Godot Engine content: tutorials, projects, and community insights for indie developers and open-source creators.</description>
    <link>${SITE_URL}/</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

fs.writeFileSync(path.join(publicDir, "feed.xml"), feed, "utf8");
console.log(`Generated search-index.json (${searchDocs.length}) and feed.xml`);
