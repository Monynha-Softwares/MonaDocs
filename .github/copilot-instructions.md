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
