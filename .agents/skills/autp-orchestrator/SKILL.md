---
name: autp-orchestrator
description: Coordinate autonomous autp work across product, design, data, implementation, review, QA, growth, launch, and automation roles. Use when Codex must read the task board, select the next highest-priority safe task, split work by role, update project status, or route human-confirmation items to the feedback inbox.
---

# Autp Orchestrator

## name
autp-orchestrator

## description
Coordinate multi-role autonomous work for autp while keeping scope small, safe, and verifiable.

## when_to_use
Use this skill when a task asks Codex to choose the next task, route work between roles, manage the task board, decide whether a task is blocked, or prepare a coordinated work plan for autp.

## required_context
Read these files before making orchestration decisions:

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
1. Read `docs/task-board.md` and select the highest safe task from Now, then Next, then Later.
2. Check the selected task against `docs/automation-policy.md` and the human-confirmation list below.
3. If the task is safe, decompose it into role-specific work for Product, Design, Data Model, Implementation, Review Gate, QA, Growth, Launch, or Automation Runner.
4. Keep the first execution step small enough to verify in one PR.
5. If a human-confirmation action appears, do not perform it. Add a complete entry to `docs/feedback-inbox.md`.
6. After work completes, ensure `docs/current-status.md`, `docs/review-log.md`, and any affected task-board rows are updated.
7. Recommend the next safe task clearly.

## output_format
Return:

- Summary
- Selected task and reason
- Role breakdown
- Files changed or proposed
- Verification status
- Human-confirmation items, if any
- Next recommended task

## allowed_actions
- Select and prioritize safe tasks.
- Split work between autp role skills.
- Update docs, task board, status, and review log.
- Create safe implementation, review, QA, copy, and PR tasks.
- Send only blocked items to `docs/feedback-inbox.md`.

## requires_human_confirmation
Stop and request human confirmation for SNS posts, external public posts, purchases, billing, paid plan changes, domain purchases, production data deletion, DB table deletion, weaker RLS, real env values, secret exposure, service role key use, and final public production launch.

## forbidden_actions
- Do not perform external posting.
- Do not spend money or change billing.
- Do not expose secrets or write real environment values.
- Do not use service role keys.
- Do not delete production data or drop production tables.
- Do not weaken RLS.
- Do not perform final public production launch.

## completion_criteria
The orchestration task is complete when the next safe task is selected, unsafe work is routed to `docs/feedback-inbox.md`, role handoffs are clear, project docs reflect the result, and the next recommended task is written.
