# Monynha Online

## Overview

Monynha Online provides a lightweight, customisable landing page template used for product previews, campaigns, and microsites. It acts as the default fallback experience when a dedicated site is not yet available.

## Use cases

- Rapid launch pages for beta waitlists or feature previews.
- Temporary redirects during migration projects.
- Campaign-specific microsites with tailored messaging and tracking.

## Customisation options

- Configurable hero sections, feature highlights, and pricing blocks defined through JSON/MDX data files.
- Theme tokens (colours, typography, spacing) aligned with the design system.
- Optional language switcher and locale-aware routing.
- Integrations for newsletter signup (Mailchimp), contact forms (HubSpot), and analytics (Plausible).

## Technical overview

- **Framework**: Next.js with static generation for base pages and API routes for form submissions.
- **Styling**: Tailwind CSS + Radix UI primitives to ensure accessibility.
- **Content**: MDX-powered sections under `content/` plus localisation files in `i18n/`.
- **Deployment**: Vercel previews per branch, production pipeline gated by accessibility checks.

## Operations

- Use environment-specific `.env` files to configure API keys—never commit secrets; update `.env.example` when adding new variables.
- Maintain variant configurations in `config/sites/*.ts`; each file represents one microsite.
- Document site-specific assets (logos, illustrations) in the repository README.

## Roadmap

| Initiative | Description | Status |
| --- | --- | --- |
| Theme presets | Bundle reusable presets for fintech, SaaS, and education launches. | In progress |
| Component library sync | Automate dependency updates with the shared UI package. | Planned |
| No-code bridge | Provide Airtable/Notion sync to populate content dynamically. | Discovery |

## Contribution notes

1. Validate that Lighthouse scores stay above 90 for Performance, Accessibility, and Best Practices.
2. Supply Portuguese and English content for every page variant.
3. Capture screenshots for each viewport breakpoint when updating layout components.
4. Coordinate DNS or redirect changes with the DevOps team before launch.
