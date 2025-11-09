---
title: "Boteco Pro"
sidebar_position: 1
---

# Boteco Pro

## Overview

Boteco Pro is Monynha Softwares' flagship hospitality management platform. It consolidates point-of-sale, inventory, reservations, and loyalty experiences into a single suite tailored for bars and restaurants in Portugal and beyond.

## Customer outcomes

- Reduce manual reconciliation by synchronising sales, stock, and accounting data.
- Increase table turnover with smart reservations, waitlist management, and QR ordering.
- Grow repeat business through integrated loyalty programs and segmented campaigns.

## Product modules

1. **Point of Sale** – Multi-terminal POS with offline mode, receipt customisation, and tipping.
2. **Inventory & Procurement** – Supplier catalogues, purchase orders, and automated stock alerts.
3. **Reservations & Floor Management** – Table layouts, pacing controls, and guest communications.
4. **Loyalty & Marketing** – Tiered rewards, email/SMS campaigns, and customer analytics dashboards.
5. **Insights** – Real-time KPI cockpit covering revenue, labour costs, and menu performance.

## Technology landscape

- **Mobile**: Flutter app for in-venue operations and tablet ordering.
- **Backend**: Convex for realtime data synchronisation, complemented by serverless functions for heavy processing.
- **Integrations**: Fiscal printers, payment gateways, delivery platforms, and accounting tools (TIC, Sage, Xero).
- **Infrastructure**: Containerised services orchestrated via Coolify with GitHub Actions CI/CD.

## Deployment model

- Tenants are provisioned per venue with region-aware configurations (currency, tax rules).
- Multi-environment setup: `production`, `staging`, `sandbox` for demos.
- Automated backups and migration scripts maintained in the `infra/` directory of the main repository.

## Roadmap

| Milestone | Description | Status |
| --- | --- | --- |
| Analytics v1.1 | Expand dashboards with labour cost tracking and anomaly detection. | In QA |
| Loyalty 2.0 | Introduce card-linked offers and partner marketplace integrations. | Development |
| Delivery Hub | Unified view for delivery platforms (Uber Eats, Glovo, Bolt Food). | Discovery |

## Contribution workflow

1. Review open issues labelled `feature`, `bug`, or `research` before picking up work.
2. Ensure database migrations include backward-compatibility notes.
3. Add end-to-end tests for mission-critical flows (orders, reservations, loyalty redemption).
4. Provide bilingual release notes (PT/EN) summarising changes for venue managers.
