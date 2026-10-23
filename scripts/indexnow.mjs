// Notify IndexNow (Bing, Yandex and others) about new or changed URLs.
// Usage after a deploy:  node scripts/indexnow.mjs /godot-versions/ /godot-4-8/
// The key file lives in public/ff7aa7f01ffc903d0dca65d5fca44715.txt and must be live on the site first.
const HOST = "godotawesome.com";
const KEY = "ff7aa7f01ffc903d0dca65d5fca44715";

const paths = process.argv.slice(2);
if (paths.length === 0) {
  console.error("Pass at least one path, e.g. /godot-4-8/");
  process.exit(1);
}

const body = {
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: paths.map((p) => `https://${HOST}${p.startsWith("/") ? p : `/${p}`}`),
};

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});
console.log(`IndexNow responded ${res.status} for ${body.urlList.length} URL(s)`);
