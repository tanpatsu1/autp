# Automation Runbook

This runbook explains how to operate autp Codex Automations. Automation titles, descriptions, and internal prompts live in `docs/automation-registry.md`.

## Before Every Automation

1. Read `AGENTS.md`.
2. Read `docs/current-status.md`.
3. Read `docs/automation-policy.md`.
4. Read `docs/task-board.md`.
5. Read `docs/compact-context.md`.
6. Read `docs/verification-loop.md`.
7. Read `docs/skill-registry.md`.
8. Read `docs/feedback-inbox.md`.
9. Check for missing secrets, missing environment variables, missing product decisions, and human-confirmation requirements.
10. Choose the smallest useful safe change.

## Execution Flow

1. Identify the automation from `docs/automation-registry.md`.
2. Confirm its category: Periodic, Caution, or Efficiency.
3. Load the listed Skills.
4. Gather the listed inputs.
5. Check stop conditions before acting.
6. Make the smallest safe change or decision.
7. Run verification when available.
8. Update the required output docs.
9. Append entries to `docs/automation-log.md` and `docs/review-log.md`.
10. Write the next recommended task clearly.

## Stop Flow

If an automation reaches a human-confirmation action:

1. Do not perform the action.
2. Add an item to `docs/feedback-inbox.md` with the required format from `docs/automation-policy.md`.
3. Record the stop in `docs/automation-log.md`.
4. Record the safety decision in `docs/review-log.md`.
5. Continue with a different safe task only if it does not depend on the blocked decision.

## Verification Flow

For code or behavior changes, use the verification loop:

```bash
npm run verify
```

If `verify` is unavailable, run:

```bash
npm run lint
npm run typecheck
npm run build
```

For docs-only changes, verification can be recorded as not run with the reason:

```text
Not run. Docs-only automation registry/runbook/log update.
```

If local tooling is unavailable, record the exact blocker in both `docs/automation-log.md` and `docs/review-log.md`.

## Automation-Specific Steps

### Daily Project Sweep

1. Read the required context.
2. Select the highest safe task from `docs/task-board.md`.
3. Route it through `autp-orchestrator` and `autp-automation-runner`.
4. Update task status, current status, review log, and automation log.
5. Stop only for human-confirmation requirements.

### CI Failure Fix Loop

1. Read the failing CI or local command output.
2. Use `autp-qa` to identify the first actionable failure.
3. Use `autp-implementation` for a scoped fix.
4. Use `autp-review-gate` to check the change.
5. Rerun the failed command when possible.
6. Record pass/fail and any blocker.

### Review Gate Sweep

1. Inspect the diff or PR patch.
2. Use `autp-review-gate` to identify bugs, policy issues, docs drift, and verification gaps.
3. Auto-fix safe issues.
4. Record remaining risks and known limitations.

### Skill Discovery Sweep

1. Use `autp-skill-discovery`.
2. Compare repeated work in review logs and task board with existing Skills.
3. Update `docs/skill-registry.md` and `docs/skill-discovery-log.md` when safe.
4. Propose new Skills only when they reduce repeated coordination cost.

### Documentation Sync

1. Compare recent changes with status and task docs.
2. Update `docs/current-status.md`, `docs/task-board.md`, `docs/review-log.md`, and `docs/automation-log.md` as needed.
3. Avoid exposing real env values, credentials, or unapproved launch details.

### Vercel Preview Check

1. Use `autp-qa`.
2. Check deployment status and preview URL when available.
3. Confirm the app loads and no secrets are visible.
4. Record failures and safe follow-up tasks.
5. Do not alter paid, production, or secret-bearing settings.

### Product Improvement Sweep

1. Use `autp-product` and `autp-growth`.
2. Review MVP gaps and user-facing copy opportunities.
3. Add small, verifiable tasks to `docs/task-board.md`.
4. Keep external posting and launch actions gated.

### Launch Readiness Sweep

1. Use `autp-launch` and `autp-growth`.
2. Review readiness, docs, FAQ, usage copy, known limitations, and rollback notes.
3. Draft local launch materials only.
4. Add final production launch approval to `docs/feedback-inbox.md`.

## Required Outputs

Every automation cycle should leave:

- Summary of work
- Files changed or decision made
- Verification result or blocker
- Safety check
- Human-confirmation items, if any
- Next recommended task

## Operator Note

This runbook keeps autp moving automatically except when human confirmation is required. Always stop for external posting, paid actions, secrets, destructive production changes, weaker RLS, service role key use, and final public launch.
