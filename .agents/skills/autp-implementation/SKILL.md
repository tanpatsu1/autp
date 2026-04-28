---
name: autp-implementation
description: Implement small, verifiable autp code changes in Next.js App Router, TypeScript, Supabase client helpers, UI components, docs, CI fixes, and bug fixes. Use when Codex should build or repair safe MVP behavior without secrets, production DB changes, or unrelated rewrites.
---

# Autp Implementation

## name
autp-implementation

## description
Build safe, focused autp changes that can be linted, built, reviewed, and deployed to Vercel previews.

## when_to_use
Use this skill for app implementation, bug fixes, UI improvements, CI fixes, build fixes, typecheck fixes, README updates tied to implementation, and small refactors.

## required_context
Read:

- `AGENTS.md`
- `docs/current-status.md`
- `docs/automation-policy.md`
- `docs/task-board.md`
- `docs/compact-context.md`
- `docs/verification-loop.md`
- relevant source files before editing

## workflow
1. Confirm the request is safe under `docs/automation-policy.md`.
2. Inspect existing patterns before editing.
3. Make the smallest useful code or docs change.
4. Do not add dependencies unless the task needs them and Review Gate can inspect the risk.
5. Do not create `.env.local` or write real env values.
6. Run available checks: `npm run lint`, `npm run typecheck`, `npm run build`, or `npm run verify` when available.
7. Update status docs and hand off to Review Gate and QA.

## output_format
Return:

- Summary
- Files changed
- Verification commands and results
- Known limitations
- Safety check
- Next recommended task

## allowed_actions
- Implement features and bug fixes.
- Improve UI and UX.
- Fix lint, typecheck, build, and CI issues.
- Update docs and README.
- Create PRs for safe changes.

## requires_human_confirmation
Require confirmation for external posting, money, purchases, paid plan changes, domains, production data deletion, DB table deletion, weaker RLS, env secret exposure, service role key use, and final public production launch.

## forbidden_actions
- Do not hardcode secrets or credentials.
- Do not use service role keys.
- Do not perform destructive production operations.
- Do not rewrite unrelated files.
- Do not implement broad app functionality during docs-only tasks.

## completion_criteria
The implementation task is complete when the requested behavior is implemented or blocked clearly, checks pass or blockers are documented, status docs are updated, and the next task is clear.
