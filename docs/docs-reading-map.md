# Docs Reading Map

Use this map to reduce repeated docs loading. Read the smallest set that covers the task, then open deeper docs only when the change touches that area.

## Always Start Small

For most autp work:

1. `AGENTS.md`
2. `docs/compact-context.md`
3. `docs/automation-policy.md`
4. `docs/task-board.md`
5. `docs/review-log.md`

For consolidated short operations, also read `docs/skill-consolidation-v1.md` only when choosing or changing the shortcut itself. Routine execution should use the operation-specific sets below.

## PR Readiness

Read:

- `AGENTS.md`
- `docs/compact-context.md`
- `docs/pr-readiness-check.md`
- `docs/automation-policy.md`
- `docs/review-log.md`

Run:

```bash
npm run pr-ready
```

Open additional docs only when `npm run pr-ready` reports High-risk files or Review Gate needs more context.

## Review Gate

Read:

- `AGENTS.md`
- `docs/compact-context.md`
- `docs/review-protocol.md`
- `docs/pr-readiness-check.md`
- `docs/automation-policy.md`
- `docs/review-log.md`
- changed files

Use `npm run pr-ready` first to find blockers and risk level. Read Product, Data Model, RLS, Launch, or Growth docs only if the changed files or task scope touches those areas.

## QA / Verification

Read:

- `AGENTS.md`
- `docs/compact-context.md`
- `docs/verification-loop.md`
- `docs/pr-readiness-check.md`
- changed files

Run `npm run pr-ready` for quick blocker detection, then run `npm run verify` when the change is ready for full verification or when policy requires it.

## Fix PR

Read:

- `AGENTS.md`
- `docs/compact-context.md`
- `docs/pr-readiness-check.md`
- `docs/review-log.md`
- failing CI output, review comments, or readiness output
- changed files

Run:

```bash
npm run pr-ready
npm run verify
npm run pr-ready
```

Use the second `npm run pr-ready` to confirm the fix did not introduce conflict markers, secrets, unsafe files, or new high-risk blockers.

## Conflict Fix

Read:

- `AGENTS.md`
- `docs/compact-context.md`
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

Read the core set plus the specific relevant docs:

- `docs/data-model.md`
- `docs/supabase-schema.md`
- `docs/rls-policy.md`
- `docs/automation-policy.md`

These changes are High-risk for PR readiness and require careful Review Gate.

Run:

```bash
npm run pr-ready
npm run verify
```

Stop for HumanGate before real env values, service role keys, production DB changes, production SQL execution, DB table deletion, or weaker RLS.

## Next Task Selection

Read:

- `AGENTS.md`
- `docs/compact-context.md`
- `docs/task-board.md`
- `docs/automation-policy.md`
- `docs/review-log.md`

Run `npm run pr-ready` only after files are edited. Run `npm run verify` before PR creation when the task changes code, config, CI, scripts, security posture, or risky automation docs.

## Token Efficiency Rule

Do not load every project doc for routine PR readiness. Prefer:

1. Compact context.
2. `npm run pr-ready` output.
3. Changed files.
4. Only the domain docs named by the risk output.

Use `docs/skill-consolidation-v1.md` to decide whether a repeated workflow belongs in an existing skill, a runbook shortcut, or a future skill proposal.
