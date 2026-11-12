# samwitty.github.io

Sam Witty's personal website, built with [Astro](https://astro.build). Requires Node 22.23+ (or prefix commands with `npx -y node@24`).

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

- **Homepage:** `src/pages/index.astro` (bio, links, talks)
- **Essays:** add a Markdown file to `src/content/essays/`. Front matter: `title`, `date`, optional `description`, and `draft: true` to keep it off the published site. `##`/`###` headings form the table of contents; Markdown footnotes (`[^1]`) become margin notes.
- **Deploys** automatically to GitHub Pages on push to `main` (`.github/workflows/deploy.yml`).
- `public/papers/` and `public/presentations/` keep old PDF links working.
