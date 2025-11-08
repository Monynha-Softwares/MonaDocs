---
title: Convex — Advanced Guide
---

# Convex — Advanced Guide

This guide provides step-by-step advanced patterns for developing, testing, and deploying Convex-backed applications. It complements the reference material in `index.md` with examples and recipes.

## Local development workflow

- Start a local Convex dev server:

```bash
convex dev
```

- Seed a small dataset using a script to speed iterative testing:

```js
// scripts/seed.js
import { ConvexHttpClient } from "convex/client";
const client = new ConvexHttpClient(process.env.CONVEX_URL);
await client.mutation("seeds/createSampleData", { count: 50 });
```

## Recommended project layout

- `src/functions/` - server functions and triggers
- `src/collections/` - data model and index declarations
- `src/client/` - client wrappers and helpers

## CI integration (example)

- Run `convex deploy` to a staging project on successful build, then run smoke tests against the staging URL.

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Convex CLI
        run: npm install -g convex
      - name: Deploy to Convex (staging)
        run: convex deploy --project staging --message "CI deploy"
```

## Indexing recipe

- Add indexes for common query filters and sort orders; measure query plans for hot paths.

## Migration and data export

- Use Convex export utilities or periodic snapshots to external storage for backups and migration.

## Troubleshooting

- Logs: use `convex logs` or the dashboard logs to trace function errors.
- Rate limits: implement exponential backoff and jitter on retries.

## Further reading

- [Convex docs](https://convex.dev/docs)
