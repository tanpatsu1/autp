# Current Status

## Project

- Repository: `tanpatsu1/autp`
- Project: `autp`
- Stack: Next.js / TypeScript / Supabase / Vercel
- Mode: `AutomationFoundation`

## Current Setup

- Minimal Next.js application structure is present.
- Supabase browser client helper is present.
- Secret values are not committed.
- `.env.local` is intentionally not included.
- Automation foundation docs are added.
- `npm run verify` is defined through package scripts.
- Local `npm run verify` passes.
- GitHub Actions CI is added at `.github/workflows/ci.yml`.
- `TaskBoardLoop`, `HumanGate`, `ReviewGate`, and `VerificationLoop` are documented as the default operating loops.

## Automation Docs

- `docs/automation-policy.md`: default automation policy and human stop rules.
- `docs/task-board.md`: Now / Next / Later / Blocked task selection.
- `docs/feedback-inbox.md`: human-confirmation queue.
- `docs/review-log.md`: work history, review gate notes, and verification notes.
- `docs/compact-context.md`: short shared context.
- `docs/role-map.md`: Orchestrator / Product / Design / Implementation / Review Gate / QA / Growth / Launch roles.
- `docs/verification-loop.md`: lint / typecheck / build / Vercel flow.
- `docs/skill-registry.md`: English skill names and purposes.
- `docs/automation-registry.md`: English automation loop names and triggers.

## Role Skills

- `.agents/skills/autp-orchestrator/SKILL.md`: task selection, role routing, and HumanGate routing.
- `.agents/skills/autp-skill-discovery/SKILL.md`: skill auditing, registry maintenance, and future skill proposals.
- `.agents/skills/autp-product/SKILL.md`: MVP scope, acceptance criteria, product tradeoffs, and product handoffs.
- `.agents/skills/autp-design/SKILL.md`: bright, clean UI/UX guidance, accessibility, and responsive polish.
- `.agents/skills/autp-data-model/SKILL.md`: safe data-model, Supabase schema, and RLS proposal workflow.
- `.agents/skills/autp-implementation/SKILL.md`: small, verifiable implementation and CI/build fixes.
- `.agents/skills/autp-review-gate/SKILL.md`: bug-first review, policy checks, verification gaps, and docs drift checks.
- `.agents/skills/autp-qa/SKILL.md`: local, preview, browser, and command-based verification workflow.
- `.agents/skills/autp-growth/SKILL.md`: local growth, onboarding, FAQ, and launch copy drafts without external posting.
- `.agents/skills/autp-launch/SKILL.md`: release-readiness preparation with final public launch gated by human approval.
- `.agents/skills/autp-automation-runner/SKILL.md`: routine safe automation cycles for task-board progress, CI fixes, review feedback, and docs upkeep.

## Live Automation Setup

- First active automation: `TaskBoardLoop`.
- Trigger phrase: `次進めて`.
- `docs/automation-runbook.md` now contains the exact `TaskBoardLoop` prompt, priority order, Skill selection guide, HumanGate rules, verification rules, and completion output.
- `TaskBoardLoop` should select the first safe `Open` task from `docs/task-board.md`, choose the required Skill, route human-gated items to `docs/feedback-inbox.md`, and otherwise continue through implementation or docs work, verification, review, docs updates, and PR creation.
- This setup did not implement the URL-saving MVP.

## Open Issues

- Supabase live connection is not verified.
- Final public production launch remains blocked by `HumanConfirmationRequired`.

## Next Task

Use `TaskBoardLoop` by saying `次進めて`. The first selected task should be `NEXT-001`: define the smallest URL-saving MVP scope in docs only, unless a newer safe `Now` task appears.

## Verification Status

- Live automation setup is docs-only. `npm run verify` passed on 2026-04-29.
- `quick_validate.py` passed for all 11 `.agents/skills/**/SKILL.md` files.
- `.agents/skills/**/SKILL.md` contains no TODO markers and no non-ASCII characters.
- `npm run verify` passed locally: lint, typecheck, and build completed successfully.

## Updated

- 2026-04-29
