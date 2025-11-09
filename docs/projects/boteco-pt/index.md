---
title: Boteco.pt
sidebar_position: 6
---

# Boteco.pt

## Project snapshot

- **URL**: [boteco.pt](https://boteco.pt)
- **Status**: Production marketing site that funnels leads to Boteco Pro.
- **Source repository**: [`Monynha-Softwares/boteco.pt`](https://github.com/Monynha-Softwares/boteco.pt)

## Purpose

Boteco.pt is the public-facing layer for the Boteco ecosystem. It describes the hospitality platform, collects demo requests, and publishes educational content for restaurant owners.

### Audience segments

- **Independent bar owners** looking for operations support.
- **Restaurant chains** evaluating multi-location management.
- **Potential partners** (POS hardware, delivery platforms).

## Content structure

1. **Hero & value prop** — Portuguese + English copy, contact CTA, highlight video.
2. **Feature deep dives** — Explains POS, inventory, loyalty, reservations with cross-links to Boteco Pro docs.
3. **Testimonials** — Quote carousel with venue photos.
4. **Pricing tiers** — Comparative table (Starter, Growth, Enterprise) with add-ons.
5. **Knowledge base** — Links to guides, webinars, and case studies.
6. **Contact** — Embedded Calendly scheduler and WhatsApp contact button.

## Technical implementation

- Built with Next.js static export to ensure fast, cacheable pages.
- Content managed via Payload CMS `marketingSite` collection shared with Boteco Pro team.
- Uses shared design tokens from `@monynha/ui` with hospitality-specific imagery.
- Integrates Crisp chat widget; ensure transcripts stored securely in Supabase.
- Cookie consent banner configured with Cookiebot (PT/EN strings).

## Operations

| Environment | Hosting | Notes |
| --- | --- | --- |
| Preview | Vercel preview deployments | auto-created on PR |
| Production | Vercel | Revalidated via CMS webhook |

- Weekly SEO report captured via Ahrefs; assign tasks to marketing backlog.
- Accessibility spot-check after each campaign update using Axe DevTools.

## Content workflow

- Submit updates through "Boteco Marketing" Jira queue.
- Provide both PT and EN copy; translations reviewed by localization partner.
- Image assets must include descriptive alt text and photographer credits.

## Related documentation

- [Boteco Pro](../boteco-pro.md)
- [Accessibility guidelines](../../guidelines/accessibility.md)
- [Brand guidelines](../../identity/brand-guidelines.md)
