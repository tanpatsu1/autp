# Handoff Protocol

Use this protocol when one role finishes work and another role should continue.

## Purpose

- Preserve context between Codex chats.
- Make the next action obvious.
- Prevent implementation before proposal, review, and decision steps are complete.
- Record blockers and HumanGate items without performing unsafe actions.

## When To Write A Handoff

Write a handoff when:

- Product finishes a proposal or spec for Design, Data Model, Growth, Implementation, QA, or Review Gate.
- A reviewing role finds a material objection or approves with changes.
- Orchestrator makes a decision and assigns the next owner.
- Review Gate passes work to QA or back to a role for fixes.
- QA records verification results or blockers.
- Launch or Growth reaches a human-confirmation boundary.

## Handoff Format

| Field | Content |
| --- | --- |
| Date |  |
| From Role |  |
| To Role |  |
| Related Task | Task-board ID or proposal ID |
| Status | `Ready`, `Needs revision`, `Blocked`, or `Done` |
| Summary | What changed or was decided |
| Approved Scope | What the next role may do |
| Out of Scope | What the next role must not do |
| Key Decisions | Decision-log IDs or short summary |
| Open Questions | Questions the next role must resolve |
| Verification | Checks already run or required |
| HumanGate Items | Link to `docs/feedback-inbox.md` entries, or `None` |
| Next Action | One concrete next step |

## Required Handoff Checks

Before handing work to another role, confirm:

- The next owner is named.
- The next action is concrete.
- Scope and non-goals are explicit.
- HumanGate items are routed to `docs/feedback-inbox.md`.
- Important decisions are recorded in `docs/decision-log.md`.
- Verification requirements are clear.
- The handoff does not include real env values, secrets, production DB changes, paid actions, external posting, or final public launch.

## Standard Role Paths

| From | To | Handoff Purpose |
| --- | --- | --- |
| Product | Design | Confirm flow clarity, layout implications, copy hierarchy, and accessibility concerns |
| Product | Data Model | Confirm data entities, account boundaries, RLS posture, and migration safety |
| Product | Growth | Confirm positioning, onboarding clarity, and claim safety |
| Product | Implementation | Confirm feasibility, affected files, risks, and verification path |
| Design / Data Model / Growth / Implementation | Product | Return objections, required changes, or approval notes |
| Orchestrator | Review Gate | Ask for final safety, policy, contradiction, and docs-drift review |
| Review Gate | Implementation | Send approved scope or required fixes |
| Implementation | QA | Request verification for the approved implemented scope |
| QA | Review Gate | Report pass, failure, or blocker |
| Launch / Growth | Feedback Inbox | Route public posting, final launch, billing, domain, or paid action requests |

## Example Handoff

| Field | Content |
| --- | --- |
| Date | 2026-04-29 |
| From Role | Orchestrator |
| To Role | Product |
| Related Task | `NEXT-001` |
| Status | Ready |
| Summary | Role Collaboration / Debate Protocol is documented and ready for MVP scoping. |
| Approved Scope | Draft smallest URL-saving MVP scope in docs only. |
| Out of Scope | No app implementation, no production DB changes, no real env values, no public launch. |
| Key Decisions | `DEC-2026-04-29-001` |
| Open Questions | Which URL-saving behaviors are mandatory for the first MVP spec? |
| Verification | Use Review Gate after the Product proposal and run `npm run verify` after doc changes when tooling is available. |
| HumanGate Items | None |
| Next Action | Product writes the MVP scope proposal using `docs/proposal-template.md`. |
