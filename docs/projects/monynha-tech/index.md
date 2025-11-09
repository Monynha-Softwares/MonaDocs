# MonynhaTech

## Overview

MonynhaTech is a public-facing knowledge hub showcasing Monynha Softwares' open-source initiatives, developer tooling, and community events. It aggregates documentation, tutorials, and sandbox projects.

## Goals

- Provide clear entry points for developers exploring Monynha ecosystems.
- Promote open-source repositories, starter kits, and API references.
- Host community events, workshops, and recordings.
- Encourage contributions by documenting governance and support channels.

## Key modules

1. **Resource library** – Tutorials, quickstarts, and code samples with filters by technology.
2. **Event hub** – Calendar of meetups, livestreams, and hackathons with registration links.
3. **Showcase gallery** – Highlights of partner and community projects built with Monynha tooling.
4. **Support centre** – Office hours, Slack/Discord invites, and escalation paths.

## Technical architecture

- **Frontend**: Next.js with MDX content sourced from the MonaDocs repository via a content pipeline.
- **Search**: Algolia DocSearch for instant retrieval, configured with bilingual indexes.
- **Auth**: GitHub OAuth to unlock interactive sandboxes and comment features.
- **Analytics**: PostHog for product analytics, with anonymised event tracking.

## Editorial workflow

- Draft content in Notion or Google Docs, then convert to MDX using the shared writing style guide.
- Run automated copy linting (Vale) and accessibility checks before publishing.
- Tag content with metadata for language, topic, and difficulty level.
- Schedule reviews every quarter to retire or refresh outdated tutorials.

## Roadmap

| Initiative | Description | Status |
| --- | --- | --- |
| Interactive playground | Embed StackBlitz-powered sandboxes for API demos. | Development |
| Translation workflow | Automate PT ↔ EN translation sync with Lokalise. | Planned |
| Community badges | Introduce recognition program for contributors. | Discovery |

## Contribution guidelines

- Follow the [Contribution Guide](../../contribution/contributing.md) and submit PRs with preview links.
- Provide both Portuguese and English content; avoid machine-only translations without review.
- Include accessibility acceptance criteria in issues and pull requests.
- Capture analytics impacts (new events, tags) in release notes.
