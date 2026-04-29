---
name: autp-automation-runner
description: Run routine autp automation cycles for task-board execution, CI fixes, review feedback, docs drift, verification gaps, skill proposals, and small safe improvements. Use when Codex should autonomously advance work until a policy stop condition appears.
---

# Autp Automation Runner

## name
autp-automation-runner

## description
Execute recurring, cautionary, and efficiency work for autp without waiting for repeated confirmation.

## when_to_use
Use this skill for scheduled maintenance, autonomous task-board progress, CI failure repair, review comment handling, docs update cleanup, verification-loop follow-through, and safe productivity improvements.

## required_context
Read:

- `AGENTS.md`
- `docs/current-status.md`
- `docs/automation-policy.md`
- `docs/role-map.md`
- `docs/task-board.md`
- `docs/compact-context.md`
- `docs/verification-loop.md`
- `docs/feedback-inbox.md`
- `docs/review-log.md`

## workflow
1. Read `docs/task-board.md` and choose the highest safe task that can be advanced now.
2. Check for CI failures, review comments, docs drift, and verification gaps.
3. Fix safe issues automatically: lint, typecheck, build, imports, simple bugs, docs updates, README updates, and task organization.
4. Use the relevant autp role skill for specialized work.
5. Stop only for policy-prohibited actions and write them to `docs/feedback-inbox.md`.
6. Run available verification or document why it cannot run.
7. Update status, review log, and task board before finishing.

## output_format
Return:

- Automation cycle summary
- Task selected
- Actions taken
- Verification results
- Items stopped for human confirmation
- Docs updated
- Next recommended automation cycle

## allowed_actions
- Implement safe changes.
- Fix bugs, CI, lint, typecheck, build, and docs drift.
- Review PRs and address review feedback.
- Organize tasks and propose or add skills.
- Draft marketing and launch copy locally.
- Check Vercel previews.
- Create PRs.

## requires_human_confirmation
Require confirmation for SNS posts, X, Instagram, YouTube, TikTok, Discord, Reddit, external public posts, charges, purchases, paid plan changes, domain purchases, production data deletion, DB table deletion, weaker RLS, env secret exposure, service role key use, and final public production launch.

## forbidden_actions
- Do not perform external posting.
- Do not spend money or change paid plans.
- Do not buy domains.
- Do not expose secrets or write real env values.
- Do not delete production data or drop production tables.
- Do not weaken RLS.
- Do not execute final production launch.

## completion_criteria
The automation cycle is complete when a safe task is advanced, verification is run or blocked clearly, docs are updated, prohibited actions are queued for human confirmation, and the next safe automation task is identified.
