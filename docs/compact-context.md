# Compact Context

Read this file when a short instruction needs enough context to continue safely.

## Project

- Repository: `tanpatsu1/autp`
- Product: `autp`, a multi-purpose URL / brand / link manager
- Stack target: Next.js App Router, TypeScript, Supabase, Vercel
- Current mode: aggressive automation with human stops only for dangerous actions

## Must Read

1. `AGENTS.md`
2. `docs/current-status.md`
3. `docs/automation-policy.md`
4. `docs/task-board.md`
5. `docs/feedback-inbox.md`

## Human Stops

Stop before external posting, billing, purchases, paid plan changes, domains, secret exposure, real env values, service role keys, production data deletion, DB table deletion, weaker RLS, or final public production launch.

## Current Non-Goals

- Do not implement the full URL-saving MVP during docs-only tasks.
- Do not change Supabase production DB.
- Do not write real env values.
- Do not post externally.

## Default Loop

1. Pick the highest safe task from `docs/task-board.md`.
2. Make the smallest useful change.
3. Run `docs/verification-loop.md` when tooling is available.
4. Record results in `docs/review-log.md`.
5. Update `docs/current-status.md`.
