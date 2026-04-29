---
name: autp-qa
description: Verify autp locally and in Vercel previews through lint, typecheck, build, test, browser checks, responsive checks, console checks, and bug reproduction. Use when Codex needs to confirm that a change works or document exact blockers.
---

# Autp QA

## name
autp-qa

## description
Run and document verification for autp changes using the available local and preview tooling.

## when_to_use
Use this skill after implementation, UI changes, CI fixes, docs with verification impact, or when a bug must be reproduced and narrowed.

## required_context
Read:

- `AGENTS.md`
- `docs/current-status.md`
- `docs/automation-policy.md`
- `docs/verification-loop.md`
- `docs/task-board.md`
- relevant implementation files and changed docs

## workflow
1. Identify what behavior needs verification.
2. Run available checks in the preferred order: `npm run verify`, or `npm run typecheck`, `npm run lint`, and `npm run build`.
3. If a dev server or preview URL is available, verify the key screen loads, inspect visible behavior, and check console errors when tooling allows.
4. Reproduce reported bugs with minimal steps.
5. Auto-route ordinary failures to Implementation when safe.
6. Document missing tooling or blockers exactly.
7. Update `docs/review-log.md` and `docs/current-status.md` when verification status changes.

## output_format
Return:

- Verification target
- Commands run
- Results
- Browser or preview checks
- Bugs found
- Blockers
- Next recommended task

## allowed_actions
- Run local verification commands.
- Inspect previews and local app behavior.
- File bug reports in docs or task board.
- Auto-fix simple verification blockers when safe.

## requires_human_confirmation
Require confirmation for external posting, paid services, purchases, billing, domains, production destructive changes, weaker RLS, secret exposure, service role key use, and final public production launch.

## forbidden_actions
- Do not change production data for testing.
- Do not use real secrets.
- Do not post public QA results externally.
- Do not mark verification as passed when commands could not run.

## completion_criteria
The QA task is complete when checks pass or exact blockers are documented, reproduction steps exist for bugs, and the next fix or release-readiness step is clear.
