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
- Local `npm run verify` passes.
- GitHub Actions CI is added at `.github/workflows/ci.yml`.
- `TaskBoardLoop`, `HumanGate`, `ReviewGate`, and `VerificationLoop` are documented as the default operating loops.

## Automation Docs

- `docs/automation-policy.md`: default automation policy and human stop rules.
- `docs/task-board.md`: Now / Next / Later / Blocked task selection.
- `docs/feedback-inbox.md`: human-confirmation queue.
- `docs/review-log.md`: work history, review gate notes, and verification notes.
- `docs/compact-context.md`: short shared context.
- `docs/role-map.md`: Orchestrator / Product / Design / Implementation / Review Gate / QA / Growth / Launch roles.
- `docs/verification-loop.md`: lint / typecheck / build / Vercel flow.
- `docs/skill-registry.md`: English skill names and purposes.
- `docs/automation-registry.md`: English automation loop names and triggers.

## Open Issues

- Supabase live connection is not verified.
- Final public production launch remains blocked by `HumanConfirmationRequired`.

## Next Task

Use `TaskBoardLoop` to select the first open safe item from `docs/task-board.md`. The current recommendation is `NEXT-001`: define the smallest URL-saving MVP scope in docs only.

## Updated

- 2026-04-28
