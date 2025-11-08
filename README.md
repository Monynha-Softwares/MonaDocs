# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

# MonaDocs — Documentation site

This repository contains the source for the MonaDocs documentation website, built with Docusaurus v3.

Quick start
1. Install dependencies (Node >= 20 recommended):

```powershell
yarn
```

2. Start development server (hot reload):

```powershell
yarn start
```

3. Build production site:

```powershell
yarn build
```

4. Preview the built site locally:

```powershell
yarn serve
```

Deployment
- Deploy to GitHub Pages using SSH:

```powershell
USE_SSH=true yarn deploy
```

- Deploy with a username (no SSH):

```powershell
GIT_USER=<YourGitHubUsername> yarn deploy
```

Repository layout — files you will touch most
- `docusaurus.config.js` — main site configuration (navbar/footer, presets, GitHub pages settings).
- `sidebars.js` — programmatic sidebar generator for docs. Keep it in sync when adding folders or custom ordering.
- `docs/` — Markdown / MDX documentation. Subfolders may contain `_category_.json` to override category labels.
- `blog/` — blog posts (MD/MDX) and metadata (`blog/authors.yml`, `blog/tags.yml`).
- `src/components/` — custom React components used by pages and MDX (examples: `HomepageFeatures`, `Portfolio`, `TechStack`, `Repositories`).
- `src/css/custom.css` and `src/components/*/styles.module.css` — global and component styles.
- `static/` — static files (images, assets) that are copied to the final build.

Important project conventions and gotchas
- Node runtime: Docusaurus config runs in Node — do not reference `window` / `document` or browser-only APIs at top-level of config or sidebars.
- Client-only browser APIs (localStorage, navigator.clipboard) must be used in client-side effects (`useEffect`) or guarded with `typeof window !== 'undefined'` to avoid SSG build errors.
- Docs folder indexing: prefer a single `index.md` or `index.mdx` per folder — having both can create duplicate sidebar entries. `sidebars.js` contains extra deduplication logic but prefer one canonical index file.
- Tech doc links: the project maps certain technology names to docs slugs (see `src/components/Portfolio/index.js` `TECH_SLUGS`) — when adding tech pages, add corresponding slugs to avoid broken-link checks.

Caching and runtime patterns
- The `Repositories` component uses client-side GitHub API requests with an in-browser cache (localStorage) and TTL to avoid hitting unauthenticated rate limits. Look for cache keys like `mona_repos_cache_v1` and persisted preferences like `mona_repos_source`.
- When adding features that fetch external APIs, implement caching and graceful fallback for CI/build environments.

Developer workflows & validation
- Local development: `yarn start` (dev server, port 3000 by default).
- Production validation: `yarn build` then `yarn serve` to preview the static output.
- Troubleshooting common build errors:
	- `localStorage is not defined` during `yarn build` — caused by reading browser APIs during SSR. Move access into `useEffect` or guard with `typeof window !== 'undefined'`.
	- Duplicate sidebar entries — check for both `index.md` and `index.mdx` in the same folder.
	- Broken link checks — update `TECH_SLUGS` or create the missing docs pages.

Testing
- There are no automated unit tests in this repo by default. Quick validation is done by building (`yarn build`) and visually inspecting `build/` or running `yarn serve`.

Making changes
- To add a new doc: create `docs/<section>/your-doc.md` or `.mdx`. Use `_category_.json` when you need a custom label/description.
- To add a homepage component, edit or add files under `src/components/` and import them from `src/pages/index.js` or from MDX files.
- For visual changes, build and preview the production output and include screenshots in PRs when helpful.

Contact / ownership
- Project owner/maintainer: Marcelo (GitHub: `marcelo-m7`). For quick questions, open an issue or a PR with the proposed change.

If you'd like, I can add repository-specific checklists (pre-merge build steps, code owners) or an example Playwright script to capture UI screenshots during PR validation.

---
This README is generated from repository conventions and recent code patterns. If anything above is outdated or you want more detail for a section (build matrix, CI, or developer scripts), tell me which area to expand and I'll update it.
