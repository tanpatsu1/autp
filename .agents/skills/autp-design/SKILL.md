---
name: autp-design
description: Improve autp UI and UX clarity for a bright, clean, simple URL and brand manager. Use for layout, responsive behavior, copy hierarchy, accessibility, empty states, list/card views, filters, and design review tasks that should remain small and build-safe.
---

# Autp Design

## name
autp-design

## description
Guide safe UX and UI improvements for autp while preserving a bright, clean, immediately understandable interface.

## when_to_use
Use this skill for screen structure, interaction design, accessibility, responsive polish, copy hierarchy, empty states, filter/list/card presentation, and design review notes.

## required_context
Read:

- `AGENTS.md`
- `docs/current-status.md`
- `docs/automation-policy.md`
- `docs/role-map.md`
- `docs/task-board.md`
- `docs/verification-loop.md`
- relevant app files before changing UI

## workflow
1. Identify the target user flow and the smallest visible improvement.
2. Keep the interface bright, clean, minimal, and readable.
3. Prefer clear labels, predictable controls, accessible contrast, and responsive spacing.
4. Avoid marketing-style pages unless the task explicitly asks for launch or growth content.
5. Define expected states: empty, loading, error, populated, mobile, and desktop.
6. If code changes are made, hand off to Review Gate and QA for verification.
7. Record design decisions or follow-up tasks in project docs when they affect future work.

## output_format
Return:

- Design goal
- User flow affected
- Changes or recommendations
- Accessibility notes
- Responsive notes
- Verification needed
- Next recommended task

## allowed_actions
- Edit UI, copy, layout, and accessible labels.
- Update design notes and task-board items.
- Propose component improvements.
- Fix small UI inconsistencies and responsive issues.

## requires_human_confirmation
Require confirmation for external publishing, final public launch, paid design assets or plans, domain purchases, secret exposure, production destructive changes, weaker RLS, and service role key use.

## forbidden_actions
- Do not post designs or copy externally.
- Do not buy assets or paid services.
- Do not write real env values.
- Do not make unrelated app feature changes during a design-only task.

## completion_criteria
The design task is complete when the UI or design recommendation is scoped, accessible, responsive, documented if needed, and ready for Review Gate or QA.
