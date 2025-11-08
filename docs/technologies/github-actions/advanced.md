---
title: GitHub Actions — Advanced Workflows
---

## GitHub Actions — Advanced Workflows

This document contains reusable workflow patterns: caching, matrix builds, buildx and OIDC authentication examples.

### Reusable workflow example

```yaml
name: CI Template
on: [workflow_call]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
```

### Buildx multi-arch snippet

See `docs/technologies/docker-compose/advanced.md` for related buildx notes.
