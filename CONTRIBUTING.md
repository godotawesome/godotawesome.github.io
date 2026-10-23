# Contributing to GodotAwesome

Thanks for helping make GodotAwesome better. You do not need to be a regular GitHub user. Pick the path that fits you.

| I want to... | Do this |
|---|---|
| Fix a typo or a small mistake | Edit the file on GitHub and open a pull request, or use the "Report a correction" issue form |
| Report a wrong command or outdated Godot info | Open the **Report a correction** issue form |
| Suggest an article I would like to write | Open the **Pitch an article** issue form |
| Write a guest article | Follow the steps below and open a pull request |

A longer, friendlier version of this guide lives on the site: [Write for GodotAwesome](https://godotawesome.com/write-for-godotawesome/).

## Write a guest article in 8 steps

1. **Pitch first (recommended).** Open the *Pitch an article* issue. It saves you from writing something we already cover. We reply on a best-effort basis.
2. **Fork and clone** this repository, then run the site locally:
   ```bash
   npm ci
   npm run dev
   ```
   Open http://localhost:3000.
3. **Create your post** at `content/posts/YYYY-MM-DD-your-slug.md`.
   - The date is the publish date. A future date goes live on the first deploy after that day.
   - The slug becomes the URL: `/your-slug/`. Keep it short, lowercase, with hyphens. It must be unique and cannot change after publishing.
4. **Add front matter** at the top of the file:
   ```markdown
   ---
   layout: post
   title: "Godot Something: What You Will Learn (Godot 4)"
   author: your-author-id
   categories: [ Tutorials ]
   tags: [GDScript, Godot 4]
   image: assets/images/articles/your-slug.png
   description: "One or two sentences, about 150 characters, with the main keyword."
   featured: false
   hidden: false
   ---
   ```
5. **Add yourself as an author** in `content/authors.json` (copy an existing entry, use a unique id). Put a square avatar in `public/assets/images/`, under 200 KB.
6. **Add images** in `public/assets/images/articles/`. A 1200 x 630 thumbnail named `your-slug.png`, and inline images in a folder named `your-slug/`. Always write alt text.
7. **Check your work** locally:
   ```bash
   npm run build
   npm run check-urls
   ```
8. **Open a pull request.** Fill in the checklist in the template.

Never used Git? On GitHub you can fork the repo, choose **Add file, Create new file** inside `content/posts/`, paste your article, then **Propose changes** and open the pull request from the browser.

## What we look for

- **A quick answer first.** Say what the reader gets in the first paragraph.
- **Tested.** Every command and code snippet must have been run by you. Say which Godot version you used.
- **Sourced.** Link official docs, release notes or the project's repository for facts. Do not invent quotes, statistics, testimonials or sales numbers.
- **Easy to scan.** Short sections, tables, checklists, copy-paste code with a language tag such as `gdscript`.
- **Your own words and screenshots.** Original work only. Credit anything you quote.
- **Plain style.** No filler, no hype. Please do not use em dashes or en dashes.

## AI assistance

Many of us use AI tools, and the Godot community cares about this topic. The rules here:

- AI for grammar and editing is fine.
- If AI wrote substantial parts of the text or code, say so in the pull request.
- You must run and verify every code snippet in the Godot version you state. We will decline articles with untested code or invented facts.

## Links and promotion

- No paid placements, affiliate links or link dropping.
- If you work on, sell or are affiliated with something you write about, add a short disclosure near the top. See the iOS-from-Android article for an example.
- One link to your own site or profile in your author bio is welcome.

## Review and publishing

The maintainer reviews every article for accuracy, fit and style. We may suggest changes or edit lightly for clarity and house style. We may also decline a submission. After the pull request is merged, the article goes live on the next deploy. Guest articles are unpaid: you get a byline, an author page with a bio and a link.

## Rights

By submitting an article you confirm that the work is yours (or you have permission to share it), that you keep the copyright, and that you give GodotAwesome a non-exclusive, worldwide, perpetual license to publish, edit for style, translate and keep it online. Code snippets in articles are available under the MIT License. You may republish your article elsewhere if you link back to the original.

## After publishing

If a reader finds a mistake, we may ask you to fix it. If you are unreachable, we may update the article and keep your byline.

## Be kind

Be respectful and constructive in issues, reviews and pull requests. Harassment and spam are not tolerated.

## Questions

Email [godotawesome@mgonnacrusht.co.uk](mailto:godotawesome@mgonnacrusht.co.uk) or open an issue.
