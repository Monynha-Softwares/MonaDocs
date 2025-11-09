# Monynha.com

## Overview

Monynha.com is the institutional website presenting Monynha Softwares' services, portfolio, and culture. It supports lead generation, recruiting, and brand positioning.

## Strategic goals

- Highlight core service lines (custom software, AI solutions, digital strategy) with case studies and metrics.
- Provide a clear call-to-action for consultations, with integration to the sales CRM.
- Share company culture, hiring needs, and benefits for prospective teammates.
- Host multilingual content (Portuguese and English) to support international expansion.

## Information architecture

1. **Home** – Value proposition, marquee projects, testimonials.
2. **Services** – Detailed explanation of offerings with process outlines.
3. **Industries** – Sector-specific stories and success indicators.
4. **Resources** – Blog, whitepapers, and event recordings.
5. **Company** – About, team, careers, contact.

## Content guidelines

- Maintain inclusive, gender-neutral language in both PT and EN.
- Reference quantifiable outcomes (KPIs, timelines) when describing case studies.
- Provide alt text for every media asset and transcriptions for embedded videos.
- Use structured data (Organisation, Breadcrumb, Article) for SEO performance.

## Technical implementation

- **Framework**: Next.js with incremental static regeneration for marketing pages.
- **CMS**: Content managed via MDX files stored in the repository; integrate with Notion exports where relevant.
- **Styling**: Shared design system components from `packages/ui` with dark/light theme support.
- **Analytics**: Plausible + server-side events forwarded to the CRM.

## Operations

- Deployments occur through GitHub Actions -> Vercel after automated accessibility and performance checks.
- Localisation files live under `apps/web/i18n`; update both PT and EN namespaces in each pull request.
- Maintain the newsroom/newsletter archive and archive deprecated campaigns in `/legacy`.

## Roadmap

| Initiative | Description | Status |
| --- | --- | --- |
| Case study refresh | Expand portfolio with interactive storytelling components. | In progress |
| Career portal | Integrate greenhouse-style candidate portal with ATS sync. | Planned |
| Accessibility sweep | Quarterly audits with screen reader testing reports. | Recurring |

## Contribution checklist

1. Coordinate with marketing for copy approvals and legal disclaimers.
2. Include Lighthouse, axe, and performance budgets when submitting UI changes.
3. Update translations and run `npm run build` locally before requesting review.
4. Attach visual diffs or screenshots showing PT and EN variants.
