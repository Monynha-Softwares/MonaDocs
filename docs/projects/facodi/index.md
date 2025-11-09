---
title: FACODI
sidebar_position: 7
---

# FACODI — Faculdade Comunitária Digital

## Project snapshot

- **URL**: [facodi.pt](https://facodi.pt)
- **Status**: Discovery/early build
- **Source repository**: [`Monynha-Softwares/facodi.pt`](https://github.com/Monynha-Softwares/facodi.pt)

## Mission

FACODI (Faculdade Comunitária Digital) offers accessible, community-driven technology education. The platform mixes self-paced learning, live workshops, and mentorship for marginalized groups pursuing tech careers.

## Product pillars

1. **Learning journeys** — Role-based curricula (Front-end, Data, Product) with adaptive assessments.
2. **Community spaces** — Moderated forums, peer groups, and event calendars.
3. **Mentorship** — Booking system pairing learners with volunteer mentors.
4. **Career services** — Portfolio reviews, job boards, and internship placements.

## Architecture overview

- **Frontend**: Next.js 14 + React Server Components, localized content with i18next.
- **Backend**: Python FastAPI service for course management, running on Coolify containers.
- **Data**: PostgreSQL (Supabase) for structured content; ElasticSearch for course search.
- **Media**: Video hosting via Mux with captioning pipeline; transcripts stored in Supabase storage.
- **Auth**: Supabase Auth with social login, MFA optional for mentors/admins.

## Accessibility commitments

- All video content requires human-reviewed captions and downloadable transcripts.
- Interface supports high-contrast toggle and dyslexia-friendly font option.
- Keyboard-first navigation validated before each release; screen-reader smoke tests executed via Playwright + Axe.

## Deployment pipeline

| Stage | Branch | Actions |
| --- | --- | --- |
| Preview | feature branches | GitHub Actions → Vercel preview + unit tests |
| Staging | `develop` | Deploy to Coolify staging cluster; run integration tests |
| Production | `main` | Blue/green deploy with database migrations via Alembic |

## Roadmap

- **June 2025**: Launch beta with 50 learners and mentorship scheduling.
- **September 2025**: Release scholarship management module.
- **January 2026**: Publish impact report with open data exports.

## Contribution guidelines

- Align with the Curriculum team before altering learning paths.
- Add fixtures for new content types and update OpenAPI schema docs.
- Run `make test` in the backend repo plus `yarn test` for the frontend package.

## Resources

- Notion workspace: *FACODI Product Hub*
- Slack: `#facodi-core`
- Email: `facodi@monynha.com`
