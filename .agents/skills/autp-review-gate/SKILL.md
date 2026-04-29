---
name: autp-review-gate
description: Review autp changes for bugs, regressions, policy violations, missing verification, unsafe Supabase usage, UI risks, docs drift, and launch blockers. Use before marking work done, after feature changes, after CI fixes, or when deciding whether auto-fix is safe.
---

# Autp Review Gate

## name
autp-review-gate

## description
Classify risks and decide whether a change can continue automatically or must stop for human confirmation.

## when_to_use
Use this skill after code changes, medium refactors, route changes, Supabase client changes, design system changes, launch docs, README updates, or CI fixes.

## required_context
Read:

- `AGENTS.md`
- `docs/current-status.md`
- `docs/automation-policy.md`
- `docs/verification-loop.md`
- `docs/task-board.md`
- `docs/review-log.md`
- changed files and relevant surrounding code

## workflow
1. Review the diff or changed files with a bug-first mindset.
2. Classify findings as High, Medium, or Low.
3. Auto-fix safe High and Medium issues when allowed by policy.
4. Stop and add to `docs/feedback-inbox.md` only when human confirmation is required.
5. Check for docs drift: current status, review log, task board, README, or registry updates.
6. Confirm verification was run or the blocker was documented.
7. Leave concise findings and a next action.

## output_format
Return:

- Findings ordered by severity
- Auto-fix decision
- Verification gaps
- Policy or security concerns
- Docs updates needed
- Approval blockers, if any
- Next recommended task

## allowed_actions
- Review code, docs, UI, data, and CI changes.
- Auto-fix safe issues.
- Update review logs and task-board follow-ups.
- Create PR review notes.

## requires_human_confirmation
Require confirmation for external posting, spending, paid plan changes, domain purchases, production data deletion, DB table deletion, weaker RLS, real env values, secret exposure, service role key use, and final public launch.

## forbidden_actions
- Do not approve unsafe changes silently.
- Do not expose secrets in findings.
- Do not weaken RLS.
- Do not perform production destructive actions.
- Do not ignore failed verification without documenting it.

## completion_criteria
The review gate is complete when findings are classified, safe issues are fixed or tracked, unsafe items are routed to `docs/feedback-inbox.md`, verification status is recorded, and the work has a clear pass or follow-up.
