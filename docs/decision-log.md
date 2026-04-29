# Decision Log

Record important product, design, data, implementation, launch, and automation decisions here.

## Decision Rules

Add an entry when a decision:

- Changes MVP scope, role responsibility, data model direction, implementation approach, launch readiness, or automation behavior.
- Resolves a disagreement between roles.
- Accepts a risk or rejects an alternative.
- Blocks work for `HumanConfirmationRequired`.

Do not record routine typo fixes, formatting changes, or purely mechanical updates unless they affect project direction.

## Entry Format

| Field | Content |
| --- | --- |
| ID | `DEC-YYYY-MM-DD-###` |
| Date | Decision date |
| Status | `Accepted`, `Accepted with changes`, `Needs revision`, `Deferred`, or `Blocked by HumanGate` |
| Decider | Usually Orchestrator |
| Roles Consulted | Product, Design, Data Model, Implementation, Review Gate, QA, Growth, Launch, or other relevant roles |
| Context | What problem or proposal was being decided |
| Options Considered | Main alternatives |
| Decision | Selected path |
| Rationale | Why this path won |
| Risks / Tradeoffs | Known downsides |
| Follow-up | Next owner and action |
| Links | Related docs, PR, issue, or review log entry |

## Decisions

### DEC-2026-04-29-001 - Adopt Role Collaboration / Debate Protocol

| Field | Content |
| --- | --- |
| Date | 2026-04-29 |
| Status | Accepted |
| Decider | Orchestrator |
| Roles Consulted | Product, Design, Data Model, Implementation, Review Gate, QA, Growth, Launch |
| Context | autp needs a repeatable way for Codex chats to act as professional roles, review each other, disagree constructively, and hand off approved work. |
| Options Considered | Keep informal role switching; add role map only; create a complete proposal, debate, decision, and handoff protocol. |
| Decision | Create the Role Collaboration / Debate Protocol and require proposals, role reviews, Orchestrator decisions, Review Gate checks, decision logging, and handoffs before implementation. |
| Rationale | A complete protocol lets Product start `NEXT-001` with clear review inputs while keeping AutomationFoundation safety rules intact. |
| Risks / Tradeoffs | More process is required before implementation, but it reduces unclear scope, unsafe decisions, and role drift. |
| Follow-up | Product should draft the smallest URL-saving MVP scope using `docs/proposal-template.md`; other roles should review through `docs/review-protocol.md`. |
| Links | `docs/collaboration-protocol.md`, `docs/proposal-template.md`, `docs/review-protocol.md`, `docs/handoff-protocol.md`, `docs/task-board.md` |

## Template

### DEC-YYYY-MM-DD-### - Title

| Field | Content |
| --- | --- |
| Date |  |
| Status |  |
| Decider |  |
| Roles Consulted |  |
| Context |  |
| Options Considered |  |
| Decision |  |
| Rationale |  |
| Risks / Tradeoffs |  |
| Follow-up |  |
| Links |  |
