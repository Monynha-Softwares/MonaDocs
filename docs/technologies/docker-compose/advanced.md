---
title: Docker Compose — Advanced Patterns
---

## Docker Compose — Advanced Patterns

This guide covers advanced Docker Compose usage for development and CI: profiles, healthchecks, buildx integration and CI cleanup.

### Use override files for local dev

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### Healthchecks and `depends_on`

Define `healthcheck` for stateful services and depend on `service_healthy` where appropriate.

### Buildx cache in CI

Use Buildx to persist cache in registry between CI runs. See `index.md` for example commands.

### CI cleanup

Always run a final cleanup step to remove volumes and containers:

```bash
docker compose down --volumes --remove-orphans
```
