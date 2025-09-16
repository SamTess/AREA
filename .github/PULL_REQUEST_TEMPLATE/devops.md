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
