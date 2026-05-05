# Docs Reading Map

Use this map to reduce broad docs loading. Start with the smallest required set for the task type, then add optional docs only when the task touches that area.

## Universal Base

| Use | Docs |
| --- | --- |
| Always read | `AGENTS.md`, `docs/compact-context.md`, `docs/automation-policy.md` |
| Read when changing files | `docs/verification-loop.md`, changed files |
| Read before closing work | `docs/review-log.md`, `docs/current-status.md`, `docs/task-board.md` |
| Avoid by default | Old review-log history beyond the latest relevant entries, unrelated council docs, launch/growth docs for implementation-only tasks |

## Task Type Map

| Task type | Required docs | Optional docs | Avoid docs unless directly relevant |
| --- | --- | --- | --- |
| Next task selection | `AGENTS.md`, `docs/compact-context.md`, `docs/task-board.md`, `docs/automation-policy.md` | `docs/skill-registry.md`, `docs/automation-registry.md`, `docs/feedback-inbox.md` | Feature specs, council docs, old review-log entries |
| Review Gate | `AGENTS.md`, `docs/automation-policy.md`, `docs/verification-loop.md`, `docs/review-log.md`, changed files | `docs/task-board.md`, `docs/current-status.md`, task-specific spec docs | Growth, launch, product council docs unless changed |
| QA / Verification | `AGENTS.md`, `docs/verification-loop.md`, `docs/current-status.md`, changed files | `docs/review-log.md`, `docs/task-board.md`, preview notes | Decision history unless a verification decision is disputed |
| Fix PR / CI failure | `AGENTS.md`, `docs/automation-policy.md`, `docs/verification-loop.md`, failing log, changed files | `docs/review-log.md`, `docs/current-status.md`, `docs/task-board.md` | Product strategy docs unless the failure is scope-related |
| Conflict fix | `AGENTS.md`, `docs/automation-policy.md`, `docs/automation-runbook.md`, conflicted files | `docs/review-log.md`, `docs/decision-log.md` entries related to conflicted docs | Unconflicted feature docs |
| Supabase/RLS review | `AGENTS.md`, `docs/automation-policy.md`, `docs/data-model.md`, `docs/supabase-schema.md`, `docs/rls-policy.md`, changed Supabase files and migrations | `docs/verification-loop.md`, `docs/review-log.md`, `docs/feedback-inbox.md` | Growth, launch, general product direction docs |
| PR readiness | `AGENTS.md`, `docs/compact-context.md`, `docs/pr-readiness-check.md`, `docs/automation-policy.md`, `docs/verification-loop.md`, `docs/review-log.md`, changed files, `npm run pr-ready` output | `docs/current-status.md`, `docs/task-board.md`, `docs/decision-log.md`, `docs/automation-runbook.md`, `docs/feedback-inbox.md` | Deep historical logs unrelated to the PR |
| gh fallback | `AGENTS.md`, `docs/automation-policy.md`, PR readiness summary | `docs/automation-runbook.md` | Product, data, design, launch docs |
| Vercel preview QA | `AGENTS.md`, `docs/verification-loop.md`, `docs/current-status.md`, PR/change summary | `docs/review-log.md`, `docs/task-board.md`, Vercel deployment logs | Data model docs unless persistence is under test |
| Product scope | `AGENTS.md`, `docs/automation-policy.md`, `docs/task-board.md`, `docs/product-spec.md` or requested product doc | `docs/review-protocol.md`, `docs/decision-log.md`, `docs/roadmap.md` | Implementation files unless estimating feasibility |
| Design review | `AGENTS.md`, `docs/automation-policy.md`, changed UI files, relevant product spec | `docs/verification-loop.md`, `docs/review-protocol.md` | Supabase/RLS docs unless data states affect UI |
| Growth or launch draft | `AGENTS.md`, `docs/automation-policy.md`, `docs/feedback-inbox.md`, requested copy docs | `docs/current-status.md`, `docs/review-log.md`, `docs/launch-checklist.md` if present | Implementation and migration files |
| Docs-only audit | `AGENTS.md`, `docs/compact-context.md`, `docs/automation-policy.md`, docs named by the request | `docs/review-log.md`, `docs/decision-log.md`, `docs/task-board.md` | App code, migration SQL, unrelated council folders |

## Latest-Only Rule

## PR Readiness Shortcut

For PR readiness and pre-Review Gate checks, run:

```bash
npm run pr-ready
```

Use its short summary to decide whether to read deeper domain docs. Run `npm run verify` only when the change is ready for full verification or when policy requires it.

For `docs/review-log.md` and `docs/decision-log.md`, read the latest relevant entries first. Load older entries only when:

- the task asks for historical audit,
- the latest entry links to an older decision,
- a conflict requires preserving branch intent,
- a repeated workflow is being counted.

## Shared Docs Write Rule

- Prefer new dedicated docs for long analysis.
- Keep `docs/current-status.md` to short current-state bullets.
- Treat `docs/review-log.md` and `docs/decision-log.md` as append-only except for small terminology cleanups in active references.
- In `docs/task-board.md`, add or update only the selected task row and the next task pointer.
