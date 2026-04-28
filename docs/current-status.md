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
- Automation policy is added in `docs/automation-policy.md`.
- Task management docs are added for autonomous operation.

## Automation Docs

- `docs/task-board.md`: source for Now / Next / Later / Blocked task selection.
- `docs/feedback-inbox.md`: human-confirmation queue and unresolved decisions.
- `docs/review-log.md`: work history, verification status, and next recommendation.
- `docs/compact-context.md`: short shared context for future Codex runs.
- `docs/verification-loop.md`: lint / typecheck / build / Vercel verification flow.
- `docs/role-map.md`: Orchestrator, Product, Design, Implementation, Review Gate, QA, Growth, and Launch responsibilities.

## Automation Policy

- Mode: aggressive automation.
- Default: Codex proceeds automatically for implementation, fixes, docs, CI, review, copy drafts, task-board updates, and next-task selection.
- Stop only for: external public posting, money-related actions, secrets, destructive production changes, RLS weakening, service role key use, and final public production launch.

## Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Open Issues

- Local verification was not run for this docs-only update.
- Supabase live connection is not verified.

## Next Step

Start with the highest safe item in `docs/task-board.md`. Current recommended task: run the verification loop when local npm or CI is available, then review starter app readiness.

## Updated

- 2026-04-28
