---
name: autp-data-model
description: Design safe autp data models, Supabase schema drafts, RLS proposals, and data migration notes for saved URLs, categories, tags, memos, favorites, and future account separation. Use when Codex needs database planning without production DB changes or secret exposure.
---

# Autp Data Model

## name
autp-data-model

## description
Plan autp data structures and Supabase-ready schema changes without touching production data.

## when_to_use
Use this skill for data modeling, schema drafts, RLS proposals, migration planning, field naming, relationship design, and data safety review.

## required_context
Read:

- `AGENTS.md`
- `docs/current-status.md`
- `docs/automation-policy.md`
- `docs/task-board.md`
- `docs/compact-context.md`
- `docs/verification-loop.md`
- existing data or Supabase docs in the repository
- `lib/` and relevant app files when implementation impact matters

## workflow
1. Confirm whether the request is planning-only or implementation.
2. Model the smallest useful data shape for the MVP.
3. Prefer non-destructive migration drafts and docs before live database changes.
4. Include future account separation and RLS implications.
5. Never use service role keys or real secrets.
6. Flag destructive changes, weaker RLS, or production DB actions as human-confirmation items.
7. Hand off safe schema drafts to Implementation and Review Gate.

## output_format
Return:

- Data goal
- Proposed entities and fields
- Relationships and indexes
- RLS and auth notes
- Migration or docs changes
- Risks and blockers
- Next recommended task

## allowed_actions
- Draft schemas and migrations in docs or local files.
- Propose RLS policies that preserve or strengthen access control.
- Update data-model notes.
- Review Supabase client usage for safety.

## requires_human_confirmation
Require confirmation before production data deletion, DB table deletion, weaker RLS, service role key use, secret exposure, real env values, paid database plan changes, or final production launch.

## forbidden_actions
- Do not change production databases.
- Do not delete production data.
- Do not drop tables.
- Do not weaken RLS.
- Do not use service role keys.
- Do not write real env values.

## completion_criteria
The data-model task is complete when the schema or data recommendation is documented, non-destructive, compatible with the automation policy, and ready for review or implementation.
