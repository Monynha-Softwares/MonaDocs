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
## Purpose

This file gives concise, repository-specific guidance to an AI coding agent so it can be productive working on this Docusaurus documentation site.

## Big picture

- This repo is a Docusaurus v3 site (see `docusaurus.config.js`) using the classic preset. Content is split into `docs/` (documentation) and `blog/` (posts). React UI code lives in `src/` and static assets in `static/`.
- Primary agent responsibilities: run the dev server, add/edit docs & blog posts (MD/MDX), update UI components/styles, manage sidebar and category metadata, build and deploy the site.

## Key files & folders

- `package.json` — scripts: `start` (dev), `build` (prod), `serve` (serve build), `deploy` (GitHub Pages). Node >= 20 is required (check `engines`).
- `docusaurus.config.js` — global site config (baseUrl, organizationName, projectName, editUrl, navbar/footer). Verify `organizationName` / `projectName` before changing deploy targets.
- `sidebars.js` — controls docs sidebar. Adding/moving docs often requires updating this file or the sidebar path used by the config.
- `docs/` — markdown/MDX docs. Subfolders use `_category_.json` for grouping (see `docs/tutorial-basics/_category_.json`).
- `blog/` — posts (MD/MDX) and metadata: `authors.yml`, `tags.yml`. Example: `blog/2021-08-01-mdx-blog-post.mdx`.
- `src/components/` — React UI components used by pages (example: `src/components/HomepageFeatures/index.js`).
- `src/css/custom.css` — global styling. Page-specific modules exist under `src/pages`.
- `static/img/` and `docs/**/img/` — image assets. Use `static/img/` for global assets and relative `./img/...` inside docs for doc-scoped images.

## Quick start (Windows / PowerShell)

1. Install dependencies:

```powershell
yarn
```

2. Run dev server (hot reload; default port 3000):

```powershell
yarn start
```

3. Build and preview production:

```powershell
yarn build
yarn serve
```

4. Deploy to GitHub Pages (as provided in repo):

```powershell
USE_SSH=true; yarn deploy
# or without SSH
GIT_USER=<your-username>; yarn deploy
```

If you prefer npm, replace `yarn` with `npm run` for the named scripts.

## Project-specific conventions & patterns

- Docs grouping: each docs subfolder may include `_category_.json` that the site relies on. Don't rename or remove them without updating `sidebars.js`.
- Images: place global images in `static/img/` and per-doc images in a `img/` folder next to the doc file; reference via `./img/foo.png` in Markdown.
- UI: small reusable components live in `src/components/`. Use existing styles in `src/css/custom.css` and `src/components/*/styles.module.css` patterns.
- MDX usage: examples exist in `docs/` and `blog/` — prefer MDX when embedding React components inside docs.

## Integration points & external dependencies

- Docusaurus packages (check `package.json`): primary runtime. Avoid adding heavy runtime-only dependencies unless necessary for docs.
- GitHub Pages is the default deploy target (deploy script present). Confirm `docusaurus.config.js` `organizationName` and `projectName` match the repo/org before changing `editUrl` or deploy settings.
- No CI configuration was found in the repo root. If you add CI (GitHub Actions), ensure Node >= 20 and `yarn install && yarn build` steps.

## Concrete examples (what to change and where)

- Add a doc: create `docs/<section>/new-doc.md` (or `.mdx`) and add/update `sidebars.js` or rely on the configured automatic sidebar path.
- Add blog post: `blog/YYYY-MM-DD-title.md` with YAML frontmatter (title, tags, authors). Update `blog/authors.yml` for new authors.
- Edit homepage features: modify `src/components/HomepageFeatures/index.js` and `src/components/HomepageFeatures/styles.module.css`, then `yarn start` to hot-reload.

## Notes & watch-outs

- Docusaurus config runs in Node (no browser globals). Keep dynamic code safe for Node execution.
- The repo uses Docusaurus v3 with `future.v4: true` — upgrading to v4 may require breaking changes; test locally.
- Verify `organizationName` / `projectName` in `docusaurus.config.js` before deploying.
- There are no automated tests found in the repo — treat code edits accordingly and do a local build verification (`yarn build && yarn serve`).

## When editing/PR guidance for an AI agent

- Make one small, testable change per PR (e.g., add a doc, update a component). Run `yarn start` or `yarn build` locally to validate.
- Update `sidebars.js` or the relevant `_category_.json` if moving docs between folders.
- For visual changes, include screenshots in the PR description and the `build/` output when applicable.

## Contact / Maintainer questions

- Confirm values for `organizationName` and `projectName` in `docusaurus.config.js` if you plan to change deploy settings.
- If you want CI configuration or GitHub Actions templates, specify Node version and preferred publish flow.

---
If you'd like, I can: (a) add a small GitHub Actions workflow that runs `yarn build` on PRs, or (b) generate a short CONTRIBUTING.md with doc/post guidelines—tell me which and I'll implement it.
