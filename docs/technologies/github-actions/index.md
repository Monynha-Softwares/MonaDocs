# GitHub Actions

## What GitHub Actions provides

GitHub Actions is the native CI/CD platform for GitHub that enables automating workflows across the software lifecycle: CI, CD, code scanning, release automation and more.

## Advanced recipes and best practices

### Matrix builds and concurrency

Use matrix builds to test multiple runtime combinations and `concurrency` to avoid duplicated work:

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x]
    os: [ubuntu-latest]
  fail-fast: false

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

### Caching dependencies (example: npm/yarn)

```yaml
- name: Cache node modules
  uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      ~/.cache/yarn
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### Buildx and multi-platform container builds

Use Docker Buildx on runners to build and push multi-arch images:

```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Login to registry
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

- name: Build and push
  run: |
    docker buildx build --platform linux/amd64,linux/arm64 \
      -t ghcr.io/${{ github.repository }}:${{ github.sha }} --push .
```

### OIDC for cloud authentication (example: AWS)

Use OIDC to avoid long-lived cloud credentials in secrets. Example for AWS:

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v2
  with:
    role-to-assume: arn:aws:iam::123456789012:role/GitHubOIDCRole
    aws-region: us-east-1
```

### Reusable workflows

Export common CI pipelines as reusable workflows and call them from repos to keep DRY.

```yaml
# caller-workflow.yml
jobs:
  call-ci:
    uses: org/repo/.github/workflows/ci-template.yml@main
    with:
      node-version: 20
```

### Security & secrets

- Limit `permissions` for `GITHUB_TOKEN` and grant least privilege.
- Avoid echoing secrets in logs; use `${{ secrets.NAME }}` only in steps that don't print them.
- Prefer OIDC where supported over storing cloud provider secrets in GitHub.

### Artifacts and test reporting

- Use `actions/upload-artifact` to store test results, coverage and build artifacts for later inspection.
- Use `actions/cache` to speed up repeated jobs but ensure keys are invalidated when lockfiles change.

## Debugging and troubleshooting

- Enable `ACTIONS_STEP_DEBUG` and `ACTIONS_RUNNER_DEBUG` for deeper logs when investigating a runner issue.
- Use `outputs` between steps to pass computed values safely.

## Resources

- Docs: [GitHub Actions docs](https://docs.github.com/en/actions)
- Marketplace: [Actions Marketplace](https://github.com/marketplace?type=actions)
