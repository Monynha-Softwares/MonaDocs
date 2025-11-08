## MonaDocs — AI coding agent instructions

This concise guide gives AI coding agents the exact repository facts needed to be productive immediately.

Quick facts

- Node: >= 20 (see `package.json` "engines").
- Package manager: `yarn`.
- Key scripts: `yarn start` (dev), `yarn build`, `yarn serve`, `yarn deploy`.
- Tests: run `node --test scripts` (see `scripts/` folder).

Architecture & key files

- Docusaurus v3 site. Config: `docusaurus.config.js` (note: `editUrl` points at branch `dev`).
- Docs: `docs/` (grouped by subfolders). Category metadata: `_category_.json` in subfolders.
- Sidebar: `sidebars.js` dynamically reads `docs/` and builds categories using `TOP_FOLDERS`. Edit this file for manual ordering.
- Blog: `blog/` (MD/MDX). Authors: `blog/authors.yml`. Use `YYYY-MM-DD-title.md` filenames with YAML frontmatter (`title`, `tags`, `authors`).
- UI components: `src/components/` (e.g., `HomepageFeatures`, `TechStack`, `Portfolio`). Global CSS: `src/css/custom.css`.
- Static assets: `static/img/` (use `docs/<section>/img/` for doc-local images referenced as `./img/foo.png`).

Conventions & quick examples

- Add a doc: create `docs/<section>/new-doc.md` or `docs/<section>/index.md`. Add `_category_.json` to customize label/description.
- Add a blog post: create `blog/2025-11-08-my-post.md` with YAML frontmatter and add authors into `blog/authors.yml`.
- Edit homepage features: update `src/components/HomepageFeatures/index.js` and its `styles.module.css`; preview with `yarn start`.

Build / validate / deploy

- Install: `yarn`. Dev: `yarn start` (hot reload, port 3000). Build: `yarn build`. Preview: `yarn serve`.
- Deploy: GitHub Pages via `yarn deploy`. Example: `USE_SSH=true; yarn deploy` (docusaurus preset).
- Local validation: `yarn build && yarn serve` and inspect `build/`. There is no CI configured by default.

Watch-outs (repo-specific)

- `docusaurus.config.js` and `sidebars.js` run on Node — avoid browser globals like `window` or `document`.
- `sidebars.js` expects a particular `docs/` layout and `TOP_FOLDERS` ordering; moving files without updating `_category_.json` can break the generated sidebar.
- `future.v4: true` is enabled in config; be cautious when upgrading Docusaurus or changing theme internals.

Files to inspect when debugging

- `package.json` — scripts and `engines.node` requirement.
- `docusaurus.config.js` — nav, footer, editUrl, and presets.
- `sidebars.js` — dynamic sidebar generation logic.
- `docs/`, `blog/`, `src/components/`, `static/img/` — content, components, and assets.

If you'd like, I can expand this with concrete examples (MDX embedding, adding a new component, or a quick smoke test) — tell me which area to expand.
