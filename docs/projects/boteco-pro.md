---
title: Boteco Pro
sidebar_position: 5
slug: /projects/boteco-pro
---

# Boteco Pro

## Project snapshot

- **Product type**: Hospitality management platform for bars and restaurants.
- **Status**: Beta pilots in Lisbon and Porto.
- **Source repository**: [`Monynha-Softwares/Boteco-Pro`](https://github.com/Monynha-Softwares/Boteco-Pro)
- **Primary platforms**: Flutter mobile app + web back office.

## Value proposition

Boteco Pro unifies point-of-sale, reservations, and loyalty operations for independent bars. The goal is to replace fragmented spreadsheets and analogue workflows with a single, inclusive toolset that scales with the business.

## Core modules

| Module | Description | Notes |
| --- | --- | --- |
| **Point of Sale** | Table service, bar tabs, split bills, offline mode | Integrates SumUp terminals; supports tipping rules |
| **Inventory** | Stock levels, supplier catalogues, wastage tracking | Auto alerts when items fall below par level |
| **Reservations** | Seating layout, online booking, waitlist | Syncs with Google Business Profiles |
| **Loyalty** | Stamp cards, birthday rewards, push notifications | GDPR-compliant opt-in flows |
| **Analytics** | Sales dashboards, staff performance, waste reports | Export to CSV/PDF with PT/EN labels |

## Architecture overview

- **Frontend**: Flutter app sharing codebase for Android/iOS + responsive web admin.
- **Backend**: Convex functions for real-time sync; Supabase Postgres for persistence.
- **Integrations**: SumUp, Glovo POS, WhatsApp Business API for reservation confirmations.
- **Infra**: Containerized workers on Coolify handle nightly backups and invoice generation.
- **Telemetry**: OpenTelemetry traces piped to Grafana Cloud; crash reporting via Sentry.

## Deployment workflow

1. Feature branches → GitHub Actions CI (tests, lint, Flutter analyze).
2. Merge to `develop` → staged build distributed with Firebase App Distribution.
3. Promotion to `main` triggers production release and documentation sync in MonaDocs via automation script.

## Accessibility commitments

- Interfaces follow WCAG 2.1 AA; contrast validated each release.
- Cashier flows optimized for one-handed use and large touch targets.
- Voice-over labels on key POS actions; numeric keypad includes haptic feedback guidance.

## Roadmap

- **June 2025**: Launch kitchen display system (KDS) companion app.
- **September 2025**: Add integration with Portuguese fiscal printers.
- **December 2025**: Release multi-location analytics and franchise billing.

## Implementation checklist

- Update translation files (`lib/l10n/`) when adding copy.
- Provide E2E tests for new flows using `integration_test/` harness.
- Document migrations under `docs/technical/` in the product repo.

## Stakeholders

- Product lead: Ana Costa (`@ana.costa`)
- Engineering lead: Marcelo Moraes (`@marcelo-m7`)
- Design lead: João Pedro (`@joaopedro.design`)
