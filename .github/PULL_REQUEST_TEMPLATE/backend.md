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
