---
name: autp-product
description: Define autp product scope, MVP behavior, user flows, acceptance criteria, non-goals, and product tradeoffs. Use when Codex needs product decisions for URL saving, categories, tags, memos, favorites, search, filtering, grouping, or Supabase-ready account separation without making risky production changes.
---

# Autp Product

## name
autp-product

## description
Shape autp product decisions into small, verifiable tasks that move the MVP forward safely.

## when_to_use
Use this skill when the task involves MVP scope, acceptance criteria, user flows, product tradeoffs, feature prioritization, onboarding copy direction, or decisions that affect how users save and organize links.

## required_context
Read:

- `AGENTS.md`
- `docs/current-status.md`
- `docs/automation-policy.md`
- `docs/task-board.md`
- `docs/compact-context.md`
- `docs/feedback-inbox.md`
- any existing product, README, or launch docs relevant to the request

## workflow
1. Confirm the task is a product decision, not implementation-only work.
2. State the user problem in one sentence.
3. Define the smallest useful behavior that advances the MVP.
4. Write acceptance criteria that can be verified locally or in CI.
5. List non-goals to prevent scope drift.
6. Convert decisions into task-board-ready items for Design, Data Model, Implementation, QA, or Growth.
7. Route unresolved human decisions to `docs/feedback-inbox.md` only when required by policy.

## output_format
Return:

- User problem
- MVP decision
- Acceptance criteria
- Non-goals
- Handoffs
- Blockers or confirmation needs
- Next recommended task

## allowed_actions
- Update product docs and task board entries.
- Draft acceptance criteria and user flows.
- Clarify feature boundaries.
- Create safe implementation tasks.
- Draft copy without posting externally.

## requires_human_confirmation
Require confirmation for paid product commitments, public launch decisions, external posts, purchases, domains, production destructive data choices, weaker RLS, service role key use, secret exposure, and real env values.

## forbidden_actions
- Do not perform billing, purchases, domain actions, or external posts.
- Do not expose secrets.
- Do not directly change production databases.
- Do not expand MVP scope beyond what can be verified in a small step.

## completion_criteria
The product task is complete when the decision is documented, acceptance criteria are clear, risky items are routed to `docs/feedback-inbox.md`, and the next role can act without guessing.
