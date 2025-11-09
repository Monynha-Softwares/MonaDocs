---
title: Monynha.com
sidebar_position: 2
---

# Monynha.com

## Project snapshot

- **URL**: [monynha.com](https://monynha.com)
- **Status**: Production
- **Owners**: Business Operations squad
- **Source repository**: [`Monynha-Softwares/Monynha-com`](https://github.com/Monynha-Softwares/Monynha-com)

## Mission

The institutional site translates Monynha Softwares’ mission — "Technology with pride, diversity, and resistance" — into a business-facing narrative. It explains service verticals, social impact commitments, and provides direct channels for prospecting and partnerships.

### Communication pillars

1. **Inclusive innovation**: Stories about empowering underrepresented communities with technology.
2. **Services catalogue**: Productized offerings (discovery sprints, AI enablement, full-stack delivery).
3. **Social responsibility**: Initiatives such as scholarships, workshops, and community sponsorships.
4. **Contact & conversion**: Persistent CTAs, scheduling widgets, and newsletter signups.

## Information architecture

- **Hero**: Value proposition and CTAs for "Start a project" and "Download capabilities deck".
- **Impact metrics**: Real-time counters for clients served, workshops hosted, and open-source contributions.
- **Services**: Cards per offering with scope, timeline, and indicative pricing.
- **Stories**: Carousel of case studies with quotes and KPI highlights.
- **Footer**: Regional offices, compliance links, and social channels.

## Technical implementation

- **Framework**: Next.js 14 + React Server Components.
- **Styling**: Tailwind CSS layered with custom CSS modules for hero gradients.
- **Content model**: Payload CMS collections (`services`, `caseStudies`, `ctaBlocks`).
- **Data fetching**: Incremental static regeneration with background revalidate after CMS publish.
- **Analytics**: Plausible (GDPR-compliant) with custom goals for CTA clicks.
- **Integrations**: HubSpot form embed for enterprise leads; Calendly for consultations.

## Operations & governance

| Environment | Branch | Hosting | Notes |
| --- | --- | --- | --- |
| Preview | Pull requests | Vercel preview | Auto Lighthouse + Axe checks |
| Staging | `staging` | Coolify | Used for content QA |
| Production | `main` | Vercel | DNS managed via Cloudflare |

- **Incident response**: Follow the `marketing-web` on-call schedule; incidents recorded in Statuspage.
- **Backups**: Nightly CMS backups stored in S3-compatible bucket with 30-day retention.
- **Localization**: PT-PT primary, EN-US secondary; translation tasks tracked in Lokalise.

## Upcoming work

- **July 2025**: Publish sustainability report microsite.
- **September 2025**: Add AI service calculator with dynamic pricing.
- **December 2025**: Launch multi-author blog integrated with Docs.

## Collaboration guidelines

- Submit change requests through the "Institutional Site" Linear queue.
- Include Figma links, copy docs, and success metrics with every ticket.
- Schedule content drops at least 48h in advance to align with social media campaigns.

## Reference material

- [Brand guidelines](../../identity/brand-guidelines.md)
- [UX guidelines](../../guidelines/ux-guidelines.md)
- [Security baseline](../../guidelines/security.md)
