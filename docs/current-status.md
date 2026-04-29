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
- `docs/collaboration-protocol.md`: role collaboration, debate, Orchestrator decision flow, and HumanGate routing.
- `docs/proposal-template.md`: standard proposal format for role-driven work.
- `docs/review-protocol.md`: role review, counterproposal, risk, and recommendation format.
- `docs/decision-log.md`: important decision record and decision template.
- `docs/handoff-protocol.md`: role-to-role handoff format and checks.
- `docs/mvp-scope.md`: smallest URL-saving MVP scope, deferred features, screens, flows, data items, and NEXT-002 handoff.
- `docs/product-spec.md`: Product proposal/spec for the smallest URL-saving MVP and review prompts for other roles.

## Open Issues

- Supabase live connection is not verified.
- Final public production launch remains blocked by `HumanConfirmationRequired`.

## Next Task

Use `TaskBoardLoop` to select the first open safe item from `docs/task-board.md`. The first selected task should be `NEXT-002`: Data Model drafts the URL-saving Supabase schema and RLS proposal in docs only from `docs/mvp-scope.md` and `docs/product-spec.md`, unless a newer safe `Now` task appears.

## Verification Status

- Role collaboration protocol update is docs-only. `npm run verify` passed on 2026-04-29.
- URL-saving MVP scope update is docs-only. Verification is recorded in `docs/review-log.md`.

## Updated

- 2026-04-29
