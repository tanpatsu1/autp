# Skill Consolidation Plan

## Goal

Reduce repeated prompt text and manual operating loops by consolidating high-frequency autp workflows into fewer, sharper Skills and read-only helper scripts.

This plan proposes work only. It does not create new Skills or scripts in this PR.

## Existing Skill Coverage

| Existing Skill | Keep | Consolidation note |
| --- | --- | --- |
| `autp-orchestrator` | Yes | Add references to `docs/docs-reading-map.md` in a future PR so next-task selection reads fewer docs. |
| `autp-automation-runner` | Yes | Keep as broad execution loop; avoid adding every specialized checklist here. |
| `autp-review-gate` | Yes | Good base, but PR readiness and Supabase/RLS review need shorter specialized paths. |
| `autp-qa` | Yes | Keep, with a future verification-only fast path. |
| `autp-data-model` | Yes | Keep for planning; do not overload it with implementation PR review. |
| `autp-skill-discovery` | Yes | Use for future creation of the Skills below. |
| Product, Design, Implementation, Growth, Launch skills | Yes | No consolidation needed for Token Efficiency Audit v1. |

## Proposed Skills

| Priority | Proposed Skill | Why | Scope | Not in scope |
| --- | --- | --- | --- | --- |
| P0 | `autp-pr-readiness` | PR work is frequent and expensive: branch sync, diff scope, verify, docs drift, Review Gate, HumanGate, PR body, gh fallback. | Pre-PR checklist, draft PR body, gh fallback metadata, review-log readiness note. | Merging PRs, bypassing protections, production changes. |
| P0 | `autp-supabase-rls-review` | Supabase/RLS has high safety risk and repeated docs loads. | Migrations, RLS posture, owner scope, env/service-role checks, two-user QA handoff. | Running production SQL, weakening RLS, writing secrets. |
| P1 | `autp-conflict-fix` | Conflict repair is not constant but becomes high token cost when shared docs conflict. | Conflicted files, branch intent, latest main, marker removal, verify, review-log note. | Rewriting unrelated history or resolving product disagreements. |
| P1 | `autp-preview-qa` | Vercel preview QA repeats a stable checklist. | Deployment status, app load, runtime/console checks, secret visibility, blocker log. | Env changes, production DB changes, final launch. |
| P2 | `autp-docs-sync` | Shared docs updates are frequent and conflict-prone. | Current status, review log, task board, decision log alignment after a change. | Long analysis docs or strategic decisions. |
| P2 | `autp-token-audit` | Future audits can be shorter if this v1 workflow is reusable. | Repetition inventory, docs-reading map updates, Skill/script candidates. | App implementation or automation runtime changes. |

## Candidate Script Helpers

| Priority | Script | Type | Purpose | Safety guard |
| --- | --- | --- | --- | --- |
| P0 | `scripts/next-task` | Read-only | Parse `docs/task-board.md` and print first safe Open task plus required docs from `docs/docs-reading-map.md`. | No file writes, no git changes. |
| P0 | `scripts/pr-ready-check` | Read-only | Print branch, upstream, dirty files, changed docs/code groups, verify script presence, and PR URL if `gh` can read it. | No push, no PR creation by default. |
| P1 | `scripts/rls-safety-scan` | Read-only | Scan migrations and Supabase helpers for service-role text, destructive SQL, RLS disabling, and missing owner-policy markers. | Advisory only; no SQL execution. |
| P1 | `scripts/conflict-scan` | Read-only | List conflicted files and remaining conflict markers. | No automatic conflict resolution. |
| P1 | `scripts/verify-summary` | Command wrapper | Run `npm run verify` and print review-log-ready result text. | Does not edit docs automatically. |
| P2 | `scripts/docs-drift-check` | Read-only | Compare changed files against expected status/review/task/decision updates. | Advisory only. |
| P2 | `scripts/gh-pr-fallback` | Read-only by default | Check `gh` auth, repo, default branch, current branch, and existing PR. | No push or PR creation unless explicitly invoked with a future unsafe-by-default flag. |

## Consolidation Order

1. Build `autp-pr-readiness` and `scripts/pr-ready-check`.
2. Build `scripts/next-task`, then teach `autp-orchestrator` to reference the docs-reading map.
3. Build `autp-supabase-rls-review` and `scripts/rls-safety-scan`.
4. Build `autp-conflict-fix` and `scripts/conflict-scan`.
5. Add `verify-summary` only after the team confirms the review-log format is stable.

## Acceptance Criteria For Follow-Up PRs

- Each new Skill has a focused required-context list.
- Each script starts read-only unless there is explicit human approval to mutate state.
- No script writes env values, runs production SQL, changes billing, posts externally, weakens RLS, or launches production.
- `npm run verify` passes.
- Review Gate confirms the new workflow reduces docs reads without hiding safety checks.
