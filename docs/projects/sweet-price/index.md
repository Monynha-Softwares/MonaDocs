# Sweet Price

## Overview

Sweet Price is a mobile and web application that helps shoppers in Portugal compare supermarket prices in real time. The product targets budget-conscious households and small businesses that need to optimise purchases across multiple retailers.

## Problem statement

- Supermarket prices vary significantly between regions and loyalty programs.
- Shoppers lack transparent insights into promotions, bundles, and substitutions.
- Manual price tracking is time consuming and quickly outdated.

## Product capabilities

1. **Price comparison engine** – Aggregates offers from Pingo Doce, Continente, and other retailers via public APIs and scraping pipelines.
2. **Shopping lists** – Users create lists, set budgets, and receive store-specific totals.
3. **Alerts** – Notify shoppers when favourite items drop below threshold prices.
4. **Insights dashboard** – Visualise savings, seasonal trends, and substitution recommendations.

## Technology stack

- **Mobile**: React Native app targeting iOS and Android, sharing UI components with the web client.
- **Web**: Next.js frontend for desktop users and admin tooling.
- **Backend**: Node.js + Convex for realtime data sync and background jobs.
- **Data ingestion**: Scheduled scrapers running on GitHub Actions with fallback manual upload scripts.
- **Storage**: PostgreSQL for transactional data, Redis for caching, Supabase storage for media.

## Data governance

- Respect retailer terms of service; review legal guidance before adding new data sources.
- Store only aggregated price data—avoid personal information beyond hashed user IDs.
- Anonymise analytics and comply with GDPR consent requirements for tracking.

## Roadmap

| Initiative | Description | Status |
| --- | --- | --- |
| Loyalty program integration | Import Pingo Doce & Continente loyalty card data for personalised pricing. | Development |
| Receipt scanner | OCR-based feature to ingest receipts and enrich price database. | Discovery |
| Meal planning | Suggest weekly menus aligned with user budgets and preferences. | Planned |

## Contribution guidelines

- Keep scraping scripts idempotent and resilient to layout changes; add unit tests for parsers.
- Provide PT and EN copy for notifications and UI labels.
- Share performance benchmarks when touching the comparison algorithms.
- Document any new environment variables in `.env.example` and update infrastructure diagrams if relevant.
