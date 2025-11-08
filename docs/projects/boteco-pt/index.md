# Boteco.pt

## Overview

Boteco.pt is the Portuguese marketing site for the Boteco hospitality platform. It communicates product value, captures inbound leads, and provides support resources for bar and restaurant owners evaluating Boteco Pro.

## Objectives

- Present core modules—POS, inventory, loyalty, and analytics—in Portuguese with local pricing.
- Drive demo requests via integrated CRM forms and calendaring links.
- Highlight testimonials, partner integrations, and regulatory compliance updates.
- Offer downloadable brochures, FAQs, and help-centre entry points.

## Audience

- Owners and managers of bars, cafés, and small restaurant chains.
- Franchise operators comparing management software.
- Channel partners and resellers seeking co-marketing assets.

## Content & UX guidelines

- Provide parity between Portuguese and English copy, prioritising accessibility (WCAG AA) and inclusive language.
- Include structured data for product, FAQ, and local business to improve SEO visibility.
- Optimise for Core Web Vitals—especially Largest Contentful Paint and Cumulative Layout Shift.
- Ensure forms support keyboard navigation and screen readers; validate inputs with clear error messaging.

## Technical implementation

- **Framework**: Next.js with static generation for marketing pages and server-side rendering for dynamic lead forms.
- **Styling**: Tailwind CSS + custom design tokens defined in `packages/ui`.
- **Integrations**: HubSpot (lead capture), Resend (transactional email), Google Tag Manager (analytics consent).
- **Hosting**: Vercel production + preview deployments from pull requests.

## Operations

- Content updates are managed through MDX sections; keep components localised under `apps/web/content`.
- For campaign-specific pages, create new routes under `/campanhas` with analytics tagging.
- Use the shared [UX Guidelines](../../guidelines/ux-guidelines.md) for motion, colour contrast, and iconography.

## Roadmap

| Initiative | Description | Status |
| --- | --- | --- |
| Case study hub | Publish success stories for Portuguese venues with video embeds. | In progress |
| Pricing calculator | Interactive ROI calculator tailored to venue size and modules. | Planned |
| Knowledge centre | Integrate support articles sourced from Freshdesk. | Planned |

## Contribution checklist

1. Review open issues tagged `website` in the main repository.
2. Coordinate with marketing for copy approval before merging changes.
3. Attach Lighthouse and axe accessibility reports to pull requests touching UI.
4. Provide localisation keys and translations for any new text strings.
