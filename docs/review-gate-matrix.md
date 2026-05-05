# Review Gate Matrix

Use this matrix to avoid full Review Gate by default. Review Gate means a dedicated review pass beyond the normal embedded safety check every Codex task should do.

## Levels

| Level | Meaning | Allowed when |
| --- | --- | --- |
| Skip dedicated | No separate Review Gate pass; do embedded safety check and rely on narrow diff plus pr-ready/verify as required. | Low-risk docs or low-risk implementation with clean `npm run pr-ready`. |
| Lightweight | Review changed files, pr-ready output, policy risks, verification status, and docs drift. | Medium-risk work, high-risk docs, conflict fixes, or high-risk domains. |
| Full | Broader multi-doc, role-style review with findings and explicit rationale. | Only with written reason. Not the default. |

## Risk Matrix

| Change type | Risk | Review Gate | QA |
| --- | --- | --- | --- |
| Tiny docs wording | Low | Skip dedicated | None or `npm run pr-ready` if PR-bound |
| Docs that change task routing, automation behavior, or review policy | Medium | Lightweight if `npm run pr-ready` reports Review Gate required | `npm run pr-ready`, `npm run verify` before PR |
| Small UI or TypeScript fix | Low/Medium | Skip if clean and narrow; otherwise lightweight | `npm run verify`; browser check if UI behavior changed |
| Scripts, package, config, CI-adjacent files | Medium | Lightweight | `npm run pr-ready`, `npm run verify` |
| Supabase client, Auth, RLS, SQL, migration, env, security | High | Lightweight required | `npm run pr-ready`, `npm run verify`, targeted checks |
| Launch, billing, external posting, final production release | High/HumanGate | Stop before action if HumanConfirmationRequired | No action until approved |
| Conflict fix | Medium/High | Lightweight after resolution | `npm run pr-ready`, targeted check, `npm run verify`, `npm run pr-ready` |

## Full Review Gate Reasons

Full Review Gate is prohibited unless one of these is recorded:

- security posture changes or possible weaker RLS
- service role key, secret, real env, or production DB risk
- broad refactor across unrelated modules
- conflicting decision-log entries
- unresolved pr-ready blocker that needs domain reasoning
- release or launch posture change

## Lightweight Checklist

- Scope matches task.
- No HumanConfirmationRequired action was performed.
- `npm run pr-ready` has no blocker or blocker is documented.
- `npm run verify` passed or exact blocker is documented.
- Changed docs and task-board/status/review-log are aligned.
- High-risk domain docs were checked only when needed.

## Output

Use findings-first only when there are findings. Otherwise:

```text
Review Gate: lightweight pass
Risk: Low/Medium/High
Checks: ...
Blockers: ...
Next: ...
```
