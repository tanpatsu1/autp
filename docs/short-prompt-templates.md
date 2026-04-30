# Short Prompt Templates

Use these prompts when a full TaskBoardLoop prompt would load more context than the task needs.

## PR Readiness Check

```text
Run PR readiness for autp NEXT-017. Read AGENTS.md, docs/compact-context.md, docs/pr-readiness-check.md, docs/automation-policy.md, and docs/review-log.md. Run npm run pr-ready, summarize risk, blockers, Review Gate need, and the recommended verification command. Do not commit, push, create a PR, or run npm run verify unless explicitly asked.
```

## Pre-Review Gate With `npm run pr-ready`

```text
Run pre-Review Gate for autp. Read AGENTS.md, docs/compact-context.md, docs/pr-readiness-check.md, docs/review-protocol.md, and docs/automation-policy.md. Run npm run pr-ready first. If it exits 0, review the changed files for scope, safety, verification gaps, docs drift, and HumanGate triggers. If it exits 1, report the blockers and stop before PR creation.
```

## Short TaskBoardLoop

```text
Run TaskBoardLoop for autp using compact context. Read AGENTS.md, docs/compact-context.md, docs/task-board.md, docs/automation-policy.md, and docs/review-log.md. Select the first safe Open task, complete one small reversible batch, run required checks, use Review Gate, and update status docs. Stop for HumanConfirmationRequired.
```

## Verification Follow-up

```text
Run VerificationLoop for the current autp changes. Read AGENTS.md, docs/verification-loop.md, docs/automation-policy.md, and docs/review-log.md. Run npm run verify, fix safe failures only, and log exact blockers if verification cannot complete.
```
