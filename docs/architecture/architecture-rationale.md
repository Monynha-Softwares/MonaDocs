## Architecture Rationale & Tradeoffs

Purpose
-------
This short document explains the rationale and tradeoffs behind the primary architecture choices in the Monynha platform. It is intended for engineers and architects who need to make consistent design decisions across products.

1. Node.js + TypeScript (API layer)
----------------------------------
- Rationale: Node.js provides fast developer iteration, broad ecosystem, and excellent support for JSON-first APIs. TypeScript enforces type-safety and reduces runtime bugs, especially in a polyglot team.
- Tradeoffs: Node's single-threaded model requires careful handling of CPU-bound tasks. For heavy background processing, we recommend offloading to worker processes (e.g., AWS Fargate tasks, serverless functions, or a dedicated worker pool in Go/Java).
- When to choose otherwise: Use a compiled language (Go, Rust) when strict latency, lower memory footprint, or predictable concurrency are top priorities.

2. PostgreSQL + Prisma (Primary Data Store)
-------------------------------------------
- Rationale: PostgreSQL is battle-tested, supports complex queries, transactional integrity, and is well-supported by managed services (RDS, Supabase). Prisma provides productivity gains (type-safe client, migrations).
- Tradeoffs: Prisma's generated client increases build-time and requires careful migration sequences for large schemas. For extremely large-scale, consider a more explicit SQL-first approach and careful indexing strategies.

3. Supabase for Realtime & Storage
----------------------------------
- Rationale: Supabase provides a convenient, integrated feature set (Realtime, Auth, Storage) that accelerates MVP and prototype development.
- Tradeoffs: Vendor lock-in risk and feature limits for enterprise workloads. For long-term scale, plan migration paths (e.g., replace Realtime with Redis Streams / WebSockets; replace Auth with self-hosted OIDC provider).

4. Client-Side Persistence (localStorage for web apps)
---------------------------------------------------
- Rationale: For offline-first UX and low-infrastructure MVPs, localStorage provides immediate persistence with zero server cost.
- Tradeoffs: localStorage is not secure for sensitive data and has size limits (~50MB). For multi-device sync and scale, migrate to a backend store (Firestore, Postgres with WebSockets) and implement robust conflict resolution.

5. Monorepo (Turborepo) vs Multi-Repo
-------------------------------------
- Rationale: Monorepo simplifies cross-project changes, version alignment, and shared tooling. Turborepo (or equivalent) provides caching and task orchestration.
- Tradeoffs: Requires CI investment (caching, focused builds) and governance around package boundaries. If teams grow into many independent products, evaluate splitting into smaller repos or a hybrid approach.

6. Containerization & Orchestration
-----------------------------------
- Rationale: Containers (Docker) + orchestrators (ECS/Fargate) deliver portability and predictable deployments for services.
- Tradeoffs: Orchestration adds operational complexity. For small services, serverless functions (AWS Lambda) may be more cost-effective.

Operational guidance & patterns
------------------------------
- Observability: instrument APIs with structured logs (JSON), distributed tracing (OpenTelemetry), metrics (Prometheus) and alerts (PagerDuty/Teams).
- Backups & DR: schedule regular logical backups for Postgres and test restores periodically. Store immutable backups offsite.
- Security: enforce least-privilege IAM roles and rotate secrets regularly. Use a secrets manager (AWS Secrets Manager / HashiCorp Vault).
- Cost control: use autoscaling with sensible minimums and on-demand scheduled scaling for predictable traffic.

Decision checklist (quick)
-------------------------
Before adopting a new technology, answer:
1. Does it reduce developer time-to-value significantly?  
2. Are there production-grade libraries and community support?  
3. Is operational cost and complexity acceptable?  
4. Is there a clear migration or rollback plan?  

Links & references
------------------
- Architecture discussions and RFCs: `docs/architecture/rfcs/` (create RFCs there for major changes).
- Observability starter: `docs/operations/observability.md` (recommended next addition).
