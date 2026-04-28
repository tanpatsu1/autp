# AGENTS.md

## Project

- Repository: `tanpatsu1/autp`
- Project: `autp`
- Stack: Next.js / TypeScript / Supabase / Vercel
- Operating mode: `AutomationFoundation`

Codex should move the project forward automatically unless a task hits `HumanConfirmationRequired`.

## Required Reading Before Work

Read these files before choosing or executing a task:

1. `docs/current-status.md`
2. `docs/automation-policy.md`
3. `docs/task-board.md`
4. `docs/feedback-inbox.md`
5. `docs/compact-context.md`
6. `docs/verification-loop.md`
7. `docs/role-map.md`
8. `docs/skill-registry.md`
9. `docs/automation-registry.md`

## Core Rules

- Use `TaskBoardLoop` to choose the next safe task.
- Use `HumanGate` for actions that require human confirmation.
- Use `ReviewGate` before closing work.
- Use `VerificationLoop` after code, CI, or config changes.
- Keep changes small, reversible, and aligned with the current task.
- Do not implement the full URL-saving MVP during automation-foundation work.
- Do not write real environment values.
- Do not change Supabase production DB.
- Do not charge money, purchase anything, post externally, or execute final production launch.

## HumanConfirmationRequired

Stop and write the item to `docs/feedback-inbox.md` before:

- SNS posting
- Posting to X / Instagram / YouTube / TikTok / Discord / Reddit
- Public posting to external websites
- Billing, purchases, paid plan changes, or domain purchases
- Production data deletion
- DB table deletion
- Weakening RLS
- Exposing env values or secrets
- Using service role keys
- Final public production launch

## Verification

When tooling is available, run:

```bash
npm run verify
```

If verification cannot run, record the exact blocker in `docs/review-log.md`.
