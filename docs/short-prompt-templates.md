# Short Prompt Templates

Use these templates when the task is routine and the full project prompt would waste context. Each template assumes `AGENTS.md` and `docs/compact-context.md` remain the universal safety base.

## Universal Rules

Append this only when the user prompt does not already include safety constraints:

```text
Follow autp AutomationFoundation policy. Do not write real env values, use service role keys, change Supabase production DB, weaken RLS, charge money, post externally, or launch production. Use ReviewGate before finishing and run `npm run verify` when code, config, CI, or risky docs changed.
```

## Next Task Selection

```text
Run autp next-task selection. Read `AGENTS.md`, `docs/compact-context.md`, `docs/task-board.md`, and `docs/automation-policy.md`. Select the first safe Open task by Now, Next, Later. Skip Done, Waiting, and Blocked. Report selected task, required Skill, HumanGate status, and exact docs to read next. Do not edit files unless the selected task is safe and scoped.
```

## Review Gate

```text
Run autp Review Gate for the current diff. Read `AGENTS.md`, `docs/automation-policy.md`, `docs/verification-loop.md`, `docs/review-log.md`, and the changed files. Check scope, policy, secrets/env, Supabase/RLS risk, verification, docs drift, and next task. Auto-fix only safe High/Medium issues. Record blockers in `docs/feedback-inbox.md`.
```

## QA / Verification

```text
Run autp QA for this change. Read `AGENTS.md`, `docs/verification-loop.md`, `docs/current-status.md`, and the changed files. Run `npm run verify`. If a preview or dev server is relevant, check load, obvious runtime errors, and secret visibility. Update `docs/review-log.md` and `docs/current-status.md` with pass/fail and blockers.
```

## Fix PR / CI Failure

```text
Fix the current autp PR or CI failure. Read `AGENTS.md`, `docs/automation-policy.md`, `docs/verification-loop.md`, `docs/review-log.md`, and the first actionable failing log. Make the smallest safe patch, rerun the failed command then `npm run verify`, update review notes, and avoid unrelated refactors.
```

## Conflict Fix

```text
Resolve conflicts on this Codex-owned autp branch. Read `AGENTS.md`, `docs/automation-policy.md`, `docs/automation-runbook.md` conflict section, and conflicted files only. Preserve branch intent and latest main, remove markers, run `npm run verify`, and log any HumanGate blocker. Do not rewrite unrelated shared docs.
```

## Supabase / RLS Review

```text
Review Supabase/RLS safety for this autp change. Read `AGENTS.md`, `docs/automation-policy.md`, `docs/data-model.md`, `docs/supabase-schema.md`, `docs/rls-policy.md`, changed Supabase/lib files, and migrations. Check owner scope, RLS enabled posture, destructive SQL, service role keys, real env values, production DB risk, and two-user QA needs. Do not run production SQL.
```

## PR Readiness

```text
Prepare autp PR readiness. Read `AGENTS.md`, `docs/automation-policy.md`, `docs/verification-loop.md`, `docs/review-log.md`, `docs/current-status.md`, `docs/task-board.md`, and changed files. Check branch sync, changed-file scope, docs drift, verification, Review Gate, HumanGate, and draft PR body. Use gh only as fallback if connector PR creation is unavailable.
```

## Vercel / Preview QA

```text
Run autp preview QA. Read `AGENTS.md`, `docs/verification-loop.md`, `docs/current-status.md`, and the PR/change summary. Check deployment completion, page load, obvious runtime/console errors when tooling allows, secret visibility, and user-facing blocker notes. Do not change env values or production DB.
```

## gh Fallback

```text
Use gh fallback for autp PR metadata only. Check `gh --version`, `gh auth status`, `gh repo view --json nameWithOwner,defaultBranchRef`, current branch, and existing PR. Do not push, create, merge, or close anything unless the user requested PR creation and verification passed.
```

## Docs-Only Audit

```text
Run a docs-only autp audit. Read only the docs listed by the request plus `AGENTS.md`, `docs/automation-policy.md`, and `docs/compact-context.md`. Create append-only or new docs where possible. Do not implement app behavior, add GitHub Actions, touch env values, run SQL, weaken RLS, or change production systems. Run `npm run verify` before PR.
```
