---
title: Schema migrations and backups
description: Practical guide for schema migrations, zero-downtime patterns, backups and restore runbooks.
---

## Purpose

This guide documents recommended workflows for schema migrations (Prisma-based examples), safe deployment practices, backup schedules and a short recovery runbook for PostgreSQL-based projects (including Supabase-managed instances).

## Principles

- Prefer backward-compatible changes when migrating (expand-contract pattern).
- Make schema changes in two steps where required: add new columns/objects, deploy code that writes to both old and new shapes, then migrate and remove old fields later.
- Always have tested backups and a practiced restore procedure.

## Prisma migrations (recommended workflow)

1. Create a small, focused migration with `prisma migrate dev --name your_change` during development.
2. Review the SQL produced under `prisma/migrations`.
3. In CI, use `prisma migrate deploy` against the target DB for deterministic application.

CI job example (simplified):

```yaml
name: apply-migrations
on: push
jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install
        run: yarn install --frozen-lockfile
      - name: Apply Prisma Migrations
        env:
          DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}
        run: npx prisma migrate deploy
```

### Local dev sanity check

- Run `npx prisma migrate dev` and `npx prisma db push` for quick iterations, but rely on `migrate deploy` for CI/production.

## Zero-downtime migration patterns

- Non-destructive changes first: add columns, add new tables, populate/transform data in background jobs.
- Backfill and make application code write to both fields (feature-flag the readback switch).
- Run a short read-compare test before deleting old fields.

Example: renaming a column `full_name` -> `display_name`

1. Add `display_name` column (nullable).
2. Deploy code that writes both `full_name` and `display_name`.
3. Backfill existing rows with a one-off job.
4. Flip reads to use `display_name` behind a feature flag.
5. After monitoring, issue migration to drop `full_name`.

## Backups

### Simple logical backup (pg_dump)

Run daily logical backups with `pg_dump` and store them offsite (object storage). Example command:

```bash
pg_dump -Fc -h <host> -p <port> -U <user> -d <db> -f backup-$(date +%F).dump
```

Notes:

- Use compressed/custom format (`-Fc`) for efficient storage.
- Keep 7-30 days of daily backups and weekly/monthly longer-term snapshots depending on retention policy.

### Physical backups and WAL (for large DBs / production)

- Use base backups + continuous WAL shipping (pg_basebackup + WAL archive) for point-in-time recovery (PITR).
- Managed Postgres (Supabase, RDS) provide automated PITR snapshots — follow provider docs and preserve backup retention settings.

## Restore runbook (high level)

1. Identify most recent good backup file.
2. Provision an isolated restore target (new DB instance) to avoid affecting production.
3. Restore the dump: `pg_restore -d <newdb> backup-file.dump`.
4. Run sanity checks (smoke tests, application health checks) against the restored DB.
5. If you need to rollback production, point the application to the restored DB after coordination and maintenance windows.

## Emergency rollback strategy

- Rolling back code that depends on schema removal is easier when schema was migrated in a backward-compatible way.
- If a destructive migration was already applied and must be reverted, restore the latest backup into a new instance and perform a cutover.

## Testing migrations

- Add a small test job that applies migrations to a fresh DB and runs the test suite (fast smoke tests) in CI before applying migrations to production.

## Operational checklist before applying migrations to prod

1. Ensure a fresh successful backup is available.
2. Verify migration SQL and review for destructive operations.
3. Run migrations in a staging environment that mirrors production.
4. Deploy application changes that are compatible with both old and new schema.
5. Monitor application metrics and error rates during/after migration.

## References

- Prisma Migrate docs: [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- PostgreSQL backup & restore: official documentation
