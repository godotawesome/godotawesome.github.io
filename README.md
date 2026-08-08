# GodotAwesome

Static blog built with **Next.js 15** (App Router, `output: 'export'`), deployed to **GitHub Pages**.

## Development

```bash
npm ci
npm run dev
```

## Production build

```bash
npm run build
npm run check-urls
npx serve out
```

## Deploy

- Push to `main`: **Deploy production** builds, then deploys to GitHub Pages automatically.
- Every Saturday 09:00 Turkey (`cron: 0 6 * * 6` UTC): same production deploy, so future-dated posts go live.
- Push to `development` / PRs: **Build and preview artifact** only (download `site-out` to preview).
- Manual re-deploy: Actions → **Deploy production** → Run workflow.
- Repo Settings → Pages → Source: GitHub Actions.
- Set repository secret `NEXT_PUBLIC_UMAMI_WEBSITE_ID`.
- If the `production` environment has required reviewers, remove them or deploys will wait for approval.

## Content

- Posts: `content/posts/` (filename `YYYY-MM-DD-slug.md` - slug must match live URLs)
- Pages: `content/pages/`
- Authors: `content/authors.json`
