# Docker Compose

## Overview

Docker Compose (v2 integrated as `docker compose`) is a convenient tool for defining and running multi-container environments for development, testing and light-weight staging. For production-grade orchestration prefer Kubernetes or a managed platform, but Compose remains excellent for reproducible local environments and CI integration.

## Advanced commands & patterns

Prefer the v2 unified CLI where possible: use `docker compose` (space) instead of the legacy `docker-compose` binary.

```bash
# Start services (foreground)
docker compose up --build

# Start services in background
docker compose up -d --remove-orphans

# Stop and remove containers, networks, volumes created by compose
docker compose down --volumes --remove-orphans

# View live logs for a single service
docker compose logs -f <service>

# Execute a one-off command in a running service
docker compose exec <service> sh

# Run a service temporarily (create, run and remove)
docker compose run --rm <service> <command>

# Convert Compose to Kubernetes manifests (experimental helper)
docker compose convert > k8s-manifests.yaml
```

### Profiles, override files and env separation

- Use `docker-compose.yml` for canonical config and `docker-compose.override.yml` or `docker-compose.dev.yml` for local overrides. Start with `-f` to combine files: `docker compose -f docker-compose.yml -f docker-compose.dev.yml up`.
- Use `profiles:` to enable optional services (e.g., `profiles: [ci]`) and run with `docker compose --profile ci up`.
- Use `.env` and `env_file:` to separate secrets from repository (never commit production secrets).

### Healthchecks and service dependencies

- Prefer `healthcheck:` and use orchestration logic in the application instead of relying solely on `depends_on` (which only manages startup order).

Example healthcheck:

```yaml
services:
  db:
    image: postgres:14
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build: .
    depends_on:
      db:
        condition: service_healthy
```

### Buildx and multi-platform builds in CI

Use Docker Buildx in CI to build and push multi-arch images and share build cache between runs.

```bash
docker buildx create --use --name builder
docker buildx build --platform linux/amd64,linux/arm64 -t ghcr.io/org/app:${GIT_SHA} --push .
```

Cache usage example (CI):

```bash
docker buildx build --cache-from type=registry,ref=ghcr.io/org/app:cache \
  --cache-to type=registry,ref=ghcr.io/org/app:cache,mode=max \
  -t ghcr.io/org/app:${GIT_SHA} --push .
```

### Compose in CI pipelines

- Always clean up with `docker compose down --volumes` in a final/cleanup step.
- Use ephemeral networks to avoid collisions in parallel CI jobs (set unique `COMPOSE_PROJECT_NAME`).
- For integration tests, prefer `docker compose run --rm` + explicit wait-for strategies (healthchecks or `wait-for-it` scripts).

### Troubleshooting & maintenance

- Prune unused resources carefully: `docker system prune -af` and `docker volume prune -f` (beware data loss).
- Inspect container state: `docker inspect <container>` and `docker compose ps`.
- If bind mounts are slow on macOS/Windows, consider using a cached mount or remote development container.

## Best practices summary

- Use `docker compose` (v2) across local and CI to keep behavior consistent.
- Keep production images small with multi-stage builds and minimal base images.
- Do not use Compose as a production orchestrator for large-scale services—use K8s or managed services.
- Implement healthchecks and readiness probes to ensure reliable startup sequencing.

## Resources

 - Official documentation: [Docker Compose docs](https://docs.docker.com/compose/)
