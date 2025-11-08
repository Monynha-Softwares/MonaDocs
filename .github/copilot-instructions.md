## MonaDocs — AI coding agent instructions

This short guide highlights repository-specific facts an AI agent needs to be productive working on the MonaDocs Docusaurus v3 site.

### Quick facts (how to run)
- Node: >= 20 (see `package.json` "engines").
- Install: `yarn`
- Dev server: `yarn start` (Docusaurus hot reload, port 3000)
- Build: `yarn build` → artifacts in `build/`
- Preview: `yarn serve`
- Deploy: `USE_SSH=true; yarn deploy` (Docusaurus GitHub Pages preset)

### Architecture & important files
- Docusaurus config: `docusaurus.config.js` — controls navbar, footer, editUrl (points to `dev` by default), color mode, and presets.
- Docs content: `docs/` — grouped into subfolders (e.g., `projects/`, `technologies/`). Each folder MAY contain `_category_.json` for metadata.
- Sidebar generator: `sidebars.js` — programmatic sidebar produced from top-level folders. If you add a folder, the sidebar is auto-included by `TOP_FOLDERS` order.
- Blog: `blog/` — MD/MDX with YAML frontmatter; authors in `blog/authors.yml`.
- Components/UI: `src/components/*` (examples: `HomepageFeatures`, `Portfolio`, `TechStack`) and global styles in `src/css/custom.css`.
- Static assets: `static/img/` for global images; doc-local images can live in `docs/<section>/img/` and be referenced as `./img/foo.png`.

### Project-specific conventions (do this here)
- Sidebar: Prefer adding `_category_.json` inside a docs subfolder for label/description overrides; `sidebars.js` reads these and generates categories.
- Doc file ids: `sidebars.js` expects `folder/filename` ids (it prefers `index.md`/`index.mdx` for directory indexes).
- Config edits: `docusaurus.config.js` runs in Node — do not reference `window`/DOM. Use `editUrl` when you want "edit this page" links to point to a specific branch (currently `dev`).

### Examples (use these when making changes)
- Add a doc: create `docs/<section>/new-doc.md`, add `_category_.json` if you need a custom label, then ensure `TOP_FOLDERS` in `sidebars.js` includes the folder if you want it surfaced.
- Add a blog post: `blog/YYYY-MM-DD-title.md` with YAML frontmatter: `title`, `tags`, `authors` — add new authors in `blog/authors.yml`.
- Edit homepage features: modify `src/components/HomepageFeatures/index.js` and the corresponding `styles.module.css`, then run `yarn start` to preview.

### Build & validation notes
- No CI is configured in the repo; validate changes locally with `yarn build && yarn serve` and inspect `build/`.
- Tests: package.json provides a `test` script (`node --test scripts`) — check `scripts/` for test files if you need unit-style checks.

### Watch-outs and gotchas
- `sidebars.js` is intentionally dynamic: it expects certain folder structure and will generate indexes. If you need manual ordering beyond what it provides, edit `sidebars.js` directly.
- Docusaurus config is evaluated by Node — avoid client-only code inside `docusaurus.config.js` or `sidebars.js`.
- The `editUrl` in config points at the `dev` branch — update it if your PRs target a different base branch.

If any part of this is incomplete or you'd like more examples (e.g., how components are wired into MDX), tell me which area to expand and I'll iterate.
## MonaDocs AI Coding Agent Instructions

This guide enables AI coding agents to work productively in the MonaDocs Docusaurus v3 documentation site. It summarizes essential architecture, workflows, and conventions unique to this codebase.

### Big Picture Architecture
- **Docusaurus v3 Classic Preset**: Site configuration in `docusaurus.config.js`. Docs in `docs/`, blog in `blog/`, custom React UI in `src/components/`, static assets in `static/`.
- **Docs & Blog Structure**: Docs are grouped by subfolders, each with optional `_category_.json` for sidebar organization. Blog posts use Markdown/MDX with metadata in YAML frontmatter and centralized author/tag files.
- **Sidebar Management**: `sidebars.js` controls sidebar structure. Update this when adding, moving, or regrouping docs.
- **Custom UI**: Reusable React components (e.g., `HomepageFeatures`, `TechStack`, `Portfolio`) live in `src/components/`. Global styles in `src/css/custom.css`; component styles in `src/components/*/styles.module.css`.

### Developer Workflows
- **Install dependencies**: `yarn` (Node >= 20 required)
- **Start dev server**: `yarn start` (hot reload, port 3000)
- **Build production**: `yarn build`
- **Preview build**: `yarn serve`
- **Deploy to GitHub Pages**: `USE_SSH=true; yarn deploy` or `GIT_USER=<username>; yarn deploy`
- **No automated tests**: Validate changes by running `yarn build && yarn serve` and inspecting `build/` output.

### Project-Specific Conventions
- **Docs Grouping**: Use `_category_.json` in each `docs/` subfolder for sidebar grouping. Always update `sidebars.js` if moving docs.
- **Images**: Place global images in `static/img/`. For doc-specific images, use an `img/` folder next to the doc and reference with `./img/foo.png`.
- **MDX Usage**: Embed React components in docs/blogs via MDX. See examples in `docs/` and `blog/`.
- **Blog Metadata**: Blog posts require YAML frontmatter (`title`, `tags`, `authors`). Add new authors to `blog/authors.yml`.

### Integration Points & External Dependencies
- **Docusaurus Packages**: See `package.json` for dependencies. Avoid adding large runtime dependencies unless justified.
- **Deployment**: Default is GitHub Pages. Ensure `organizationName` and `projectName` in `docusaurus.config.js` match the repo.
- **CI/CD**: No CI present. If adding, use Node >= 20 and include `yarn install && yarn build`.

### Examples of Common Changes
- **Add a Doc**: Create `docs/<section>/new-doc.md` or `.mdx`. Update `sidebars.js` for sidebar changes.
- **Add a Blog Post**: Create `blog/YYYY-MM-DD-title.md` with YAML frontmatter. Update `blog/authors.yml` for new authors.
- **Edit Homepage Features**: Change `src/components/HomepageFeatures/index.js` and `styles.module.css`. Use `yarn start` for hot reload.

### Watch-Outs & Gotchas
- **Node Environment**: Docusaurus config runs in Node.js. Avoid browser-only code (`window`, `document`).
- **Version Compatibility**: Uses Docusaurus v3 with `future.v4: true`. Test thoroughly before upgrading.
- **Sidebar/Category Sync**: Always sync changes between `_category_.json` and `sidebars.js`.

### Contribution Guidelines
- Make small, testable changes per PR (e.g., add a doc, update a component).
- For visual changes, verify output in `build/` and include screenshots if possible.
- Update `sidebars.js` or `_category_.json` when moving docs.

---
If any section is unclear or missing, please provide feedback so this guide can be improved for future AI agents.
