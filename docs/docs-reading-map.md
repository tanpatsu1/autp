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

## PR Readiness

Read:

- `AGENTS.md`
- `docs/context-intake-gate.md`
- `docs/pr-readiness-check.md`
- changed-file list

Run:

```bash
npm run pr-ready
```

Open extra docs only when risk output names a domain or blocker.

## Review Gate

Read:

- `docs/review-gate-matrix.md`
- `docs/pr-readiness-check.md`
- `npm run pr-ready` output
- changed files

Use targeted domain docs only for High-risk areas. Full Review Gate requires a written reason.

## QA / Verification

Read:

- `docs/task-capsules.md` `qa-verification`
- `docs/verification-loop.md`
- changed files or failing output

Run the requested check first. For PR-bound changed files, run:

```bash
npm run pr-ready
npm run verify
```

## Fix PR

Read:

- `docs/task-capsules.md`
- `docs/pr-readiness-check.md`
- failing CI output, review comments, or readiness output
- changed files

Run:

```bash
npm run pr-ready
npm run verify
npm run pr-ready
```

Patch only the blocker.

## Conflict Fix

Read:

- `docs/task-capsules.md` `conflict-fix`
- `docs/pr-readiness-check.md`
- conflicting files

Run:

```bash
npm run pr-ready
npm run verify
npm run pr-ready
```

Do not refactor while resolving conflicts unless the conflict cannot be resolved without a tiny compatibility edit.

## Supabase / Auth / RLS / Env

Read:

- `docs/task-capsules.md` `supabase-persistence`
- `docs/automation-policy.md`
- `docs/data-model.md`
- `docs/supabase-schema.md`
- `docs/rls-policy.md`
- changed files

Search logs and decisions by `Supabase`, `Auth`, `RLS`, `env`, `SQL`, and changed file names. Stop for HumanGate before real env values, service role keys, production DB changes, production SQL execution, DB deletion, or weaker RLS.

## Next Task Selection

Read:

- `AGENTS.md`
- `docs/task-capsules.md` `next-task-selection`
- `docs/compact-context.md`
- `docs/task-board.md`
- `docs/automation-policy.md`

Do not read product/data/RLS docs until a task is selected.

## Token Efficiency Rule

Prefer:

1. Context Intake Gate.
2. Task capsule.
3. Reading map.
4. Git diff and changed files.
5. Targeted search.
6. Domain docs.

Full reads are exceptions, not defaults.
