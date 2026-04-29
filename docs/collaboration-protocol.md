# Role Collaboration / Debate Protocol

This protocol makes each Codex chat act as a professional project role while still incorporating review, disagreement, and handoff from other roles.

## Purpose

- Keep role responsibilities explicit.
- Make proposals easy to review.
- Make dissent useful instead of noisy.
- Let the Orchestrator integrate opinions into one safe decision.
- Record important decisions in `docs/decision-log.md`.
- Route `HumanConfirmationRequired` items to `docs/feedback-inbox.md`.

## Operating Principles

- Work stays small, reversible, and aligned with `AutomationFoundation`.
- Debate is role-based: each role argues from its professional responsibility, not personal preference.
- A role may challenge another role only with a concrete risk, missed requirement, better option, or clearer tradeoff.
- The Orchestrator decides only after checking Product value, UX clarity, data safety, implementation cost, QA confidence, growth impact, launch risk, and Review Gate findings.
- Review Gate can stop or redirect work when it finds safety, policy, verification, or contradiction risks.
- App implementation starts only after the proposal, review, decision, and handoff steps are complete.

## Role Responsibilities

| Role | Primary Responsibility | Must Produce | Must Challenge |
| --- | --- | --- | --- |
| Orchestrator | Select safe tasks, route roles, integrate debate, make final operational decisions, and keep docs aligned | Decision summary, selected path, next owner, docs updates | Scope drift, unresolved conflict, missing HumanGate routing |
| Product | Define user problem, MVP scope, user flows, acceptance criteria, non-goals, and tradeoffs | Product proposal or spec | Overbuilding, unclear value, missing acceptance criteria |
| Design | Define UX structure, visual clarity, responsive behavior, accessibility, and copy hierarchy | Design review or UI guidance | Confusing flows, poor hierarchy, inaccessible patterns |
| Data Model | Define safe data shape, Supabase schema proposals, account boundaries, RLS posture, and migration notes | Data review or schema proposal | Unsafe data access, weak RLS, destructive DB actions |
| Implementation | Estimate feasibility, identify affected files, implement only approved scoped work, and keep changes verifiable | Implementation plan, patch, or feasibility review | Ambiguous requirements, risky coupling, missing verification path |
| Review Gate | Review scope, policy, security, docs drift, verification, and contradictions before closure | Findings, risk classification, pass/follow-up decision | Any unsafe action, unverified claim, policy violation |
| QA | Define and run verification for local, CI, preview, and browser behavior when relevant | Verification plan and result | Missing tests, unclear repro, unverified acceptance criteria |
| Growth | Draft positioning, onboarding, FAQ, and launch copy locally without posting externally | Growth review or copy draft | Misleading claims, unsupported value props, external posting risk |
| Launch | Prepare readiness, known limitations, rollback notes, and human approval requests | Launch checklist or readiness review | Final public launch without human confirmation |

## Collaboration Flow

1. Product writes a proposal using `docs/proposal-template.md`.
2. Design, Data Model, Growth, and Implementation review the proposal using `docs/review-protocol.md`.
3. Product revises or responds to material objections.
4. Orchestrator integrates the opinions and selects one of: `Accepted`, `Accepted with changes`, `Needs revision`, `Deferred`, or `Blocked by HumanGate`.
5. Review Gate checks the integrated decision for policy, safety, contradiction, docs drift, and verification gaps.
6. Orchestrator records important decisions in `docs/decision-log.md`.
7. The outgoing role creates a handoff using `docs/handoff-protocol.md`.
8. Implementation starts only after the decision and handoff identify the approved scope.

## Debate Rules

Each review or counterproposal must include:

- Role perspective.
- Agreement points.
- Concerns or objections.
- Proposed improvement.
- Risk if ignored.
- Final recommendation.

Allowed recommendations:

- `Approve`
- `Approve with changes`
- `Request revision`
- `Block for HumanGate`
- `Defer`

## Orchestrator Decision Rule

The Orchestrator should choose the option that best satisfies these priorities, in order:

1. Complies with `docs/automation-policy.md`.
2. Avoids `HumanConfirmationRequired` actions unless routed to `docs/feedback-inbox.md`.
3. Advances the selected task from `docs/task-board.md`.
4. Preserves MVP focus and avoids full URL-saving implementation during foundation work.
5. Keeps implementation small and verifiable.
6. Resolves material objections or explicitly records why they were not selected.
7. Leaves a clear next owner and handoff.

## HumanGate Rule

If any role identifies SNS posting, external public posting, billing, purchases, paid plan changes, domain purchases, production data deletion, DB table deletion, weaker RLS, secret exposure, real env values, service role key use, or final public production launch, that role must:

1. Stop that action.
2. Add a complete entry to `docs/feedback-inbox.md`.
3. Mark the proposal, review, decision, or handoff as `Blocked by HumanGate`.

## Minimum Record Set

For every meaningful collaboration cycle, update:

- Proposal or spec: usually a product or role-specific docs file.
- Reviews: inline in the proposal, a linked review note, or `docs/review-log.md`.
- Decision: `docs/decision-log.md` for important choices.
- Handoff: the target docs file or `docs/review-log.md`.
- Status: `docs/current-status.md` and `docs/task-board.md` when the task state changes.

## Next Intended Use

The next safe use of this protocol is `NEXT-001`: Product drafts the smallest URL-saving MVP scope. Design, Data Model, Growth, and Implementation review it before Orchestrator records the decision and hands approved scope to Implementation.
