# Skill Consolidation v1

## Goal

Reduce future Codex prompt volume by turning repeated autp operations into short prompts, small reading sets, and reusable Skill or runbook boundaries.

This pass builds on `NEXT-017` and assumes `npm run pr-ready`, `docs/pr-readiness-check.md`, `docs/short-prompt-templates.md`, and `docs/docs-reading-map.md` are available.

## Input Notes

- `docs/token-efficiency-audit-v1.md` was requested as input but is not present in this checkout.
- `docs/skill-consolidation-plan.md` was requested as input but is not present in this checkout.
- This consolidation uses the available `NEXT-017` docs plus the current automation policy, runbook, review protocol, task board, decision log, and review log.

## Consolidated Operations

| Operation | Use | Read First | Commands | Skill / Runbook Boundary |
| --- | --- | --- | --- | --- |
| Review Gate | Before finishing any changed-files task or PR. | `AGENTS.md`, `docs/compact-context.md`, `docs/pr-readiness-check.md`, `docs/review-protocol.md`, changed files | `npm run pr-ready`; then `npm run verify` when files changed and blockers are clear | Existing `autp-review-gate` skill is enough. Keep the short prompt in `docs/short-prompt-templates.md`. |
| QA | Verify local behavior, build health, or preview readiness. | `AGENTS.md`, `docs/compact-context.md`, `docs/verification-loop.md`, changed files | `npm run pr-ready`; `npm run verify` | Existing `autp-qa` skill is enough. Use the runbook only for command order and logging. |
| Fix PR | Address review, CI, readiness, or docs-drift findings on a branch. | `AGENTS.md`, `docs/compact-context.md`, `docs/pr-readiness-check.md`, `docs/review-log.md`, failing output or review comments | `npm run pr-ready`; focused failing command; `npm run verify`; `npm run pr-ready` again | Proposed future `autp-fix-pr` skill if this repeats across PRs. For now use `autp-implementation`, `autp-qa`, and `autp-review-gate`. |
| Supabase-RLS Review | Review schema, RLS, auth, env, SQL, or Supabase client changes. | Core set plus `docs/data-model.md`, `docs/supabase-schema.md`, `docs/rls-policy.md`, changed files | `npm run pr-ready`; `npm run verify` after safe changes | Proposed future `autp-supabase-rls-review` skill because this is high-risk and repeated. Until then combine `autp-data-model` and `autp-review-gate`. |
| Conflict Fix | Resolve merge conflict markers or branch drift without broad refactors. | `AGENTS.md`, `docs/compact-context.md`, `docs/pr-readiness-check.md`, conflicting files | `npm run pr-ready`; targeted verification; `npm run verify`; `npm run pr-ready` again | Proposed future `autp-conflict-fix` skill only after repeated conflicts. Current runbook guidance is enough. |
| Next Task Selection | Choose the next safe autonomous task. | `AGENTS.md`, `docs/compact-context.md`, `docs/task-board.md`, `docs/automation-policy.md`, `docs/review-log.md` | `npm run pr-ready` only after files are edited; `npm run verify` after code, config, CI, or risky docs changes | Existing `autp-orchestrator` and `TaskBoardLoop` are enough. |

## Short Prompt Rules

Future user prompts should not paste long policy blocks when the task matches a known operation. Use:

```text
autp <operation>. Use compact context. Run npm run pr-ready first and npm run verify before PR when files changed.
```

Where `<operation>` is one of:

- `review`
- `qa`
- `fix-pr`
- `rls-review`
- `conflict`
- `next`

## Skillization Priority

| Priority | Candidate | Decision | Reason |
| --- | --- | --- | --- |
| P0 | Keep `Review Gate`, `QA`, and `Next Task Selection` in existing skills | Do not create new skills now | `autp-review-gate`, `autp-qa`, and `autp-orchestrator` already cover these workflows. Short prompts and reading maps reduce token load without more skill files. |
| P1 | `autp-supabase-rls-review` | Propose next if RLS or Supabase work repeats | Supabase, Auth, env, SQL, migrations, and RLS are high-risk. A focused skill would reduce policy drift and prevent accidental weakening. |
| P1 | `autp-fix-pr` | Propose next if PR repair repeats | Review comments, readiness blockers, CI failures, and docs drift often need the same sequence: inspect, patch narrowly, run `pr-ready`, verify, update logs. |
| P2 | `autp-conflict-fix` | Defer until repeated conflicts appear | Conflict repair is important but should stay narrow. A runbook is enough until conflicts become common. |
| P2 | `autp-pr-publish` | Defer to GitHub plugin flow | Commit, push, and PR creation are already covered by the GitHub publish workflow and project policy. |

## Default PR-Bound Sequence

Use this sequence for every PR-bound operation unless a HumanGate item appears:

1. Read the smallest operation-specific set from `docs/docs-reading-map.md`.
2. Edit only files in scope.
3. Run `npm run pr-ready`.
4. Fix blockers if safe.
5. Run `npm run verify`.
6. Run Review Gate.
7. Update `docs/current-status.md`, `docs/review-log.md`, `docs/task-board.md`, and `docs/decision-log.md` when project behavior or automation behavior changes.
8. Commit only intended files, push the branch, and open a PR.

## HumanGate

Do not use short prompts to bypass `HumanConfirmationRequired`. Stop and write to `docs/feedback-inbox.md` before external posting, billing, purchases, domains, secrets, real env values, service role keys, production data deletion, DB table deletion, weaker RLS, or final public production launch.
