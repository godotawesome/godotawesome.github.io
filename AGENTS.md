# Agent notes

## Read the private memory first
The maintainer keeps project notes (analytics, SEO plans, revenue goals, roadmap) in a **private** repo called `claude_memory`, cloned as a sibling folder: `../claude_memory`.

Before you plan or write anything, read `../claude_memory/CLAUDE.md` and `../claude_memory/godotawesome/README.md`.

**If `../claude_memory` does not exist, tell the user before continuing.** Do not guess its contents and do not recreate them here. This repo is public: never commit analytics numbers, revenue targets, plans or local agent files.

## Working rules
- Live site is **Next.js static export**. Posts live in `content/posts/YYYY-MM-DD-slug.md`. `_posts/` is legacy and does not appear on the site.
- Thumbnails and images go in `public/assets/images/articles/`.
- After adding a post run `node scripts/generate-search-and-feed.mjs` (or `npm run dev`) so `feed.xml` and `search-index.json` update.
- Writing style: quick answer first, short sections, tables and copy-paste code. No em dashes or en dashes, no AI filler.
- Do not commit or push. The maintainer does that. Suggest a commit title in its own code block instead.
