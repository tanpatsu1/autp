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

### DEC-2026-04-29-004 - Align URL Saving MVP Scope With Automation Goal

| Field | Content |
| --- | --- |
| Date | 2026-04-29 |
| Status | Accepted with changes |
| Decider | Orchestrator |
| Roles Consulted | Product, Data Model, Implementation, QA, Review Gate, Automation |
| Context | After the latest automation goal update, `NEXT-001` needed a follow-up pass to ensure the MVP scope does not contradict near-autonomous safe development. |
| Options Considered | Leave MVP scope unchanged; add automation-only implementation work to MVP; keep the MVP manual and private while making the docs and NEXT-002 handoff automation-ready. |
| Decision | Keep the first URL-saving MVP manual, private, and docs-only for `NEXT-001`, while adding explicit compatibility with future role council review, PR auto-review, Vercel/Supabase diagnostics, and DocsSync loops. |
| Rationale | This preserves the smallest useful MVP and avoids implementation or HumanGate actions, while giving future automation enough stable requirements, data fields, acceptance criteria, and handoff notes to operate safely. |
| Risks / Tradeoffs | The MVP still does not include automatic scraping or AI classification, so user effort is higher at first; these features can be proposed later through reviewed automation loops. |
| Follow-up | `NEXT-002`: Data Model drafts an automation-ready Supabase schema/RLS proposal with generated type expectations, RLS test cases, migration and rollback notes, search/index notes, and Supabase Preview diagnostic boundaries. |
| Links | `docs/mvp-scope.md`, `docs/product-spec.md`, `docs/automation-policy.md`, `docs/automation-runbook.md`, `docs/automation-registry.md`, `docs/task-board.md`, `docs/review-log.md` |


### DEC-2026-04-29-002 - Define Smallest URL Saving MVP Scope

| Field | Content |
| --- | --- |
| Date | 2026-04-29 |
| Status | Accepted |
| Decider | Orchestrator |
| Roles Consulted | Product, Design, Data Model, Implementation, Review Gate, QA, Growth, Launch |
| Context | `NEXT-001` required a docs-only definition of the smallest URL-saving MVP before schema or implementation work begins. |
| Options Considered | Minimal manual URL manager; URL manager with automatic metadata fetching; public collections/sharing; vertical-specific modes from day one. |
| Decision | The first MVP is a private manual URL manager with URL registration, title, one category, tags, memo, favorite, list display, search, and card/list view toggle. Public sharing, SNS posting, billing, browser extension, automatic metadata scraping, and vertical modes are deferred. |
| Rationale | This scope proves the core save, organize, find, and review loop while keeping the next schema task small, safe, and reviewable. |
| Risks / Tradeoffs | The first MVP is less automated and less growth-oriented, but avoids HumanGate actions, production DB changes, and scope drift before the data model is reviewed. |
| Follow-up | `NEXT-002`: Data Model drafts the URL-saving Supabase schema and RLS proposal in docs only, including ownership, category/tag modeling, search/index strategy, and migration safety. |
| Links | `docs/mvp-scope.md`, `docs/product-spec.md`, `docs/task-board.md`, `docs/review-log.md` |

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
