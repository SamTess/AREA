<!--
Recommended title: [PR](scope): short summary
Ex: [PR](frontend): add Avatar component
-->

## Goal
<!-- Business context & motivation (1–3 sentences). What problem is solved? -->

## Changes
<!-- Bullet list of key changes with technical scope. -->
- …

## Links
- Ticket / Issue: #
- Design / Spec / Doc: …

## Impacts & Risks
- Breaking change: Yes/No — Details:
- API/contract compatibility: …
- Data migration: Yes/No — Plan:
- Security (authN/Z, secrets, PII): …
- Performance (latency, memory, bundle): …
- Observability (logs/metrics/traces, alerts): …

## Tests & Validation
- Coverage: unit / integration / E2E
- Manual QA scenarios (repro steps):
1. …
2. …
- Screenshots/videos (if UI): …

## Deployment
- Affected environments: dev / staging / prod
- Feature flag: Yes/No — Key:
- Runbook / post-deploy steps: …
- Rollback plan: …

## Docs / Changelog
- Docs updated: Yes/No — Link:
- Changelog: Yes/No — Proposed entry:

---

### Author checklist
- [ ] Title follows `type(scope): …`
- [ ] Description, links, and impacts filled in
- [ ] Tests added/updated and CI green
- [ ] Lint/format/typos OK
- [ ] Docs/changelog updated if needed
- [ ] Clear rollback plan
- [ ] Labels applied (e.g., `area:backend`, `type:feat`)

### Reviewer checklist
- [ ] The “why” is clear
- [ ] Scope is limited & coherent
- [ ] Risks identified with credible mitigations
- [ ] Tests are pertinent (red → green for bug, success after fix)
- [ ] No hidden debt/surprises


---
# FRONTEND PART
### To remove if not applicable

---

## Context & Goal
<!-- User story, acceptance criteria, UX impacts -->

## UI/UX
- BEFORE/AFTER screenshots:
- Components created/updated:
- Navigation/routes: …
- State & data fetching (store/query cache): …
- i18n (keys, languages): …
- Accessibility (a11y): focus, ARIA, contrast, keyboard:
- Responsive (tested breakpoints): …

## Performance
- Bundle size (diff):
- Lazy-loading / code splitting:
- Scores (Lighthouse / Web Vitals):

## Tests
- Unit: …
- Storybook: stories added/updated:
- E2E (user journeys): scenarios:
- Cross-browser / devices tested: …

## Deployment
- Flags/experimentation (A/B):
- Mock/stub data for QA:
- Rollback (feature flag, easy revert):

### Frontend checklist
- [ ] Screenshots & edge cases covered
- [ ] a11y verified (contrast, tab order, labels)
- [ ] Bundle diff acceptable
- [ ] Stories/Docs updated
- [ ] Stable unit/E2E tests


---
# BACKEND PART
### To remove if not applicable

---

## Context & Goal
<!-- Business problem and architectural choices -->

## Technical details
- Endpoints (new/changed/removed):
  - `METHOD /path` — summary — compatibility status: …
- Schemas/DTOs (input/output):
- DB migrations: script, estimated duration, lock/transaction, backfill:
- Concurrency & idempotency: locks, retries, exactly-once:
- External calls (timeouts, retries, circuit breaker):
- Security: scopes/permissions, access control, PII, hashing/encryption:
- Observability: structured logs, metrics, traces, alerts:

## Tests
- Unit: …
- Integration (containers/fakes): …
- API contracts (e.g., OpenAPI diff, Pact): …
- Test data/fixtures: …

## Performance
- Latency/throughput budget: …
- Bench/microbench: …
- Known regressions & guardrails: …

## Deployment & rollback
- Ordering (flags, migration, code):
- Backward compatibility: Yes/No — strategy:
- Safe rollback (reversible migrations, dual-write/dual-read):

### Backend checklist
- [ ] OpenAPI/Contracts updated
- [ ] Migrations reviewed & tested (up/down)
- [ ] Timeouts/retries/circuit breaker in place
- [ ] Logs/metrics/traces added
- [ ] Tests (unit/int/contract) cover critical paths
- [ ] Secrets & PII handled correctly

---
# DEVOPS PART
### To remove if not applicable

---

## Scope & Goal
<!-- Why this infra/CI change? -->

## Infra/CI changes
- IaC (files, modules) — functional diff:
- CI/CD pipelines (stages, conditions, caches, secrets):
- Images/Docker: base, vulnerabilities, SBOM:
- Network/Security: SG/NSG, WAF, TLS, IAM policies:
- Storage/DB/Queues: classes, retention, backups:
- Observability: dashboards, alerts, SLO/SLI:

## Validation
- Plan/apply (terraform plan, helm diff):
- Environment integration tests: …
- Post-deploy load/smoke tests:
- Security review (linters, SAST/DAST/IaC scanners):

## Rollout & rollback
- Strategy (canary, blue/green, progressive delivery):
- Incident runbook / rollback steps:

### DevOps checklist
- [ ] Plans/diffs attached
- [ ] Secrets managed (vault/kms), no plaintext secrets
- [ ] Least-privilege rules enforced
- [ ] Relevant alerts configured
- [ ] Runbooks & diagrams updated

---
# BUGFIX PART
### To remove if not applicable

---


## Problem
- Symptoms:
- Impact (users, severity, frequency):
- Reproduction steps:
1. …
2. …

## Analysis (RCA)
- Root cause:
- Why not detected earlier? (tests/monitoring/process):

## Solution
- Change made:
- Alternatives considered:
- Guardrails (assertions, validations, timeouts, retries):

## Verification
- Failing test added: Yes/No — link/file:
- Additional tests (unit/int/e2e):
- Post-fix observability (logs/alerts for regression):

## Deployment
- Urgency: P0/P1/P2
- Rollback: simple/complex — plan:

### Bugfix checklist
- [ ] Clear repro & red → green test
- [ ] RCA documented
- [ ] Regression risk reduced (tests/monitoring)
- [ ] No unexpected side effects
