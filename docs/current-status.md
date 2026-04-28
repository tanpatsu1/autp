# Current Status

## Project

- Repository: `tanpatsu1/autp`
- Framework target: Next.js App Router
- Language: TypeScript
- Deploy target: Vercel
- Database/client target: Supabase

## Current Setup

- Minimal Next.js application structure is present.
- Supabase browser client helper is present.
- Secret values are not committed.
- Local `.env.local` is intentionally not included.
- Automation policy is added in `docs/automation-policy.md`.
- Task management docs are added for autonomous operation.
- CI workflow is present in `.github/workflows/ci.yml`.
- `package.json` has `lint`, `typecheck`, `build`, and `verify` scripts.

## Automation Docs

- `docs/task-board.md`: source for Now / Next / Later / Blocked task selection.
- `docs/feedback-inbox.md`: human-confirmation queue and unresolved decisions.
- `docs/review-log.md`: work history, verification status, and next recommendation.
- `docs/compact-context.md`: short shared context for future Codex runs.
- `docs/verification-loop.md`: lint / typecheck / build / Vercel verification flow.
- `docs/role-map.md`: Orchestrator, Product, Design, Implementation, Review Gate, QA, Growth, and Launch responsibilities.
- `docs/skill-registry.md`: active, proposed, and deprecated autp Skill inventory.
- `docs/skill-discovery-log.md`: record of Skill audits, findings, proposals, and actions.

## Role Skills

- `.agents/skills/autp-orchestrator/SKILL.md`: task selection, role routing, and human-confirmation routing.
- `.agents/skills/autp-skill-discovery/SKILL.md`: Skill auditing, registry maintenance, and future Skill proposals.
- `.agents/skills/autp-product/SKILL.md`: MVP scope, acceptance criteria, product tradeoffs, and product handoffs.
- `.agents/skills/autp-design/SKILL.md`: bright, clean UI/UX guidance, accessibility, and responsive polish.
- `.agents/skills/autp-data-model/SKILL.md`: safe data-model, Supabase schema, and RLS proposal workflow.
- `.agents/skills/autp-implementation/SKILL.md`: small, verifiable implementation and CI/build fixes.
- `.agents/skills/autp-review-gate/SKILL.md`: bug-first review, policy checks, verification gaps, and docs drift checks.
- `.agents/skills/autp-qa/SKILL.md`: local, preview, browser, and command-based verification workflow.
- `.agents/skills/autp-growth/SKILL.md`: local growth, onboarding, FAQ, and launch copy drafts without external posting.
- `.agents/skills/autp-launch/SKILL.md`: release-readiness preparation with final public launch gated by human approval.
- `.agents/skills/autp-automation-runner/SKILL.md`: routine safe automation cycles for task-board progress, CI fixes, review feedback, and docs upkeep.

## Automation Policy

- Mode: aggressive automation.
- Default: Codex proceeds automatically for implementation, fixes, docs, CI, review, copy drafts, task-board updates, and next-task selection.
- Stop only for: external public posting, money-related actions, secrets, destructive production changes, RLS weakening, service role key use, and final public production launch.

## Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Open Issues

- Local `npm run verify` could not run in the Codex desktop environment because `npm` is not available on PATH.
- Supabase live connection is not verified.

## Verification Status

- GitHub Actions CI for PR #3 completed successfully on 2026-04-28.
- Role Skill validation completed on 2026-04-28: all 11 `.agents/skills/**/SKILL.md` files passed `quick_validate.py`.
- `npm run lint`, `npm run typecheck`, and `npm run build` could not run locally because `npm` is not available on PATH in this Codex desktop environment.

## Next Step

Open the requested PR from `codex/role-skills`, then use `autp-orchestrator` or `autp-automation-runner` to continue with the next safe MVP task from `docs/task-board.md`.

## Updated

- 2026-04-28
