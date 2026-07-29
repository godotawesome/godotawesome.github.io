# Migration verification checklist (staging via `npx serve out`)

## URL / SEO
- [ ] `/` loads; Featured + All Stories visible
- [ ] `/page2/` … `/page5/` paginate correctly
- [ ] Sample posts resolve (e.g. `/until-then/`, `/best-godot-plugins-2026/`)
- [ ] `/categories/`, `/tags/`, `/authors/`, `/authors.html` (redirect), `/about/`, policies
- [ ] `/category/tutorials/` (and other archives) work
- [ ] `/sitemap.xml`, `/robots.txt`, `/feed.xml`, `/search-index.json` return 200
- [ ] `npm run check-urls` passes

## Chrome / content
- [ ] No Disqus / Ko-fi network requests
- [ ] Search modal finds posts
- [ ] Share links open
- [ ] Mobile nav + dropdowns usable; keyboard focus visible

## Consent / analytics
- [ ] Reject optional → no GA/Clarity/AdSense scripts; Umami loads if `NEXT_PUBLIC_UMAMI_WEBSITE_ID` set
- [ ] Accept analytics → GA + Clarity load
- [ ] Accept advertising → AdSense slots activate when enabled via env

## Cutover
- [ ] Download CI `site-out` artifact and spot-check locally
- [ ] Set GitHub secret `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
- [ ] Repo Settings → Pages → Source: GitHub Actions
- [ ] Create Environment `production` (optional required reviewers)
- [ ] Run **Deploy production (manual cutover)** workflow
- [ ] GSC: resubmit sitemap; watch Coverage for 404 spikes
