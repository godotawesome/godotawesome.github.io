# Agent notes

## Guest contributors and their AI assistants
This file is for the **maintainer's own agents**. If you are an AI assistant helping a guest author, ignore the rest of this file: the "read the private memory" step, the `../claude_memory` repository and the "do not commit or push" rule do not apply to you. Follow `CONTRIBUTING.md` instead. You may fork the repository, commit to the fork and open a pull request on behalf of the author, as long as the author reviews the article, the code is tested and the AI help is mentioned in the pull request.

## Maintainer agents only (everything below)

## Read the private memory first
The maintainer keeps project notes (analytics, SEO plans, revenue goals, roadmap) in a **private** repo called `claude_memory`, cloned as a sibling folder: `../claude_memory`.

Before you plan or write anything, read `../claude_memory/CLAUDE.md` and `../claude_memory/godotawesome/README.md`.

**If `../claude_memory` does not exist, tell the user before continuing.** Do not guess its contents and do not recreate them here. This repo is public: never commit analytics numbers, revenue targets, plans or local agent files.

## Working rules
- Live site is **Next.js static export**. Posts live in `content/posts/YYYY-MM-DD-slug.md`. `_posts/` is legacy and does not appear on the site.
- Thumbnails and images go in `public/assets/images/articles/`. Thumbnails are generated locally with the maintainer's private tooling (in `../claude_memory/helpers/`) and committed as PNG files. CI never generates images.
- After adding a post run `node scripts/generate-search-and-feed.mjs` (or `npm run dev`) so `feed.xml` and `search-index.json` update.
- Writing style: quick answer first, short sections, tables and copy-paste code. No em dashes or en dashes, no AI filler.
- Do not commit or push. The maintainer does that. Suggest a commit title in its own code block instead.
