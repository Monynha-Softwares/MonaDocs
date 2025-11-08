## Purpose

This file gives concise, repository-specific guidance to an AI coding agent so it can be productive working on the Docusaurus documentation site in this repo.

## Big picture

- This project is a Docusaurus site (see `docusaurus.config.js`) using the classic preset. Main content lives under `docs/` and `blog/`. React UI code is in `src/` and static assets in `static/`.
- Primary responsibilities: serve the site locally, author docs/blog posts (Markdown/MDX), update UI components and styles, and build/deploy the static site.

## Important files & folders (examples)

- `package.json` — contains npm/yarn scripts used to run, build, and deploy the site (see `start`, `build`, `deploy`).
- `docusaurus.config.js` — global config: `baseUrl`, `organizationName`, `projectName`, i18n, theme, navbar/footer.
- `sidebars.js` — docs sidebar configuration. When changing doc structure, update this file.
- `docs/` — documentation pages. Subfolders use `_category_.json` for grouping (example: `tutorial-basics/_category_.json`).
- `blog/` — blog posts (Markdown/MDX) and metadata files `authors.yml`, `tags.yml`.
- `src/components/` — custom React components used by pages (example: `src/components/HomepageFeatures/index.js`).
- `static/img/` and `docs/**/img/` — image assets referenced by docs/blog.

## Development commands (explicit)

Run locally (recommended, project README uses yarn):

```powershell
yarn
yarn start   # runs the Docusaurus dev server (hot reload)
```

Build for production:

```powershell
yarn build   # outputs static site to `build/`
```

Serve a local production build:

```powershell
yarn serve
```

Deploy (GitHub Pages example from README):

```powershell
USE_SSH=true yarn deploy
# or without SSH
GIT_USER=<your-username> yarn deploy
```

Node runtime: config requires Node >= 20 (see `package.json` `engines`). Use that when running CI or local dev.

If the user prefers npm, substitute `npm run <script>` for `yarn <script>`.

## Project-specific conventions & patterns

- Docs are written as Markdown or MDX and live under `docs/`. Category grouping uses `_category_.json` files (do not rename without updating `sidebars.js`).
- Blog posts can be `.md` or `.mdx`; frontmatter controls `title`, `tags`, `authors`. Look at `blog/2021-08-01-mdx-blog-post.mdx` for an MDX example.
- The site uses Docusaurus v3 with `future.v4: true`. Be cautious about v4 breaking changes if upgrading dependencies.
- Styling: global styles in `src/css/custom.css`. Reusable UI components live in `src/components/` and follow plain React (no TypeScript present in codebase by default).
- Image assets: prefer `static/img/` for global images and `docs/**/img/` for doc-scoped images. Use relative paths in Markdown (e.g., `./img/example.png`).

## Integration points & external dependencies

- Docusaurus (packages in `dependencies`) — core site generator.
- GitHub pages is the expected deployment target (deploy script present). Check `docusaurus.config.js` `organizationName`/`projectName` — they may be placeholders and should match the repo when configuring `editUrl` or deploying.
- No explicit CI config in repo root was found; if adding CI, ensure Node >=20 and yarn install/build steps.

## Examples for common tasks (concrete)

- Add a new doc page under `docs/tutorial-basics/` and include it in `sidebars.js` or let the `sidebarPath` auto-include based on current config.
- Add a new blog post: create `blog/YYYY-MM-DD-title.md` with frontmatter; update `authors.yml` if introducing new authors.
- Make a UI change: edit `src/components/HomepageFeatures/index.js` and `src/css/custom.css`, then `yarn start` to iterate.

## What to avoid / watch-outs

- Do not assume `organizationName`/`projectName` in `docusaurus.config.js` are correct — they are template placeholders. Verify before changing deploy targets or `editUrl`.
- This repo uses yarn commands in README; CI or scripts should also use Node >=20.
- Docusaurus configuration runs in Node context (no browser globals) — avoid using browser APIs in `docusaurus.config.js`.

## If you need to make edits

- When adding or moving docs, update `sidebars.js` and run `yarn start` to confirm the sidebar and routing.
- For deployment-related changes, run a full `yarn build` and `yarn serve` locally before pushing.

## Questions for the maintainer

- Should `docusaurus.config.js` `organizationName` and `projectName` be updated to the real GitHub org/repo? If yes, provide the correct values.
- Is there a preferred CI/CD process (GitHub Actions, other) or a deploy target other than GitHub Pages?

---
If anything above is unclear or you want this adapted (more or fewer examples, or CI + GitHub Actions guidance), tell me what to include and I'll iterate.
