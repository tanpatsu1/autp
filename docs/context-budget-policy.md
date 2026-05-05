# Context Budget Policy

## Purpose

This policy caps context intake before work starts. It is stricter than the older "read all project docs" habit and should be used with `docs/context-intake-gate.md`.

## Default Budget

| Budget | Max intake before editing | Use when |
| --- | --- | --- |
| XS | Capsule, changed file, and targeted search only. | Tiny docs task. |
| S | Capsule, compact context, task-board row, changed files. | Low-risk implementation or docs. |
| M | Capsule/map, compact context, task-specific docs, changed files, pr-ready output. | Medium-risk implementation or automation docs. |
| L | High-risk domain docs, changed files, pr-ready output, targeted logs. | Supabase, Auth, RLS, env, SQL, security, conflict repair. |
| Review | Review matrix, pr-ready output, changed files, only domain docs named by risk. | Review Gate task. |
| QA | Verification loop, changed files, failing output, exact command target. | QA task. |

## Intake Order

1. Task capsule from `docs/task-capsules.md`.
2. `docs/docs-reading-map.md`.
3. `git status` / changed-file list / diff.
4. Targeted `Select-String` search in logs and decisions.
5. Required domain docs.
6. Full docs only when the gate records why targeted intake is insufficient.

## Required Search Instead Of Full Read

For `docs/review-log.md` and `docs/decision-log.md`, search by:

- task id, such as `NEXT-019`
- date, such as `2026-05-05`
- domain, such as `token`, `Review Gate`, `RLS`, `pr-ready`
- changed file name

Read only the matching entry and nearby lines.

## Command Output Budget

- Use short commands first: `git status -sb`, changed-file summaries, targeted `Select-String`, and the first failure block.
- Do not paste full build logs into docs.
- Record command name, pass/fail, and exact blocker.
- If a command fails, read the first actionable error before running broad searches.

## Skill Intake Budget

- Read the primary skill for the role that owns the task.
- Read a support skill only when it will change execution, such as QA after implementation or Review Gate after medium/high risk.
- Do not read every autp skill in routine work.

## Final Output Budget

Default final response:

```text
Changed files: ...
Checks: ...
Risk: ...
Blockers: ...
Next: ...
```

Keep this under 10 lines unless the user asks for detail or a review finding requires line-level evidence.
