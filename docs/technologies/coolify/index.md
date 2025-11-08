# Coolify

## What Coolify is

Coolify is an open-source, self-hosted PaaS that lets teams deploy web apps, databases, and services to servers you control. It supports Docker deployments, buildpacks and integrates with Git for push-to-deploy workflows.

## Advanced usage and best practices

### Installation & production hardening

- Install on a minimal Ubuntu/Debian LTS server or a small cluster of servers for High Availability. Prefer a machine with swap disabled and proper file system monitoring.
- Use a reverse proxy (Nginx/Caddy) in front of Coolify or the platform-managed TLS to handle certificates and HTTP/2.
- Provision automated backups (S3-compatible targets) for both database volumes and Coolify metadata.

### CI/CD & Git integration

- Use branch-specific deploys and PR previews: connect repositories and configure preview environments for pull requests.
- For reproducible builds, pin buildpacks and use explicit build arguments; avoid relying on `latest` images.
- Trigger rollbacks via the UI or the Coolify API when a deploy fails smoke tests.

### Secrets, environment and scaling

- Store secrets in the Coolify secret manager and rotate them periodically.
- Keep separate environments for staging and production; use environment variables and feature flags to gate new behavior.
- Use horizontal scaling for stateless services and attach persistent volumes only to stateful components.

### Backups and disaster recovery

- Schedule automatic DB backups to an external S3-compatible bucket and validate restores regularly.
- Backup volumes and app settings; export configuration as code if possible for disaster recovery.

### Monitoring and troubleshooting

- Enable health checks and readiness probes for services so Coolify can report correct status.
- Use the realtime terminal and logs to debug build failures and runtime errors.
- Monitor disk usage and implement log rotation to avoid full disks.

### Automation (API & Webhooks)

- Use Coolify API or webhooks to automate deploys from CI pipelines (e.g., GitHub Actions trigger after build + image push).
- Example webhook workflow: build image in CI → push image to registry → call Coolify webhook with tag to deploy.

## Example: trigger deploy via webhook

```bash
# Example: Notify Coolify to deploy image-tag v1.2.3
curl -X POST \
  -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" \
  -H "Content-Type: application/json" \
  https://your-coolify.example.com/api/deploy \
  -d '{"projectId":"<project-id>","image":"registry.example.com/org/app:v1.2.3"}'
```

## Troubleshooting tips

- If builds fail: check build logs in the UI, confirm build dependencies and environment variables are present.
- If deployments fail: verify registry credentials, image tags, and that required volumes are mounted.
- For SSL issues: confirm DNS records and Let’s Encrypt rate limits; consider using an external certificate manager for high-volume domains.

## Resources

- Official docs: [Coolify docs](https://coolify.io/docs)
- Source: [coollabsio/coolify](https://github.com/coollabsio/coolify)
