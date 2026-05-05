# Docs Reading Map

Use this map after `docs/context-intake-gate.md`. The default order is capsule, map, diff, targeted search, then full docs only with a reason.

## Start Here

1. Pick a task type in `docs/context-intake-gate.md`.
2. Read one capsule from `docs/task-capsules.md`.
3. Inspect changed files or the requested files.
4. Search `docs/review-log.md` and `docs/decision-log.md` only when prior history is needed.
5. Open domain docs only if the task type or `npm run pr-ready` points there.

## Do Not Full-Read By Default

- `docs/review-log.md`
- `docs/decision-log.md`
- `docs/automation-runbook.md`
- unrelated Product, Data Model, RLS, Growth, Launch, or skill docs
- full command logs after the first actionable failure is known

## Task Type Map

| Task type | Required docs | Optional docs | Avoid unless directly relevant |
| --- | --- | --- | --- |
| Next task selection | `AGENTS.md`, `docs/task-capsules.md` `next-task-selection`, `docs/compact-context.md`, `docs/task-board.md`, `docs/automation-policy.md` | `docs/skill-registry.md`, `docs/automation-registry.md`, `docs/feedback-inbox.md` | Product/data/RLS docs until a task is selected |
| PR readiness | `AGENTS.md`, `docs/context-intake-gate.md`, `docs/pr-readiness-check.md`, changed-file list | Domain docs named by risk output | Full review/decision logs |
| Review Gate | `docs/review-gate-matrix.md`, `docs/pr-readiness-check.md`, `npm run pr-ready` output, changed files | Domain docs named by High-risk changes | Full Review Gate without written reason |
| QA / verification | `docs/task-capsules.md` `qa-verification`, `docs/verification-loop.md`, changed files or failing output | `docs/pr-readiness-check.md` when PR-bound | Decision history unless a verification decision is disputed |
| Fix PR / CI failure | `docs/task-capsules.md`, `docs/pr-readiness-check.md`, failing log, changed files | Owning domain doc for the failing area | Product strategy docs unless scope-related |
| Conflict fix | `docs/task-capsules.md` `conflict-fix`, `docs/pr-readiness-check.md`, conflicting files | Targeted log/decision entries for conflicted docs | Unconflicted feature docs and broad refactors |
| Supabase / Auth / RLS / Env | `docs/task-capsules.md` `supabase-persistence`, `docs/automation-policy.md`, `docs/data-model.md`, `docs/supabase-schema.md`, `docs/rls-policy.md`, changed files | `docs/verification-loop.md`, targeted log/decision search by domain | Growth, launch, general product direction docs |
| Vercel preview QA | `AGENTS.md`, `docs/verification-loop.md`, PR/change summary, preview/deployment output | `docs/review-log.md` targeted entry | Data model docs unless persistence is under test |
| Product scope | `AGENTS.md`, `docs/automation-policy.md`, requested product doc | `docs/review-protocol.md`, targeted decision entry | App code unless estimating feasibility |
| Design review | `AGENTS.md`, `docs/automation-policy.md`, changed UI files, relevant product spec | `docs/verification-loop.md` | Supabase/RLS docs unless data states affect UI |
| Growth or launch draft | `AGENTS.md`, `docs/automation-policy.md`, `docs/feedback-inbox.md`, requested copy docs | `docs/current-status.md` targeted sections | Implementation and migration files |
| Docs-only audit | `AGENTS.md`, `docs/context-intake-gate.md`, docs named by request | Targeted logs/decisions by task id or file | App code, migration SQL, unrelated council folders |
| Token architecture | `AGENTS.md`, `docs/context-intake-gate.md`, `docs/task-capsules.md`, `docs/docs-reading-map.md`, `docs/short-prompt-templates.md`, `docs/review-gate-matrix.md` | Targeted log/decision entries for token, prompt, QA, Review Gate | Full logs, unrelated skills, app implementation |

## Command Shortcuts

For PR readiness and pre-Review Gate checks:

```bash
npm run pr-ready
```

For PR-bound QA, Fix PR, Conflict fix, and Supabase/RLS review:

```bash
npm run pr-ready
npm run verify
npm run pr-ready
```

Skip the final `npm run pr-ready` only when no files changed after verification.

## Targeted Log Rule

For `docs/review-log.md` and `docs/decision-log.md`, search by task id, date, domain, or changed file. Read only the matching entry and nearby lines.

## Token Efficiency Rule

Prefer:

1. Context Intake Gate.
2. Task capsule.
3. Reading map.
4. Git diff and changed files.
5. Targeted search.
6. Domain docs.

Full reads are exceptions, not defaults.

## Shared Docs Write Rule

- Prefer new dedicated docs for long analysis.
- Keep `docs/current-status.md` to short current-state bullets.
- Treat `docs/review-log.md` and `docs/decision-log.md` as append-only except for small terminology cleanups in active references.
- In `docs/task-board.md`, add or update only the selected task row and the next task pointer.
