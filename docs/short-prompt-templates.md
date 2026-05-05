# Short Prompt Templates

Use these instead of long project briefs. Codex should run `docs/context-intake-gate.md` first, then choose the capsule and checks.

## Micro Prompts

### PR Readiness

```text
autp pr-ready. Gate first. Run npm run pr-ready. Report blockers, risk, Review Gate level, next check.
```

### Review Gate

```text
autp review. Gate first. Use review-gate-matrix, pr-ready output, changed files. Full Review Gate only with reason.
```

### QA

```text
autp qa. Gate first. Use qa capsule. Run requested check, then npm run verify if PR-bound. Log blockers only.
```

### Fix PR

```text
autp fix-pr. Gate first. Patch only blocker. Run pr-ready, verify, pr-ready. Keep output short.
```

### Supabase / RLS Review

```text
autp rls-review. Gate high-risk. Use supabase capsule. No secrets, service role, prod SQL, prod DB, or weaker RLS.
```

### Conflict Fix

```text
autp conflict. Gate first. Resolve markers only. Run pr-ready, verify, pr-ready.
```

### Next Task

```text
autp next. Gate first. Use next-task capsule. Pick first safe Open task. Do one small batch.
```

### Token Architecture

```text
autp token. Gate first. Update token budgets, capsules, reading map, review matrix, prompts. No app code.
```

## Expanded Prompt

Use only when starting a fresh thread that lacks repo context:

```text
autp task. Read AGENTS.md, run Context Intake Gate, choose one task capsule, read only required docs, search logs instead of full-reading them, run pr-ready and verify when PR-bound, use risk-based Review Gate, and report changed files/checks/risk/blockers/next only.
```
