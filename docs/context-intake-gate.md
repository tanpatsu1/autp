# Context Intake Gate

Run this gate before substantial reading or editing.

## Intake Form

| Field | Decision |
| --- | --- |
| Task type | tiny docs / low-risk implementation / medium-risk implementation / high-risk Supabase-Auth-RLS / QA / Review Gate / conflict fix |
| Risk level | Low / Medium / High |
| Token Budget Class | XS / S / M / L / Review / QA |
| Required docs | Exact files to read or search |
| Optional docs | Files to open only if the diff or command output points there |
| Forbidden full reads | Logs, decisions, unrelated domain docs, unrelated skills |
| Review Gate needed | skip / lightweight / full with reason |
| QA needed | none / pr-ready / verify / targeted browser or command |
| Expected output length | 5 bullets / 7 bullets / findings only |

## Decision Rules

### Task Type

- Tiny docs: wording, task-board row, docs index, status note.
- Low-risk implementation: small app code fix without auth, env, Supabase, CI, package, or scripts.
- Medium-risk implementation: routes, scripts, config, package files, automation policy, or reusable behavior.
- High-risk Supabase/Auth/RLS: Supabase client, auth, RLS, SQL, migrations, env, security posture.
- QA: command or browser verification without planned product changes.
- Review Gate: review-only work.
- Conflict fix: conflict markers, branch drift, or merge repair.

### Required Docs

Always prefer capsule and map first. Add domain docs only when the task type requires them.

| Task type | Required docs |
| --- | --- |
| Tiny docs | `docs/task-capsules.md`, changed file, targeted log/decision search if needed |
| Low-risk implementation | `AGENTS.md`, `docs/task-capsules.md`, `docs/compact-context.md`, changed files |
| Medium-risk implementation | Low-risk set plus `docs/pr-readiness-check.md` and the owning domain doc |
| High-risk Supabase/Auth/RLS | `AGENTS.md`, `docs/automation-policy.md`, `docs/data-model.md`, `docs/supabase-schema.md`, `docs/rls-policy.md`, changed files |
| QA | `AGENTS.md`, `docs/task-capsules.md`, `docs/verification-loop.md`, changed files or failing output |
| Review Gate | `docs/review-gate-matrix.md`, `docs/pr-readiness-check.md`, changed files, targeted domain docs |
| Conflict fix | `docs/task-capsules.md`, `docs/pr-readiness-check.md`, conflicting files |

### Forbidden Full Reads

Unless the task type explicitly needs them, do not full-read:

- `docs/review-log.md`
- `docs/decision-log.md`
- `docs/automation-runbook.md`
- product/data/RLS/launch/growth docs outside the changed domain
- unrelated `.agents/skills/**/SKILL.md`

### Review Gate

- Low-risk: skip dedicated Review Gate when `npm run pr-ready` has no blocker and the diff is narrow.
- Medium-risk: use `npm run pr-ready` to decide skip vs lightweight.
- High-risk: lightweight Review Gate required.
- Full Review Gate: normally prohibited; allowed only when there is a written reason such as security posture change, conflicting decisions, broad refactor, or unresolved blocker.

### QA

- Tiny docs: no QA unless PR-bound policy asks for `npm run pr-ready`.
- Low-risk implementation: `npm run verify`.
- Medium-risk implementation: `npm run pr-ready` and `npm run verify`.
- High-risk: `npm run pr-ready`, `npm run verify`, and targeted checks available locally.
- Conflict fix: `npm run pr-ready`, targeted check, `npm run verify`, `npm run pr-ready`.

## Example Gate Result

```text
Task type: medium-risk implementation
Risk level: Medium
Budget: M
Required docs: task capsule, docs-reading-map, pr-readiness-check, changed files
Optional docs: automation-policy if policy text changes
Forbidden full reads: review-log, decision-log, unrelated skills
Review Gate: lightweight if pr-ready reports Review Gate required
QA: npm run pr-ready, npm run verify
Output: 7 bullets max
```
