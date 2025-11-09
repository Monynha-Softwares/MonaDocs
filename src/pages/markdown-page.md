---
title: Content Maintenance Playbook
---

# Content Maintenance Playbook

This standalone page documents how we keep MonaDocs accurate between major audits. It is a quick reference for on-call documentation stewards and anyone triaging content issues outside the normal release flow.

## 1. Intake workflow

1. **Capture the request** — Log an issue in the `monadocs` repository using the "Content Update" template. Include context, screenshots, and impact.
2. **Label & prioritize** — Apply `priority:{high|medium|low}` and `area:{projects|guidelines|architecture|blog}` labels.
3. **Assign** — Rotate ownership weekly among the Docs Core team; current steward listed in Slack `#docs-core` channel topic.

## 2. Triage SLA

| Priority | First response | Resolution target | Notes |
| --- | --- | --- | --- |
| High | 4 business hours | 1 business day | Compliance, security, or customer-impacting issues |
| Medium | 1 business day | 3 business days | Typical feature updates, roadmap adjustments |
| Low | 3 business days | 7 business days | Copy tweaks, minor link fixes |

## 3. Update lifecycle

1. Draft changes in a feature branch (`YYYYMMDD/brief-description`).
2. Run `yarn test` and `yarn build` locally; attach outputs to the PR description.
3. Request review from the content owner and at least one subject-matter expert.
4. Merge once all checks pass and the preview site has been spot-checked.

## 4. Quality checklist

- ✅ **Accuracy** — Facts corroborated with source links or internal documentation.
- ✅ **Accessibility** — Alt text for images, descriptive link text, keyboard-friendly demos.
- ✅ **Localization** — Provide PT/EN copy or flag translation follow-up.
- ✅ **Versioning** — Document release numbers and migration steps when relevant.

## 5. Tooling

- **Link checking**: `npm run test -- --filter link-checker` (see `/scripts` directory).
- **Spellcheck**: Vale configuration stored in `.vale.ini` (run manually before large copy updates).
- **Screenshots**: Use the Playwright utility in `scripts/capture-screenshots.mjs` for UI changes.

## 6. Incident handling

When inaccurate documentation causes customer impact, follow the docs incident playbook:

1. Announce incident in `#docs-incidents` (template pinned in channel).
2. Create incident record in Notion → `Docs Incidents` database.
3. Mitigate (hotfix, revert, or temporarily hide affected page).
4. Run a retro within 5 business days; capture action items in the incident record.

## 7. Continuous improvement

- Host a monthly backlog grooming session with each product area.
- Track stale pages via the "Last reviewed" frontmatter property and set reminders at 90-day intervals.
- Encourage contributors to add context on *why* decisions were made, not only *what* changed.

Need help? Reach out in Slack `#docs-core` or open a discussion thread in GitHub.
