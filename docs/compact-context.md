# Compact Context

Read this when a short instruction needs enough context to continue safely.

## Project

- Repository: `tanpatsu1/autp`
- Project: `autp`
- Stack: Next.js / TypeScript / Supabase / Vercel
- Mode: `AutomationFoundation`

## Must Read

1. `AGENTS.md`
2. `docs/current-status.md`
3. `docs/automation-policy.md`
4. `docs/task-board.md`
5. `docs/feedback-inbox.md`

## Main Loop

1. Use `TaskBoardLoop`.
2. Pick the highest safe task.
3. Apply the smallest useful change.
4. Run `VerificationLoop` when tooling is available.
5. Use `ReviewGate`.
6. Update `docs/current-status.md` and `docs/review-log.md`.

## Human Stops

Stop for SNS, external posting, billing, purchases, paid plans, domains, secrets, real env values, service role keys, production data deletion, DB table deletion, weaker RLS, or final public launch.

## Current Non-Goals

- No full URL-saving MVP implementation in automation-foundation work.
- No Supabase production DB changes.
- No real env values.
- No paid or public external actions.
