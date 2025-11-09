---
title: Monynha Online
sidebar_position: 8
---

# Monynha Online

## Project snapshot

- **URL**: [monynha.online](https://monynha.online)
- **Status**: Always-on landing page for campaigns and link-in-bio experiences.
- **Source repository**: [`Monynha-Softwares/MonynhaOnline-Default-Page`](https://github.com/Monynha-Softwares/MonynhaOnline-Default-Page)

## Purpose

Monynha Online acts as the universal entry point for all Monynha initiatives. It is designed for quick iteration, enabling marketing to spin up curated collections of links, announcements, and events without engineering support.

## Key features

- **Dynamic sections** — Modular blocks (hero, featured project, CTA buttons, event list) controlled via JSON configuration.
- **Theming** — Supports seasonal themes and Pride palette toggles while remaining accessible.
- **Localization** — Copy strings defined for PT, EN, and ES; fallback to PT.
- **Integrations** — Link tracking via Bitly, newsletter subscription via Resend.
- **Performance** — Ships as static HTML/CSS/JS bundle under 75 KB gzipped.

## Content operations

- Marketing updates content via `content/schema.json`. Changes trigger GitHub Action to validate schema and deploy.
- All external links require `rel="noopener"` and UTM parameters defined in `config/utm.yml`.
- Accessibility QA performed monthly with Axe CLI and manual screen-reader review.

## Technical stack

- **Framework**: Vanilla Vite + React 18 with static site generation.
- **Styling**: Tailwind CSS with CSS variables for theming.
- **Hosting**: Cloudflare Pages with automatic deploy previews per PR.
- **Monitoring**: Cloudflare Analytics + UptimeRobot checks every 2 minutes.

## Roadmap

- **June 2025**: Add event countdown timer component.
- **August 2025**: Introduce theme scheduling (e.g., Pride month auto-activation).
- **November 2025**: Localize to PT-BR with copy review by Localization guild.

## Contribution tips

- Keep hero copy under 120 characters for mobile readability.
- Supply SVG icons with accessible titles and fallback text.
- Update `README` in the project repo with deployment notes when new modules ship.

## Related links

- [Brand guidelines](../../identity/brand-guidelines.md)
- [UX guidelines](../../guidelines/ux-guidelines.md)
- [Accessibility checklist](../../guidelines/accessibility.md)
