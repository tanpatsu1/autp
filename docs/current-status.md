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
- `npm run pr-ready` is defined as a read-only PR readiness preflight.
- Local `npm run verify` passes.
- GitHub Actions CI is added at `.github/workflows/ci.yml`.
- `TaskBoardLoop`, `HumanGate`, `ReviewGate`, and `VerificationLoop` are documented as the default operating loops.
- Role Collaboration / Debate Protocol docs are added for proposal, review, decision, handoff, and cross-role debate.
- `NEXT-001` URL-saving MVP scope is documented in `docs/mvp-scope.md` and `docs/product-spec.md`.
- `NEXT-002` URL-saving data model, Supabase schema proposal, and RLS policy proposal are documented in docs only.

## Automation Docs

- `docs/automation-policy.md`: default automation policy and human stop rules.
- `docs/task-board.md`: Now / Next / Later / Blocked task selection.
- `docs/feedback-inbox.md`: human-confirmation queue.
- `docs/review-log.md`: work history, review gate notes, and verification notes.
- `docs/compact-context.md`: short shared context.
- `docs/role-map.md`: Orchestrator / Product / Design / Implementation / Review Gate / QA / Growth / Launch roles.
- `docs/verification-loop.md`: lint / typecheck / build / Vercel flow.
- `docs/pr-readiness-check.md`: read-only PR readiness, blocker detection, risk level, and Review Gate preflight.
- `docs/short-prompt-templates.md`: compact prompts for PR readiness, Review Gate, TaskBoardLoop, and verification.
- `docs/docs-reading-map.md`: smaller reading sets for PR readiness, Review Gate, QA, and high-risk domains.
- `docs/skill-registry.md`: English skill names and purposes.
- `docs/automation-registry.md`: English automation loop names and triggers.
- `docs/collaboration-protocol.md`: role collaboration, debate, Orchestrator decision flow, and HumanGate routing.
- `docs/proposal-template.md`: standard proposal format for role-driven work.
- `docs/review-protocol.md`: role review, counterproposal, risk, and recommendation format.
- `docs/decision-log.md`: important decision record and decision template.
- `docs/handoff-protocol.md`: role-to-role handoff format and checks.
- `docs/mvp-scope.md`: smallest URL-saving MVP scope, deferred features, screens, flows, data items, and NEXT-002 handoff.
- `docs/product-spec.md`: Product proposal/spec for the smallest URL-saving MVP and review prompts for other roles.
- `docs/data-model.md`: URL Saving MVP entities, relationships, search/listing shape, type expectations, and Implementation handoff.
- `docs/supabase-schema.md`: non-destructive Supabase table, column, index, migration-safety, and preview-diagnostic proposal.
- `docs/rls-policy.md`: Supabase Auth ownership assumptions, RLS policy matrix, invariants, test cases, and Review Gate checks.

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

## Automation Goal

- Final target: near-autonomous AI-driven development with human approval reserved for direction, dangerous changes, unresolved tradeoffs, and final approvals.
- Codex should eventually discover tasks periodically, start the right automation loop, coordinate docs-based role reviews, prepare safe PRs, investigate Vercel failures, detect Supabase Preview Branch limitations, and update docs automatically.
- Product, Design, Data Model, Implementation, QA, and Review Gate should review work in sequence before Orchestrator records decisions and selects follow-up tasks.
- PRs that pass policy, verification, Review Gate, docs, and HumanGate checks can become automatic merge candidates without bypassing repository protections.
- Dangerous actions remain blocked by `HumanConfirmationRequired`.
- This goal update is docs-only and did not add GitHub Actions, code implementation, env values, billing, production DB changes, or production launch.
- `NEXT-001` MVP scope now explicitly stays compatible with this automation goal by keeping the first product boundary deterministic, docs-first, reviewable by future role loops, and safe for automated PR review inputs.

## Open Issues

- Supabase live connection is not verified.
- Final public production launch remains blocked by `HumanConfirmationRequired`.

## Next Task

Use `TaskBoardLoop` to select the first open safe item from `docs/task-board.md`. The first selected task should be `NEXT-003`: Implementation builds the private URL Saving MVP from the accepted Product scope and reviewed Data Model / Supabase Schema / RLS docs, unless a newer safe `Now` task appears.

The next automation-specific task is `NEXT-005`: design the implementation plan for scheduled task discovery, role council review, PR merge-candidate checks, Vercel failure diagnosis, Supabase preview diagnostics, and docs sync.

`NEXT-017` PR readiness check is complete for Automation Foundation v1 / Token Efficiency: it adds `npm run pr-ready`, docs, short prompts, and reading-map guidance without GitHub Actions, app feature changes, env values, Supabase production DB changes, commits, pushes, or PR creation.

## Verification Status

- Automation goal update is docs-only. `npm run verify` passed on 2026-04-29.
- Live automation setup is docs-only. `npm run verify` passed on 2026-04-29.
- `quick_validate.py` passed for all 11 `.agents/skills/**/SKILL.md` files.
- `.agents/skills/**/SKILL.md` contains no TODO markers and no non-ASCII characters.
- `npm run verify` passed locally: lint, typecheck, and build completed successfully.
- Role collaboration protocol update is docs-only. `npm run verify` passed on 2026-04-29.
- URL-saving MVP scope update is docs-only. Verification is recorded in `docs/review-log.md`.
- URL-saving MVP automation-goal alignment is docs-only. Verification is recorded in `docs/review-log.md`.
- URL-saving data model and RLS proposal is docs-only. `npm run verify` passed on 2026-04-29.
- `NEXT-017` PR readiness check: `npm run pr-ready` and `npm run verify` passed on 2026-04-30.

## Updated

- 2026-04-30
