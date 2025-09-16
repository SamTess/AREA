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
