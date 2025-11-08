## Purpose

This file provides repository-specific guidance to AI coding agents for working effectively on the Docusaurus documentation site in this repository.

## Big Picture

- This project is a Docusaurus v3 site (see `docusaurus.config.js`) using the classic preset. Content is organized into `docs/` (documentation) and `blog/` (posts). React UI components are in `src/`, and static assets are in `static/`.
- Primary responsibilities include running the dev server, authoring docs/blog posts (Markdown/MDX), updating UI components/styles, managing sidebar/category metadata, and building/deploying the site.

## Key Files & Folders

- `package.json`: Contains scripts for development (`start`), production builds (`build`), serving builds (`serve`), and deployment (`deploy`). Node >= 20 is required.
- `docusaurus.config.js`: Global site configuration (e.g., `baseUrl`, `organizationName`, `projectName`, `editUrl`, navbar/footer settings).
- `sidebars.js`: Controls the docs sidebar. Update this file when adding/moving docs or categories.
- `docs/`: Markdown/MDX documentation. Subfolders use `_category_.json` for grouping (e.g., `docs/tutorial-basics/_category_.json`).
- `blog/`: Blog posts (Markdown/MDX) with metadata in `authors.yml` and `tags.yml`.
- `src/components/`: Custom React components (e.g., `HomepageFeatures`, `TechStack`, `Portfolio`).
- `src/css/custom.css`: Global styling. Page-specific styles are in `src/pages`.
- `static/img/` and `docs/**/img/`: Image assets. Use `static/img/` for global assets and relative `./img/...` for doc-specific images.

## Development Commands

1. Install dependencies:

   ```powershell
   yarn
   ```

2. Run the development server (hot reload; default port 3000):

   ```powershell
   yarn start
   ```

3. Build and preview production:

   ```powershell
   yarn build
   yarn serve
   ```

4. Deploy to GitHub Pages:

   ```powershell
   USE_SSH=true; yarn deploy
   # or without SSH
   GIT_USER=<your-username>; yarn deploy
   ```

## Project-Specific Conventions & Patterns

- **Docs Grouping**: Each `docs/` subfolder may include `_category_.json` for grouping. Update `sidebars.js` if moving docs.
- **Images**: Place global images in `static/img/` and per-doc images in `img/` next to the doc file. Reference them via `./img/foo.png` in Markdown.
- **UI Components**: Reusable components are in `src/components/`. Follow existing patterns in `src/css/custom.css` and `src/components/*/styles.module.css`.
- **MDX Usage**: Use MDX for embedding React components in docs/blogs. Examples are in `docs/` and `blog/`.

## Integration Points & External Dependencies

- **Docusaurus Packages**: Check `package.json` for dependencies. Avoid adding heavy runtime-only dependencies unless necessary.
- **Deployment**: GitHub Pages is the default deploy target. Ensure `organizationName` and `projectName` in `docusaurus.config.js` match the repo/org.
- **CI/CD**: No CI configuration exists. If adding CI (e.g., GitHub Actions), ensure Node >= 20 and include `yarn install && yarn build` steps.

## Examples of Common Changes

- **Add a Doc**: Create `docs/<section>/new-doc.md` (or `.mdx`) and update `sidebars.js` or rely on automatic sidebar paths.
- **Add a Blog Post**: Create `blog/YYYY-MM-DD-title.md` with YAML frontmatter (e.g., `title`, `tags`, `authors`). Update `blog/authors.yml` for new authors.
- **Edit Homepage Features**: Modify `src/components/HomepageFeatures/index.js` and `src/components/HomepageFeatures/styles.module.css`. Use `yarn start` to hot-reload.

## Notes & Watch-Outs

- **Node Environment**: Docusaurus config runs in Node.js. Avoid browser-specific code (e.g., `window`, `document`).
- **Version Compatibility**: The repo uses Docusaurus v3 with `future.v4: true`. Test thoroughly before upgrading to v4.
- **Testing**: No automated tests exist. Validate changes locally with `yarn build && yarn serve`.

## Contribution Guidelines

- Make small, testable changes per PR (e.g., add a doc, update a component).
- Include screenshots for visual changes and verify the `build/` output.
- Update `sidebars.js` or `_category_.json` if moving docs between folders.

## Contact / Maintainer Questions

- Confirm `organizationName` and `projectName` in `docusaurus.config.js` before changing deploy settings.
- For CI configuration or GitHub Actions templates, specify the Node version and preferred publish flow.
