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

### DEC-2026-05-05-001 - Adopt Skill Consolidation v1 Shortcuts

| Field | Content |
| --- | --- |
| Date | 2026-05-05 |
| Status | Accepted |
| Decider | Orchestrator |
| Roles Consulted | Automation Architect, Skill Discovery, QA, Review Gate |
| Context | Future autp work should require less pasted prompt text for repeated Review Gate, QA, PR fix, Supabase-RLS review, conflict fix, and next-task selection operations. |
| Options Considered | Keep long prompts; create many new skills immediately; consolidate into short prompts and runbook shortcuts first, then propose new skills only for repeated gaps. |
| Decision | Adopt `docs/skill-consolidation-v1.md`, micro prompts in `docs/short-prompt-templates.md`, expanded operation reading sets in `docs/docs-reading-map.md`, and runbook shortcuts in `docs/automation-runbook.md`. |
| Rationale | Existing `autp-review-gate`, `autp-qa`, and `autp-orchestrator` skills already cover common work. A lighter prompt layer reduces token load while keeping policy, `npm run pr-ready`, `npm run verify`, and HumanGate visible. |
| Risks / Tradeoffs | Short prompts depend on Codex correctly honoring project docs; Review Gate and `npm run pr-ready` remain required to catch scope, secret, conflict, and high-risk-area issues. |
| Follow-up | Consider future `autp-supabase-rls-review` and `autp-fix-pr` skills if those workflows repeat often. |
| Links | `docs/skill-consolidation-v1.md`, `docs/short-prompt-templates.md`, `docs/docs-reading-map.md`, `docs/automation-runbook.md`, `docs/task-board.md`, `docs/current-status.md`, `docs/review-log.md` |

### DEC-2026-04-30-001 - Adopt Read-only PR Readiness Check

| Field | Content |
| --- | --- |
| Date | 2026-04-30 |
| Status | Accepted |
| Decider | Orchestrator |
| Roles Consulted | Automation Architect, Implementation, QA, Review Gate |
| Context | `NEXT-017` needed a short read-only way to decide PR readiness before Review Gate without repeatedly loading long prompts or every project doc. |
| Options Considered | Keep manual PR preflight checks; add a GitHub Action; add a local read-only npm script plus compact docs and prompt templates. |
| Decision | Add `npm run pr-ready` as a local read-only preflight that reports branch, changed files, blockers, High/Medium/Low risk, Review Gate need, and the next verification command. |
| Rationale | A local script gives Codex a concise readiness summary without modifying repo state or calling external services, and it avoids adding GitHub Actions or running heavy verification by default. |
| Risks / Tradeoffs | Secret detection is heuristic and may produce false positives or miss unusual formats, so Review Gate and `npm run verify` still remain required before completion. |
| Follow-up | Use `npm run pr-ready` before Review Gate and PR creation; update the script if repeated false positives or missing risk categories appear. |
| Links | `scripts/pr-ready-check.mjs`, `docs/pr-readiness-check.md`, `docs/short-prompt-templates.md`, `docs/docs-reading-map.md`, `docs/review-log.md` |

### DEC-2026-04-29-005 - Adopt URL Saving Data Model And RLS Proposal

| Field | Content |
| --- | --- |
| Date | 2026-04-29 |
| Status | Accepted |
| Decider | Orchestrator |
| Roles Consulted | Product, Data Model, Implementation, QA, Review Gate |
| Context | `NEXT-002` needed a docs-only Supabase data model and RLS proposal for the private URL Saving MVP before implementation begins. |
| Options Considered | Store category and tags as plain fields on `saved_urls`; use normalized `categories`, `tags`, and `saved_url_tags`; add persistent user display preferences in the first schema. |
| Decision | Use `saved_urls`, `categories`, `tags`, and `saved_url_tags` as the MVP schema proposal; keep card/list display mode as UI state for the MVP; require owner-scoped RLS for all user-owned rows. |
| Rationale | Normalized categories and tags keep search/filter behavior reviewable without overloading `saved_urls`, while deferring `user_preferences` avoids schema work that is not needed for the first card/list toggle. |
| Risks / Tradeoffs | The normalized tag model requires join queries and slightly more implementation work, but it avoids array search ambiguity and cross-user label leakage. |
| Follow-up | `NEXT-003`: Implementation builds the private URL Saving MVP from the accepted Product scope and reviewed Data Model / Supabase Schema / RLS docs. |
| Links | `docs/data-model.md`, `docs/supabase-schema.md`, `docs/rls-policy.md`, `docs/mvp-scope.md`, `docs/product-spec.md`, `docs/review-log.md`, `docs/task-board.md` |

### DEC-2026-04-29-004 - Align URL Saving MVP Scope With Automation Goal

| Field | Content |
| --- | --- |
| Date | 2026-04-29 |
| Status | Accepted with changes |
| Decider | Orchestrator |
| Roles Consulted | Product, Data Model, Implementation, QA, Review Gate, Automation |
| Context | After `DEC-2026-04-29-003`, `NEXT-001` needed a follow-up pass to ensure the MVP scope does not contradict the near-autonomous safe development goal. |
| Options Considered | Leave MVP scope unchanged; add automation-only implementation work to MVP; keep the MVP manual and private while making the docs and NEXT-002 handoff automation-ready. |
| Decision | Keep the first URL-saving MVP manual, private, and docs-only for `NEXT-001`, while adding explicit compatibility with future role council review, PR auto-review, Vercel/Supabase diagnostics, and DocsSync loops. |
| Rationale | This preserves the smallest useful MVP and avoids implementation or HumanGate actions, while giving future automation enough stable requirements, data fields, acceptance criteria, and handoff notes to operate safely. |
| Risks / Tradeoffs | The MVP still does not include automatic scraping or AI classification, so user effort is higher at first; these features can be proposed later through reviewed automation loops. |
| Follow-up | `NEXT-002`: Data Model drafts an automation-ready Supabase schema/RLS proposal with generated type expectations, RLS test cases, migration and rollback notes, search/index notes, and Supabase Preview diagnostic boundaries. |
| Links | `docs/mvp-scope.md`, `docs/product-spec.md`, `docs/automation-policy.md`, `docs/automation-runbook.md`, `docs/automation-registry.md`, `docs/task-board.md`, `docs/review-log.md` |

### DEC-2026-04-29-003 - Adopt Near-Autonomous Safe Development Goal

| Field | Content |
| --- | --- |
| Date | 2026-04-29 |
| Status | Accepted |
| Decider | Orchestrator |
| Roles Consulted | Product, Design, Data Model, Implementation, QA, Review Gate, Automation |
| Context | autp needs a clear final automation goal that goes beyond manual prompts while preserving safety gates for dangerous actions. |
| Options Considered | Keep on-demand `TaskBoardLoop` only; fully automate every action including dangerous operations; pursue near-autonomous safe development with strict HumanGate boundaries. |
| Decision | Adopt near-autonomous safe development as the automation goal: Codex should periodically discover tasks, run docs-based role reviews, create safe PRs, investigate CI/Vercel/Supabase-preview failures, and update docs automatically, while humans approve direction, dangerous changes, and final production launch. |
| Rationale | This gives autp a clear automation north star without allowing unattended billing, secrets, production DB changes, weaker RLS, external posting, or launch execution. |
| Risks / Tradeoffs | More automation requires stronger review records and diagnostics, but the HumanGate keeps dangerous actions out of unattended execution. |
| Follow-up | `NEXT-005`: Automation designs the implementation plan for scheduled discovery, role council review, PR merge-candidate checks, Vercel failure diagnosis, Supabase preview diagnostics, and docs sync. |
| Links | `docs/automation-policy.md`, `docs/automation-registry.md`, `docs/automation-runbook.md`, `docs/task-board.md`, `docs/current-status.md`, `docs/review-log.md` |

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
