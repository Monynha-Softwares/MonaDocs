---
title: Enforcement & Tooling
sidebar_position: 3
---

# Enforcement & Tooling

This page complements `code-conventions.md` with practical, repository-level enforcement patterns: pre-commit hooks, CI gates, and dependency/security automation. These are focused on reducing friction while ensuring high code quality for experienced developers.

1. Pre-commit (local) vs CI enforcement
--------------------------------------
- Local: fast feedback with `husky` + `lint-staged` to catch style and simple errors before commits.
- CI: authoritative checks (type-check, full test suite, security scans). CI must be green before merges.

2. Recommended developer stack (JS/TS projects)
----------------------------------------------
- Husky for Git hooks (pre-commit, commit-msg).  
- lint-staged to run linters/formatters on staged files.  
- commitlint to enforce Conventional Commits.  

Example package.json snippets

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["yarn lint:fix", "yarn test:unit --findRelatedTests"],
    "*.{md,json}": ["prettier --write"]
  }
}
```

3. CI Gate (PR checks)
-----------------------
- Minimal required checks:
  - lint (ESLint)  
  - type-check (tsc --noEmit)  
  - unit tests  
  - vulnerability scan (Snyk/Trivy)  
- Optional but recommended: coverage check, bundle-size check, and preview deployment.

4. Dependency & Security Automation
----------------------------------
- Dependabot for dependency update PRs.  
- Scheduled vulnerability scans and fail builds on critical issues.  

5. Enforcing in monorepo
------------------------
- Use per-package scripts and a root task orchestrator (Turborepo). Keep PR checks focused: only run affected package tests where possible to reduce CI time.

6. Onboarding checklist for new repositories
-------------------------------------------
1. Add `pre-commit` hooks (husky)  
2. Add `PR checks` workflow with lint/type/test  
3. Configure Dependabot  
4. Add Code Owners and Reviewers  

Notes
-----
- These patterns are minimal and intentionally pragmatic: they provide the highest ROI for developer productivity and code quality without heavy gating. Repositories may opt into stricter enforcement for security-sensitive components.
