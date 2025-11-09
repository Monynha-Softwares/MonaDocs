---
slug: monadocs-2025-refresh
title: MonaDocs 2025 Refresh
date: 2025-05-09
authors:
  - name: MonaDocs Core Team
    title: Documentation Stewards
    url: https://github.com/Monynha-Softwares
    image_url: https://avatars.githubusercontent.com/u/127117172
tags: [documentation, roadmap, accessibility]
---

We just completed the first full content audit of MonaDocs for 2025. The refresh focused on clarity, accessibility, and ensuring every project page reflects the current delivery reality.

<!-- truncate -->

## What changed

- **Project handbooks** now follow a consistent template that highlights mission, architecture, roadmap, and contacts. This makes onboarding faster and reduces Slack pings.
- **Blog** entries move away from Docusaurus samples and provide real release notes, audits, and community updates.
- **Content guidelines** in the repository root explain the expectations for localization, accessibility, and test evidence on every contribution.

## Accessibility-first mindset

Every addition to the documentation is now reviewed against the WCAG AA checklist. We introduced:

- A11y reminders in each project page (touch targets, captions, localization).
- Clear instructions for requesting audits before marketing campaigns go live.
- Monthly automation that runs Axe CLI on the static build and reports issues to the `#docs-accessibility` channel.

## What’s next

- Launch screenshot automation for UI-heavy docs so designers can verify visual quality.
- Expand Portuguese translations across guidelines and contribution docs.
- Publish a quarterly "docs health" report with metrics on outdated pages and broken links.

Have feedback? Open an issue or reach out in `#docs-core`. 💜
