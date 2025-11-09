---
title: ArtLeo Creative Spaces
sidebar_position: 3
---

# ArtLeo Creative Spaces

## Project snapshot

- **URL**: [artleo.creative.monynha.com](https://artleo.creative.monynha.com) *(internal preview)*
- **Status**: Alpha — curated showroom for the ArtLeo collective
- **Owners**: Culture Lab
- **Source repository**: [`Monynha-Softwares/artleo-creative-spaces`](https://github.com/Monynha-Softwares/artleo-creative-spaces)

## Vision

ArtLeo celebrates LGBTQIA+ artists through immersive, digital-first galleries. The experience blends editorial storytelling with interactive installations to promote artists, sell limited editions, and book workshops.

### Experience goals

- Feature rotating exhibitions with bilingual copy and audio descriptions.
- Allow artists to manage their own collections, pricing, and availability.
- Integrate donation flows supporting community partners.
- Provide accessible navigation, including keyboard-driven gallery tours.

## Product architecture

| Layer | Technology | Notes |
| --- | --- | --- |
| Frontend | Next.js 14, React Three Fiber | Supports 3D gallery walkthroughs with graceful fallback to static images |
| Design system | `@monynha/ui` + bespoke ArtLeo theming | High contrast palette, adjustable type scale |
| CMS | Payload CMS (`exhibitions`, `artists`, `events`) | Artists access via scoped roles |
| Commerce | Stripe Checkout + webhook to Supabase | Handles art sales and workshop tickets |
| Data | Supabase (PostgreSQL) | Stores artist bios, inventory, donation receipts |

## Accessibility & inclusion

- All artwork images require alternative text and long descriptions.
- Captions + transcripts mandatory for video installations.
- Gallery controls expose ARIA labels and support joystick navigation for installations.
- Color contrast tested for both dark and light themes; results logged in the accessibility tracker.

## Deployment workflow

1. Pull requests deploy to Vercel previews with Chromatic visual regression tests.
2. Merges to `develop` promote to staging (Coolify) for content QA.
3. Publishing a new exhibition triggers a GitHub Action to revalidate static paths and purge CDN caches.

## Roadmap

- **June 2025**: Launch curator dashboard for scheduling exhibitions.
- **August 2025**: Add spatial audio guide powered by ElevenLabs TTS.
- **November 2025**: Public opening with marketing campaign + artist referral program.

## Contribution checklist

- Sync with the Culture Lab curator for copy approvals.
- Provide PT/EN versions for exhibition names and descriptions.
- Validate 3D scenes with `yarn test --scene` (custom script) prior to merging.

## Resources

- Figma: *ArtLeo Creative Spaces — Design System*
- Notion: *ArtLeo Delivery Roadmap*
- Slack: `#artleo-creatives`
