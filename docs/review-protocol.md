# Review Protocol

Use this protocol when one role reviews another role's proposal, plan, implementation, copy, launch checklist, or handoff.

## Review Goals

- Improve the proposal from the reviewing role's professional perspective.
- Identify contradictions, missing constraints, unclear scope, and safety issues.
- Separate blocking concerns from optional improvements.
- Give Orchestrator decision-ready recommendations.

## Review Format

| Field | Content |
| --- | --- |
| Review ID | `REV-YYYY-MM-DD-###` |
| Date |  |
| Reviewer Role |  |
| Reviewed Proposal / Task |  |
| Recommendation | `Approve`, `Approve with changes`, `Request revision`, `Block for HumanGate`, or `Defer` |
| Confidence | `High`, `Medium`, or `Low` |

## Required Sections

### Agreement

List what the reviewer supports.

### Concerns

List concerns by severity:

- High: blocks approval or creates policy/security/verification risk.
- Medium: should be fixed before implementation.
- Low: useful improvement but not blocking.

### Counterproposal Or Improvement

Describe the smallest change that would address the concern.

### Risk If Ignored

Explain what could go wrong if the concern is not addressed.

### Final Recommendation

Choose one:

- `Approve`: ready for Orchestrator integration.
- `Approve with changes`: safe if listed changes are applied.
- `Request revision`: proposal needs another author pass before decision.
- `Block for HumanGate`: unsafe action must be routed to `docs/feedback-inbox.md`.
- `Defer`: valid idea, but not needed for the selected task.

## Role-Specific Review Checks

| Reviewer Role | Must Check |
| --- | --- |
| Product | User value, MVP focus, acceptance criteria, non-goals, and tradeoffs |
| Design | Flow clarity, hierarchy, responsiveness, accessibility, and UI copy implications |
| Data Model | Entities, ownership boundaries, Supabase safety, RLS posture, and migration risk |
| Implementation | Feasibility, affected files, complexity, coupling, and verification path |
| Review Gate | Policy compliance, contradiction risk, docs drift, verification status, and HumanGate triggers |
| QA | Testability, repro steps, acceptance coverage, local/CI/preview verification |
| Growth | Claim safety, onboarding clarity, audience fit, FAQ and launch-copy implications |
| Launch | Readiness, rollback notes, known limitations, and human approval requirements |

## Review Gate Authority

Review Gate may return:

- `Pass`: no blocking findings.
- `Pass with follow-up`: safe to continue, with tracked follow-up.
- `Needs safe fix`: role can fix automatically under `AutoFixAllowed`.
- `Blocked by HumanGate`: stop the unsafe action and write to `docs/feedback-inbox.md`.

## Review Logging

Record important review outcomes in `docs/review-log.md`, especially when:

- A proposal is approved with changes.
- Review Gate finds a risk.
- Verification passes or fails.
- A HumanGate item is routed.
- A role conflict is resolved by Orchestrator.
