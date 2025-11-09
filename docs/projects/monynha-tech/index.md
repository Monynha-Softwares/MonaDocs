---
title: MonynhaTech
sidebar_position: 1
---

# MonynhaTech

## Project snapshot

- **URL**: [monynha.tech](https://monynha.tech)
- **Status**: Public marketing site — continuously updated
- **Owners**: Identity & Growth squad
- **Source repository**: [`Monynha-Softwares/MonynhaTech`](https://github.com/Monynha-Softwares/MonynhaTech)

## Purpose & positioning

MonynhaTech is the flagship marketing destination for Monynha Softwares’ consulting and product studio. The site communicates our inclusive, future-facing approach to building software, showcases portfolio highlights, and drives leads into our discovery flow.

### Core objectives

1. Present the brand story, mission, and differentiators in PT/EN.
2. Highlight flagship case studies, testimonials, and service packages.
3. Provide a frictionless contact path for prospective partners.
4. Support campaign landing pages and SEO experiments without code changes.

## Audience journeys

| Persona | Primary goal | Key content |
| --- | --- | --- |
| **Prospective clients** | Validate expertise and request a proposal | Hero narrative, portfolio carousel, capabilities grid, lead form |
| **Community & press** | Understand social impact and initiatives | Diversity commitments, open-source showcase |
| **Talent** | Assess culture fit and apply | Culture statements, benefits, hiring CTA |

## Experience architecture

- **Design system**: Shares components with `@monynha/ui` to keep branding consistent with product UIs.
- **Page model**: Content-driven sections composed through a headless CMS (Payload) with localized blocks.
- **Internationalization**: Strings stored in CMS with fallback to EN; runtime detection based on browser locale.
- **Analytics**: Privacy-friendly telemetry via Plausible with events for hero CTA, portfolio interactions, and newsletter signup.

## Technical stack

- **Framework**: Next.js 14 with the App Router, React Server Components, and streaming SSR.
- **Styling**: Tailwind CSS + CSS variables for dark/light modes.
- **CMS**: Payload CMS hosted on Monynha Cloud (Coolify) with webhooks for incremental static regeneration.
- **Forms**: Resend transactional email + Supabase table for lead capture.
- **Media**: Images optimized through Next/Image and served from Cloudflare R2.

## Deployment & operations

| Environment | Branch | Hosting | Notes |
| --- | --- | --- | --- |
| Preview | Pull requests | Vercel preview deployments | Automatic accessibility snapshots via Pa11y |
| Staging | `develop` | Coolify (container) | Synced with CMS sandbox |
| Production | `main` | Vercel | Webhooks trigger revalidation on CMS publish |

- **Monitoring**: Vercel analytics + Sentry frontend errors.
- **Performance budget**: `LCP < 2.5s`, `CLS < 0.1`, `TTI < 3.5s` on mid-tier mobile.
- **SEO health**: Weekly Lighthouse report stored in Notion dashboard.

## Content governance

- **Release cadence**: Monthly campaign refresh; ad-hoc updates tied to launches.
- **Review workflow**: Copywriter drafts in CMS → Design sign-off → Engineering QA → Publish via CMS workflow.
- **Asset management**: Figma brand library synchronized with exported WebP assets stored in `static/media/`.

## Roadmap highlights

- **Q2 2025**: Build interactive case-study timelines with scroll-triggered motion.
- **Q3 2025**: Add testimonial slider powered by CMS references.
- **Q4 2025**: Launch PT-BR localization and integrate CRM automation.

## Useful resources

- [Brand guidelines](../../identity/brand-guidelines.md)
- [UI component reference](../../identity/ui-components.md)
- [Accessibility checklist](../../guidelines/accessibility.md)

> ℹ️ Submit new content requests through the "Marketing Updates" Jira board. Include analytics goals and success metrics for approval.
