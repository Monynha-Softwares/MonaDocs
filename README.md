# MonaDocs

MonaDocs is the living knowledge base for **Monynha Softwares**. It centralizes product documentation, brand guidelines, engineering standards, and change logs so that teams and partners can quickly understand how we build, ship, and support software.

## ✨ Highlights

- **Unified knowledge** — Projects, technologies, and contribution processes live in one curated portal.
- **Accessible by default** — Content follows WCAG AA, supports PT/EN localization, and documents accessibility requirements for every product.
- **Versioned & auditable** — Updates are tracked through Git history and release notes so stakeholders can trust what changed.
- **Docusaurus-powered** — Built with [Docusaurus 3](https://docusaurus.io/) for fast authoring, MDX support, and React extensibility.

## 🛠️ Prerequisites

- **Node.js** `>= 20`
- **Yarn** (preferred) or npm/pnpm
- Optional: `nvm` for managing Node versions and `direnv` to load local environment variables.

## 🚀 Quick start

Clone the repository and install dependencies:

```bash
# install dependencies
yarn install

# start local dev server
yarn start
```

The development server opens at `http://localhost:3000` with hot reload enabled. Edit Markdown/MDX files in `docs/` or React components in `src/` and the page refreshes automatically.

### Alternative package managers

```bash
# using npm
npm install
npm run start

# using pnpm
pnpm install
pnpm run start
```

## 📦 Project scripts

| Command | Description |
| --- | --- |
| `yarn start` | Run local development server with hot reload. |
| `yarn build` | Produce a production-ready static build in `build/`. |
| `yarn serve` | Preview the production build locally. |
| `yarn clear` | Clear generated caches and artifacts. |
| `yarn test` | Execute the repository test suite under Node’s built-in test runner. |
| `yarn write-translations` | Extract translation strings for localization workflows. |

## 📚 Repository structure

```text
.
├── blog/                 # Long-form articles, release notes, community updates
├── docs/                 # Main documentation content grouped by topic
│   ├── architecture/     # System design, CI/CD, infrastructure
│   ├── contribution/     # Governance and contributor guides
│   ├── guidelines/       # Coding, UX, security, accessibility standards
│   ├── identity/         # Brand and UI design resources
│   ├── projects/         # Product handbooks and delivery notes
│   └── technologies/     # Stack-specific implementation guides
├── reports/              # Internal audits and research summaries
├── scripts/              # Automation and build utilities
├── src/                  # Custom Docusaurus components, pages, and styling
├── static/               # Static assets served as-is
└── sidebars.js           # Sidebar configuration for the docs
```

## ✍️ Content guidelines

1. **Keep it actionable** — Every page should state the goal, current status, owners, and next steps.
2. **Document decisions** — Capture architectural choices, trade-offs, and links to supporting evidence.
3. **Reference sources** — Link to repositories, designs, analytics dashboards, or external specs where relevant.
4. **Respect localization** — When adding new UI or copy, provide both PT and EN strings or flag the translation need.
5. **Accessibility first** — Follow the guidance in `docs/guidelines/accessibility.md` for all screenshots and UI references.

## 🤝 Contributing

1. Create a branch following the agreed convention (`YYYYMMDD/brief-description`).
2. Write commits using [Conventional Commits](https://www.conventionalcommits.org/).
3. Update or add tests whenever you change behavior. Run `yarn test` and applicable linters before pushing.
4. Open a pull request with:
   - Scope summary and motivation
   - Test evidence (commands + results)
   - Breaking-change callouts or migration notes if applicable
5. Request at least one reviewer and ensure all checks pass.

See the detailed guide in [`docs/contribution/contributing.md`](docs/contribution/contributing.md).

## 🧪 Validation checklist

Before merging, confirm:

- [ ] Static build (`yarn build`) succeeds without warnings.
- [ ] Tests (`yarn test`) pass locally.
- [ ] New/updated content renders correctly in the browser.
- [ ] Links, images, and embeds resolve.

## 📬 Support

- **Issues & requests**: open a ticket in the appropriate repository.
- **Design & brand questions**: contact the Identity team via `design@monynha.com`.
- **Operational incidents**: escalate through the on-call rotation documented in the architecture section.

Happy documenting! 💜
