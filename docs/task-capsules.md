# Task Capsules

Task capsules are short operating briefs. Read the matching capsule before opening longer docs. If a capsule is missing or stale, update this file instead of pasting a long prompt into the next task.

## Capsule Rule

1. Choose one capsule.
2. Read only its required inputs.
3. Search logs and decisions instead of full-reading them.
4. Open long domain docs only when the capsule says so or `npm run pr-ready` points there.
5. Keep the final report within the capsule output budget.

## fast-save

Use for a narrow URL-saving MVP implementation slice after Product/Data/RLS docs are accepted.

- Budget: M, or L if Supabase/Auth/RLS files change.
- Required inputs: `AGENTS.md`, `docs/compact-context.md`, `docs/mvp-scope.md`, `docs/product-spec.md`, changed files.
- Add only if touched: `docs/data-model.md`, `docs/supabase-schema.md`, `docs/rls-policy.md`.
- Forbidden full reads: review log, decision log, growth, launch, unrelated skills.
- Review Gate: medium by default; high if auth, RLS, env, SQL, or Supabase client changes.
- QA: `npm run pr-ready`, `npm run verify`, targeted browser check if UI changed.
- Output: changed files, checks, risk, blockers, next.

## supabase-persistence

Use for persistence, schema, Supabase client, Auth, RLS, SQL, migration, or env-adjacent work.

- Budget: L.
- Required inputs: `AGENTS.md`, `docs/automation-policy.md`, `docs/data-model.md`, `docs/supabase-schema.md`, `docs/rls-policy.md`, changed files.
- Required search: `docs/review-log.md` and `docs/decision-log.md` for `Supabase`, `RLS`, `Auth`, `env`, changed file names.
- Forbidden actions: service role keys, real env values, production SQL, production DB changes, weaker RLS.
- Review Gate: lightweight required; full only with reason.
- QA: `npm run pr-ready`, `npm run verify`, targeted local checks.
- Output: include security risk and HumanGate status.

## high-risk-review

Use when reviewing high-risk code or docs that affect security, automation policy, launch posture, CI, env, or Supabase.

- Budget: Review/L.
- Required inputs: `docs/review-gate-matrix.md`, `docs/pr-readiness-check.md`, `npm run pr-ready` output, changed files, domain docs named by risk.
- Required search: logs/decisions by task id, domain, and changed file.
- Forbidden full reads: unrelated logs, unrelated domain docs, all skills.
- Review Gate: lightweight by default; full requires written reason.
- QA: run verify only if needed to validate a finding or before PR completion.
- Output: findings first, then checks, risk, blockers, next.

## qa-verification

Use for verification-only tasks.

- Budget: QA.
- Required inputs: `AGENTS.md`, `docs/verification-loop.md`, changed files, failing output or requested target.
- Optional inputs: `docs/pr-readiness-check.md` when PR-bound.
- Forbidden full reads: decision log, review log unless logging a blocker or finding a prior exact failure.
- Review Gate: only if QA finds a material risk.
- QA: run the requested command first; use `npm run verify` for PR-bound completion.
- Output: command, result, blocker, next.

## conflict-fix

Use for merge conflicts, conflict markers, or branch drift.

- Budget: L if many files conflict; otherwise M.
- Required inputs: `docs/pr-readiness-check.md`, conflicting files, `git status -sb`, targeted diff.
- Forbidden full reads: unrelated docs, unrelated skills, historical logs unless conflict source is unclear.
- Review Gate: lightweight after conflict markers are removed.
- QA: `npm run pr-ready`, targeted command if obvious, `npm run verify`, `npm run pr-ready`.
- Output: conflicted files, resolution scope, checks, residual risk.

## next-task-selection

Use for `TaskBoardLoop`, `next`, `continue`, or automation-runner task choice.

- Budget: S.
- Required inputs: `AGENTS.md`, `docs/compact-context.md`, `docs/task-board.md`, `docs/automation-policy.md`.
- Required search: `docs/review-log.md` by latest selected task id only if status is unclear.
- Forbidden full reads: decision log, review log, product/data/RLS docs until a task is selected.
- Review Gate: none before selection; use matrix after edits.
- QA: none before selection; after edits, follow selected class.
- Output: selected task, reason, first small batch, checks, next.
