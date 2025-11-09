# ArtLeo Creative Spaces

## Overview

ArtLeo Creative Spaces is a digital platform under active discovery. It aims to connect independent artists with venues that host exhibitions, workshops, and creative residencies. The documentation below captures the current understanding of scope and technical direction so contributors can collaborate consistently.

## Target users

- Visual artists and makers who need a professional showcase and booking calendar.
- Venue managers responsible for programming art events.
- Curators looking for curated collections and available time slots.

## Product pillars

1. **Portfolio publishing** – Responsive galleries, media kits, and artist bios optimised for search engines.
2. **Space discovery** – Location-aware search with filters for availability, amenities, and equipment.
3. **Booking workflow** – End-to-end request, approval, and contract management with notifications.
4. **Community insights** – Dashboards showing attendance, sales, and engagement metrics.

## Reference technology stack

The stack will continue to evolve; align with the tech lead before introducing alternatives.

- **Frontend**: Next.js + TypeScript with Tailwind CSS for rapid UI development.
- **Backend**: Supabase (PostgreSQL + Auth) providing database, storage, and row-level security.
- **Integrations**: Stripe for payments, Mapbox for geolocation, Resend for transactional email.
- **Infrastructure**: Vercel preview/production environments orchestrated by GitHub Actions workflows.

## Delivery workflow

- **Branching**: `main` (production), `develop` (staging), feature branches per issue.
- **CI/CD**: Automated linting, testing, and preview deployments on pull requests.
- **Monitoring**: Vercel Analytics, Supabase logs, and Sentry for runtime errors.
- **Environments**: Shared staging database seeded weekly; production backups nightly.

## Roadmap highlights

| Milestone | Focus | ETA |
| --- | --- | --- |
| Artist onboarding UX | Simplify signup, add progressive profile completion | 2025-Q1 |
| Venue CRM tooling | Improve lead tracking, add automated follow-ups | 2025-Q2 |
| Marketplace launch | Public discovery experience with SEO landing pages | 2025-Q3 |

## How to contribute

1. Check the open issues labelled `help wanted` in the repository.
2. Discuss major UX or architectural changes with the product owner before implementation.
3. Follow the shared [code conventions](../../guidelines/code-conventions.md) and include accessibility acceptance criteria in every PR.
4. Provide screenshots or Loom videos for UI updates and ensure English/Portuguese copy parity.
