# Short Prompt Templates

Use these prompts instead of pasting a long project brief. Each PR-bound prompt starts with `npm run pr-ready`; each changed-files PR should run `npm run verify` before completion.

## Micro Prompts

### PR Readiness

```text
autp pr-ready. Use compact context. Run npm run pr-ready; report blockers, risk, Review Gate need, and next check only.
```

### Review Gate

```text
autp review. Use compact context. Run npm run pr-ready, Review Gate changed files, then npm run verify if blockers are clear.
```

### QA

```text
autp qa. Use compact context. Run npm run pr-ready, then npm run verify; log exact blockers.
```

### Fix PR

```text
autp fix-pr. Use compact context and review/CI output. Patch only the blocker, run npm run pr-ready, npm run verify, then npm run pr-ready again.
```

### Supabase / RLS Review

```text
autp rls-review. Use compact context plus data-model, schema, and RLS docs. Run npm run pr-ready, review for weaker RLS/secrets/prod DB risk, then npm run verify.
```

### Conflict Fix

```text
autp conflict. Use compact context. Resolve only conflict markers, run npm run pr-ready, npm run verify, then npm run pr-ready again.
```

### Next Task

```text
autp next. Use TaskBoardLoop compact set. Pick the first safe Open task, do one small batch, run npm run pr-ready and npm run verify before PR, and stop for HumanGate.
```

## Expanded Prompts

Use these only when a new Codex thread needs more explicit direction.

### PR Readiness Check

```text
Run PR readiness for autp. Read AGENTS.md, docs/compact-context.md, docs/pr-readiness-check.md, docs/automation-policy.md, and docs/review-log.md. Run npm run pr-ready, summarize risk, blockers, Review Gate need, and the recommended verification command. Do not commit, push, create a PR, or run npm run verify unless explicitly asked.
```

### Pre-Review Gate With `npm run pr-ready`

```text
Run pre-Review Gate for autp. Read AGENTS.md, docs/compact-context.md, docs/pr-readiness-check.md, docs/review-protocol.md, and docs/automation-policy.md. Run npm run pr-ready first. If it exits 0, review changed files for scope, safety, verification gaps, docs drift, and HumanGate triggers. Then run npm run verify if files changed and no blocker remains.
```
