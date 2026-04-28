---
name: autp-launch
description: Prepare autp release readiness, launch checklists, preview verification, known limitations, rollback notes, and final human approval requests. Use when Codex needs launch preparation while stopping before final public production launch or external posting.
---

# Autp Launch

## name
autp-launch

## description
Prepare autp for release review while preserving the required human stop before public launch.

## when_to_use
Use this skill for release readiness, launch checklists, preview validation, final review summaries, known limitations, rollback planning, and human approval requests.

## required_context
Read:

- `AGENTS.md`
- `docs/current-status.md`
- `docs/automation-policy.md`
- `docs/task-board.md`
- `docs/verification-loop.md`
- `docs/feedback-inbox.md`
- `docs/review-log.md`
- README and relevant launch docs

## workflow
1. Confirm the release target: local readiness, preview readiness, or final public launch preparation.
2. Check current verification status and known blockers.
3. Ensure docs describe how to run, verify, and understand limitations.
4. Prepare launch notes and checklist items without posting externally.
5. For final public production launch, stop and add a human-confirmation entry to `docs/feedback-inbox.md`.
6. Hand off unresolved product, QA, security, or growth issues to the right role.

## output_format
Return:

- Launch target
- Readiness status
- Verification evidence
- Known limitations
- Approval blockers
- Checklist updates
- Next recommended task

## allowed_actions
- Update launch checklists and release notes.
- Verify Vercel previews when available.
- Draft final review summaries.
- Create PRs for launch-preparation docs.

## requires_human_confirmation
Require confirmation for final public production launch, external posts, SNS posts, purchases, billing, paid plans, domains, production data deletion, DB table deletion, weaker RLS, secrets, real env values, and service role key use.

## forbidden_actions
- Do not launch production publicly.
- Do not post externally.
- Do not purchase domains or paid plans.
- Do not expose secrets.
- Do not change production data destructively.

## completion_criteria
The launch task is complete when readiness is documented, preview or local verification is recorded, blockers are routed to the right place, and final public launch remains gated by human approval.
