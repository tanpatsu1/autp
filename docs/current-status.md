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
- Role Collaboration / Debate Protocol docs are added for proposal, review, decision, handoff, and cross-role debate.
- `NEXT-001` URL-saving MVP scope is documented in `docs/mvp-scope.md` and `docs/product-spec.md`.
- `NEXT-001` was aligned with the near-autonomous automation goal so future role review, automated PR review, QA, and DocsSync loops can consume stable MVP requirements.

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
- `docs/automation-runbook.md`: live-operation instructions for `TaskBoardLoop` and related loops.
- `docs/collaboration-protocol.md`: role collaboration, debate, Orchestrator decision flow, and HumanGate routing.
- `docs/proposal-template.md`: standard proposal format for role-driven work.
- `docs/review-protocol.md`: role review, counterproposal, risk, and recommendation format.
- `docs/decision-log.md`: important decision record and decision template.
- `docs/handoff-protocol.md`: role-to-role handoff format and checks.
- `docs/mvp-scope.md`: smallest URL-saving MVP scope, deferred features, screens, flows, data items, and NEXT-002 handoff.
- `docs/product-spec.md`: Product proposal/spec for the smallest URL-saving MVP and review prompts for other roles.

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
- `docs/automation-runbook.md` contains the exact `TaskBoardLoop` prompt, priority order, Skill selection guide, HumanGate rules, verification rules, and completion output.
- `TaskBoardLoop` should select the first safe `Open` task from `docs/task-board.md`, choose the required Skill, route human-gated items to `docs/feedback-inbox.md`, and otherwise continue through implementation or docs work, verification, review, docs updates, and PR creation.
- This setup did not implement the URL-saving MVP.

## Collaboration Setup

- `Role Collaboration / Debate Protocol` is documented so role chats can operate as professional departments.
- Product can draft proposals, Design / Data Model / Growth / Implementation can review, Orchestrator can synthesize decisions, and Review Gate can check safety and quality before handoff.
- Important decisions should be recorded in `docs/decision-log.md`.
- Role handoffs should use `docs/handoff-protocol.md`.

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

Use `TaskBoardLoop` to select the first open safe item from `docs/task-board.md`. The first selected task should be `NEXT-002`: Data Model drafts the URL-saving Supabase schema/RLS proposal.

## Verification Status

- Live automation setup is docs-only. `npm run verify` passed on 2026-04-29.
- `quick_validate.py` passed for all 11 `.agents/skills/**/SKILL.md` files.
- `.agents/skills/**/SKILL.md` contains no TODO markers and no non-ASCII characters.
- Role collaboration protocol update is docs-only. `npm run verify` passed on 2026-04-29.
- URL-saving MVP scope update is docs-only. Verification is recorded in `docs/review-log.md`.
- URL-saving MVP automation-goal alignment is docs-only. `npm run verify` passed on 2026-04-29.
- Latest local verification passed: lint, typecheck, and build completed successfully.

## Updated

- 2026-04-29
