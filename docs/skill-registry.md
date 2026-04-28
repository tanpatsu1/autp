# Skill Registry

Skill names are English and describe reusable Codex work modes for autp.

| Skill name | Purpose | When to use | Status | Related docs |
| --- | --- | --- | --- | --- |
| `autp-orchestrator` | Select the next safe task and route work across autp roles. | Task prioritization, role decomposition, status coordination, and HumanGate routing. | active | `docs/task-board.md`, `docs/role-map.md`, `docs/automation-policy.md`, `docs/feedback-inbox.md` |
| `autp-skill-discovery` | Audit and improve the autp skill set. | Inspecting `.agents/skills/`, proposing missing skills, and maintaining this registry. | active | `.agents/skills/`, `docs/skill-discovery-log.md`, `docs/role-map.md` |
| `autp-product` | Define MVP scope, user flows, acceptance criteria, and product tradeoffs. | URL-saving scope, category/tag/memo/favorite behavior, onboarding decisions, and non-goals. | active | `docs/task-board.md`, `docs/current-status.md`, `docs/compact-context.md` |
| `autp-design` | Guide bright, clean, accessible UI and UX improvements. | Layout, responsive polish, empty states, filters, list/card views, and copy hierarchy. | active | `docs/role-map.md`, `docs/verification-loop.md`, `AGENTS.md` |
| `autp-data-model` | Draft safe data models, Supabase schema notes, and RLS proposals. | Saved URL schema, category/tag relationships, account separation planning, and migration drafts. | active | `docs/automation-policy.md`, `docs/task-board.md`, `lib/` |
| `autp-implementation` | Make small, verifiable Next.js, TypeScript, Supabase, docs, and CI changes. | Feature implementation, bug fixes, UI improvements, lint/typecheck/build fixes, and README updates. | active | `docs/verification-loop.md`, `docs/current-status.md`, `package.json` |
| `autp-review-gate` | Review changes for bugs, policy violations, missing checks, and docs drift. | Before marking work done, after code changes, after CI fixes, or after launch/documentation updates. | active | `docs/review-log.md`, `docs/automation-policy.md`, `docs/verification-loop.md` |
| `autp-qa` | Verify local and preview behavior. | Running lint, typecheck, build, tests, browser checks, preview checks, and bug reproduction. | active | `docs/verification-loop.md`, `docs/review-log.md`, `docs/current-status.md` |
| `autp-growth` | Draft growth, onboarding, FAQ, launch, and marketing copy without posting externally. | Local copy drafts, README messaging, onboarding text, FAQ, and launch draft content. | active | `docs/automation-policy.md`, `docs/feedback-inbox.md`, `docs/task-board.md` |
| `autp-launch` | Prepare release readiness while gating final public launch. | Launch checklists, preview readiness, known limitations, rollback notes, and final approval requests. | active | `docs/verification-loop.md`, `docs/feedback-inbox.md`, `docs/review-log.md` |
| `autp-automation-runner` | Execute routine autonomous maintenance and safe task-board progress. | Periodic automation, CI fixes, review feedback, docs drift, verification gaps, and safe improvements. | active | `docs/task-board.md`, `docs/automation-policy.md`, `docs/compact-context.md` |

## Proposed Skills

No additional role skills are proposed in this pass. Use `autp-skill-discovery` when a repeated workflow appears that is not covered by the active skills.

## Deprecated Skills

No deprecated autp skills are recorded.

## Skill Rule

Skills may run automatically unless they hit `HumanConfirmationRequired`.
