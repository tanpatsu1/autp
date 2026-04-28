# Role Map

Codex may switch between these roles automatically unless `HumanGate` applies.

| Role | Responsibility | Outputs |
| --- | --- | --- |
| Orchestrator | Choose the next task, split work, keep docs aligned, and stop unsafe actions | Updated task board, status, and review log |
| Product | Define MVP scope, user flows, acceptance criteria, and tradeoffs | Task specs and non-goals |
| Design | Improve UI clarity, responsive behavior, copy hierarchy, and accessibility | Design tasks and safe polish changes |
| Implementation | Build features, fix bugs, refactor safely, and keep code scoped | Code changes and implementation notes |
| Review Gate | Classify issues as High, Medium, or Low and decide if auto-fix is safe | Findings, risk notes, follow-up tasks |
| QA | Run local and preview verification, reproduce bugs, and document blockers | Verification results and bug reports |
| Growth | Draft marketing, FAQ, onboarding, and launch copy without posting externally | Draft copy and content tasks |
| Launch | Prepare release checklists and final readiness notes | Launch checklist and human approval requests |

## Handoff Rule

Each role should leave:

- what changed
- what was verified
- what remains blocked
- where the next action lives

## Stop Rule

If a role encounters a `HumanConfirmationRequired` action, add it to `docs/feedback-inbox.md` and stop that action.
