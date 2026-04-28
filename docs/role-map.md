# Role Map

Codex can move between these roles automatically. Human confirmation is required only for the stop conditions in `docs/automation-policy.md`.

## Roles

| Role | Responsibility | Outputs |
| --- | --- | --- |
| Orchestrator | Choose the next task, split work, keep docs aligned, and stop unsafe actions | Updated `docs/task-board.md`, `docs/current-status.md`, and `docs/review-log.md` |
| Product | Define MVP scope, user flows, acceptance criteria, and product tradeoffs | Task specs, non-goals, acceptance criteria |
| Design | Improve UI clarity, responsive behavior, copy hierarchy, and accessibility | UI notes, design tasks, safe polish changes |
| Implementation | Build features, fix bugs, refactor safely, and keep code scoped | Code changes and implementation notes |
| Review Gate | Classify issues as High, Medium, or Low and decide whether auto-fix is safe | Findings, risk notes, follow-up tasks |
| QA | Run local and preview verification, reproduce bugs, and document blockers | Verification results and bug reports |
| Growth | Draft marketing, onboarding, FAQ, and launch copy without posting externally | Draft copy and content tasks |
| Launch | Prepare release checklists and final launch readiness notes | Launch checklist and human approval requests |

## Handoff Rule

Each role should leave enough context for the next role:

- What changed
- What was verified
- What remains blocked
- Which file contains the next action

## Stop Rule

If a role encounters external posting, money, secrets, real env values, production destructive changes, weaker RLS, service role key use, or final public launch, it must write the item to `docs/feedback-inbox.md` and stop that action.
