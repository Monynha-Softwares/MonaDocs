## Advanced CI/CD Patterns

This page documents advanced CI/CD patterns recommended for the Monynha monorepo. It complements `ci-cd.md` by providing operational recipes, secrets handling, remote caching guidance, and release strategies suitable for experienced engineers.

1) Secrets & Credentials Management
----------------------------------
- Store secrets in a dedicated secrets manager (GitHub Actions Secrets for short-lived values; AWS Secrets Manager or HashiCorp Vault for production secrets). Do not store secrets in repo or artifacts.
- Rotate secrets on a regular schedule; implement automated rotation for short-lived tokens where possible.
- Example pattern (GitHub Actions + AWS Secrets Manager):
  - CI reads short-lived deploy token from AWS Secrets Manager using an IAM role with limited scope.
  - The role is provided to the runner via OpenID Connect (OIDC) to avoid long-lived credentials.

2) Reproducible Builds & Artifact Signing
----------------------------------------
- Use lockfiles (`yarn.lock`, `pnpm-lock.yaml`) and pinned base images to ensure reproducible builds.
- Produce signed artifacts: sign Docker images (cosign) and generated JS/CSS bundles where applicable. Store signatures alongside artifacts in registry.
- Example: build → cosign sign ghcr.io/<repo>/web:<sha> → push signature to OCI registry.

3) Remote Caching for Monorepo (Turborepo)
------------------------------------------
- Enable remote caching in CI so repeated builds only run changed tasks. Use an S3-compatible bucket or remote cache service.
- Cache keys should include Node version, lockfile checksum, and repo SHA to avoid cache poisoning.
- Example turbo.json snippet:

```json
{"pipeline": {"build": {"cache": true}}}
```

4) Test Matrices & Isolation
----------------------------
- Split tests into lightweight unit tests (fast), integration tests (database-backed), and E2E (slow). Run unit tests on every PR and gate integration/E2E on merge to main or on demand.
- Use ephemeral databases (Postgres containers) and separate credentials per workflow run to avoid state bleed.

5) Preview Environments & PR Previews
------------------------------------
- Deploy preview builds for PRs using a hosting provider (Vercel, Netlify) or ephemeral environments on Kubernetes/ECS.
- Provide a bot comment with the preview URL; include an automated accessibility and Lighthouse report for each preview.

6) Deployment Strategies & Rollbacks
-----------------------------------
- Blue/Green or Canary deployments are preferred for services with live traffic.
- Implement health checks and automated rollback: if new deployment fails health checks, rollback to the previous revision automatically.
- Store deployment metadata and release tags to facilitate rollbacks and audits.

7) Secrets for Third-Party Integrations
--------------------------------------
- When integrating with external providers (Clerk, Firebase, payment gateways), treat their API keys as secrets and scope them to the minimum necessary privileges.
- Prefer server-side proxies for sensitive operations and keep frontend keys public-only where intended.

8) Observability & CI Signals
-----------------------------
- Fail CI on: lint/type-check failures, unit test regressions, critical vulnerability scans (high/critical), bundle-size increases beyond threshold.
- Record CI metrics (build time, test duration, failure rates) and use them for performance SLAs on developer productivity.

9) Governance & Change Control
------------------------------
- For infra changes (Terraform, deployment scripts), require at least two approvals and run `terraform plan` in CI, posting plan output to the PR for review.
- Automate drift detection and schedule regular infra audits.

References & recipes
--------------------
- OIDC with GitHub Actions: https://docs.github.com/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect
- cosign for image signing: https://github.com/sigstore/cosign
- Turborepo remote caching: https://turborepo.org/docs/features/remote-caching
