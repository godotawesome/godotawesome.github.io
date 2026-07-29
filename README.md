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

- Every push/PR: `.github/workflows/build.yml` builds and uploads the `out/` artifact (preview locally via artifact download).
- Production cutover: run **Deploy production (manual cutover)** workflow (`workflow_dispatch`) with the `production` environment. Configure GitHub Pages to deploy via GitHub Actions.
- Set repository secret `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (and optional AdSense secrets).

## Content

- Posts: `content/posts/` (filename `YYYY-MM-DD-slug.md` - slug must match live URLs)
- Pages: `content/pages/`
- Authors: `content/authors.json`
