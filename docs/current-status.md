# Current Status

## Project

- Repository: `tanpatsu1/autp`
- Framework target: Next.js App Router
- Language: TypeScript
- Deploy target: Vercel
- Database/client target: Supabase

## Current Setup

- Minimal Next.js application structure is present.
- Supabase browser client helper is present.
- Secret values are not committed.
- Local `.env.local` is intentionally not included.
- Automation policy is now added in `docs/automation-policy.md`.
- `AGENTS.md` now instructs Codex to read `docs/automation-policy.md` before work.

## Automation Policy

- Mode: aggressive automation.
- Default: Codex proceeds automatically for implementation, fixes, docs, CI, review, copy drafts, task-board updates, and next-task selection.
- Stop only for: external public posting, money-related actions, secrets, destructive production changes, RLS weakening, service role key use, and final public production launch.

## Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Open Issues

- Local verification was not run for this docs-only policy update.
- Supabase live connection is not verified.

## Next Step

Use `docs/automation-policy.md` and `docs/task-board.md` to choose the next safe automated task. Do not implement the URL-saving MVP as part of policy-only work.

## Updated

- 2026-04-28
