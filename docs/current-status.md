# Current Status

## Project

- Repository: `tanpatsu1/autp`
- Project: `autp`
- Stack: Next.js / TypeScript / Supabase / Vercel
- Mode: `AutomationFoundation`

## Current Setup

- Minimal Next.js application structure is present.
- Supabase browser client helper is present.
- Secret values are not committed.
- `.env.local` is intentionally not included.
- Automation foundation docs are added.
- `npm run verify` is defined through package scripts.
- GitHub Actions CI is added at `.github/workflows/ci.yml`.

## Automation Docs

- `docs/automation-policy.md`: default automation policy and human stop rules.
- `docs/task-board.md`: Now / Next / Later / Blocked task selection.
- `docs/feedback-inbox.md`: human-confirmation queue.
- `docs/review-log.md`: work history and verification notes.
- `docs/compact-context.md`: short shared context.
- `docs/role-map.md`: Orchestrator / Product / Design / Implementation / Review Gate / QA / Growth / Launch roles.
- `docs/verification-loop.md`: lint / typecheck / build / Vercel flow.
- `docs/skill-registry.md`: English skill names and purposes.
- `docs/automation-registry.md`: English automation loop names and triggers.

## Open Issues

- Local `npm run verify` could not be run because `npm` is unavailable in this environment.
- Supabase live connection is not verified.

## Next Task

Run `npm run verify` in CI or after restoring local npm. If it fails, Codex should auto-fix safe lint/typecheck/build errors.

## Updated

- 2026-04-28
