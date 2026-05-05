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

### DEC-2026-05-05-002 - Adopt Token Architecture v1

| Field | Content |
| --- | --- |
| Date | 2026-05-05 |
| Status | Accepted |
| Decider | Orchestrator |
| Roles Consulted | Automation Architect, QA, Review Gate |
| Context | Recent Codex runs reached 100k+ token scale because short prompts alone did not stop broad docs reads, skill reads, log reads, full Review Gate, broad QA, command output, or long final reports. |
| Options Considered | Keep relying on short prompts; add more skills; create a pre-work token architecture that decides reads, Review Gate level, QA scope, and output length before work starts. |
| Decision | Adopt `docs/token-architecture-v1.md`, `docs/context-budget-policy.md`, `docs/context-intake-gate.md`, `docs/task-capsules.md`, and `docs/review-gate-matrix.md`; update the reading map and prompt templates to prioritize capsule / map / diff / targeted search before full docs. |
| Rationale | A mandatory intake gate lets Codex reduce context before reading, while task capsules preserve safety rules and domain handoffs without repeatedly loading long docs. |
| Risks / Tradeoffs | Smaller intake can miss stale context if capsules drift, so high-risk domains still require targeted log/decision searches and domain docs. Full Review Gate remains available only with a written reason. |
| Follow-up | Keep capsules current when repeated workflows appear; consider a future dedicated token-budget skill only if the docs-based gate is not enough. |
| Links | `docs/token-architecture-v1.md`, `docs/context-budget-policy.md`, `docs/context-intake-gate.md`, `docs/task-capsules.md`, `docs/docs-reading-map.md`, `docs/short-prompt-templates.md`, `docs/review-gate-matrix.md`, `docs/review-log.md` |

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

### DEC-2026-04-30-005 - Adopt Read-only PR Readiness Check

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

### DEC-2026-04-30-003 - Defer Category And Tag Delete Policies

| Field | Content |
| --- | --- |
| Date | 2026-04-30 |
| Status | Accepted with changes |
| Decider | QA / Review Gate |
| Roles Consulted | QA, Data Model, Review Gate |
| Context | Post-merge QA found the Supabase/Auth/RLS persistence migration draft allowed authenticated users to delete their own `categories` and `tags`, while the RLS policy proposal defers category/tag deletion until category-management behavior is reviewed. |
| Options Considered | Leave owner-scoped category/tag delete policies because they do not cross user boundaries; remove the policies and privileges until category/tag management is explicitly designed; block the whole persistence implementation. |
| Decision | Remove category/tag delete policy creation from the migration draft and grant authenticated users `select`, `insert`, and `update` only for `categories` and `tags`. Keep saved URL and join-row delete behavior because the app's URL deletion path requires it and remains owner-scoped. |
| Rationale | This keeps the migration draft aligned with the documented RLS posture and narrows the data mutation surface without weakening any required MVP behavior. |
| Risks / Tradeoffs | Orphan category/tag cleanup is deferred until category/tag management is designed. This is acceptable because the app does not currently expose category/tag deletion. |
| Follow-up | `NEXT-015` should verify live Auth, persistence, reload behavior, and two-user RLS denial after a safe local/preview Supabase setup is provided. |
| Links | `supabase/migrations/20260430000000_url_saving_persistence.sql`, `docs/rls-policy.md`, `docs/review-log.md`, `docs/task-board.md` |

### DEC-2026-04-30-004 - Adopt Token Efficiency Audit v1 Reduction Plan

| Field | Content |
| --- | --- |
| Date | 2026-04-30 |
| Status | Accepted |
| Decider | Automation Architect / Orchestrator |
| Roles Consulted | Automation, Review Gate, QA, Skill Discovery |
| Context | Repeated autp work in review logs, decision logs, and task-board entries was increasing prompt length, broad docs loading, and manual PR/verification/review repetition. |
| Options Considered | Keep long prompts and broad docs reading; only add short prompt templates; create a full automation runtime; document Token Efficiency Audit v1 with templates, reading map, Skill candidates, and script candidates. |
| Decision | Adopt Token Efficiency Audit v1 as a docs-only reduction plan. Use short prompt templates and `docs/docs-reading-map.md` for routine work; prioritize `autp-pr-readiness`, `autp-supabase-rls-review`, and read-only helper scripts as follow-up tasks. |
| Rationale | The audit reduces repeated context without hiding safety checks. It keeps HumanGate, Review Gate, verification, Supabase/RLS safety, and PR readiness explicit while avoiding app implementation and GitHub Actions changes. |
| Risks / Tradeoffs | The first pass is advisory; actual token savings depend on future Skills and scripts being created and used consistently. |
| Follow-up | `NEXT-017`: create the first Token Efficiency follow-up by scoping or implementing `autp-pr-readiness` and a read-only `scripts/pr-ready-check` helper. |
| Links | `docs/token-efficiency-audit-v1.md`, `docs/short-prompt-templates.md`, `docs/docs-reading-map.md`, `docs/skill-consolidation-plan.md`, `docs/review-log.md`, `docs/task-board.md` |

### DEC-2026-04-30-002 - Implement Supabase Auth Persistence With RLS Draft

| Field | Content |
| --- | --- |
| Date | 2026-04-30 |
| Status | Accepted with changes |
| Decider | Orchestrator |
| Roles Consulted | Data Model, Implementation, QA, Review Gate |
| Context | `NEXT-010` needed to move the local-first URL Saving MVP toward Supabase Auth, owner-scoped database persistence, RLS, reload/cross-device durability, and the URL-only fast-save baseline without writing env values or changing production DB. |
| Options Considered | Keep localStorage only; block all work until live Supabase is verified; implement a client-side Supabase Auth/persistence path with a non-production migration draft and local demo fallback. |
| Decision | Add Supabase Auth magic-link sign-in and owner-scoped persistence when public Supabase env names are configured. Keep local demo mode when Supabase is not configured. Draft local/preview SQL for `saved_urls`, `categories`, `tags`, `saved_url_tags`, RLS policies, same-owner constraints, `capture_source`, and `organization_state`, but do not run SQL against production. |
| Rationale | This makes the current MVP ready for durable private records while preserving safety: no real env values, no service role key, no production DB change, no RLS weakening, and no external capture-channel scope creep. |
| Risks / Tradeoffs | Live Supabase Auth, migration application, preview schema, and two-user RLS denial are not verified in this automation run because real env values and production DB changes are prohibited. The first implementation uses client-side owner filters plus RLS; a later QA pass must prove policies in a safe Supabase environment. |
| Follow-up | `NEXT-014`: Review Gate / Supabase Persistence Review. Then `NEXT-015`: QA / Vercel / Supabase Verification for sign-in, reload persistence, CRUD/search/favorite, and cross-user denial. |
| Links | `app/saved-url-manager.tsx`, `lib/supabase/saved-urls.ts`, `supabase/migrations/20260430000000_url_saving_persistence.sql`, `docs/data-model.md`, `docs/supabase-schema.md`, `docs/rls-policy.md`, `docs/review-log.md` |

### DEC-2026-04-30-001 - Adopt URL-Only Fast Save As Capture Baseline

| Field | Content |
| --- | --- |
| Date | 2026-04-30 |
| Status | Accepted |
| Decider | Product / Orchestrator |
| Roles Consulted | Product, Design, Data Model, Implementation, Growth, QA, Review Gate |
| Context | `NEXT-009` needed a docs-only baseline for reducing the save-flow friction identified in user direction confirmation before Supabase/Auth/RLS persistence hardens the data and UX assumptions. |
| Options Considered | Keep manual URL paste with full metadata form; adopt URL-only fast save; make title/category/tags/memo required; add optional title fetch; organize later; bookmarklet; Web Share Target; Chrome extension; iframe / embedded browsing. |
| Decision | Adopt URL-only fast save as the initial capture baseline. URL is the only user-required save-time input; title, category, tags, memo, and favorite can be completed later; blank titles use a deterministic URL fallback; uncategorized, untagged, and memo-empty links are valid; iframe / embedded browsing remains research-only. |
| Rationale | This reduces the biggest habit risk while keeping the next implementation small, private, verifiable, and compatible with the existing saved-link model. It also keeps richer capture channels out of the persistence PR until auth, RLS, privacy, and platform review are ready. |
| Risks / Tradeoffs | URL-only saves can create unorganized records, so future design and implementation need a clear "organize later" or "needs review" flow. Optional title fetch, bookmarklet, Web Share Target, and extension work remain valuable but deferred. |
| Follow-up | `NEXT-006` preview verification remains active. `NEXT-010` Supabase/Auth/RLS Persistence should support inserting owner-scoped saved URLs with URL, fallback title, defaults, and timestamps only, and should evaluate `capture_source` and organization state before migrations. |
| Links | `docs/capture-friction-baseline.md`, `docs/product-direction.md`, `docs/roadmap.md`, `docs/feature-priority.md`, `docs/current-status.md`, `docs/task-board.md`, `docs/review-log.md` |

### DEC-2026-04-29-011 - Confirm User Direction For Private Decision Board

| Field | Content |
| --- | --- |
| Date | 2026-04-29 |
| Status | Accepted with changes |
| Decider | User / Orchestrator |
| Roles Consulted | Product Direction Council, Product, Growth, Design, Data Model, Implementation, QA, Automation, Review Gate |
| Context | The user reviewed the Product Direction Council recommendation, the Review Gate result, the User Decision Pack, and weakness / capture-friction analysis before the next major product build. |
| Options Considered | Proceed as an AI-ready private decision board for saved links; lead with fashion / brand board; lead with hospital / life information; build iframe / embedded browsing now; continue as a generic URL manager without capture-friction planning. |
| Decision | Proceed as an AI-ready private decision board for saved links, first entered through shopping / purchase candidates. Keep fashion / brand board as an early template candidate. Defer hospital / life information because privacy, trust, and advice-risk are higher. Treat capture friction, quiet distribution, and AI-discovered weaknesses as planning inputs. Keep iframe / embedded browsing research-only. |
| Rationale | This accepts the council's strongest direction while preserving user control and safety boundaries. Shopping / purchase candidates are clear and lower risk; fashion remains available as a visual early template; sensitive life/hospital workflows need stronger guardrails; capture friction must be addressed before the product can become habitual. |
| Risks / Tradeoffs | Manual URL capture may remain a habit risk until baseline planning and later capture improvements are addressed. The private-board value may be harder to spread without demoable examples. Persistence still needs Auth/RLS verification. |
| Follow-up | Add `NEXT-009` Capture Friction Baseline Planning before or alongside `NEXT-010` Supabase/Auth/RLS Persistence. Add Token Efficiency follow-up docs/rubrics before large AI, template, sharing, or monetization expansion. |
| Links | `docs/user-direction-confirmation.md`, `docs/user-decision-pack.md`, `docs/council/product-direction/synthesis.md`, `docs/council/product-direction/review-gate.md`, `docs/task-board.md`, `docs/review-log.md` |

### DEC-2026-04-29-010 - Synthesize Product Direction Council Recommendation

| Field | Content |
| --- | --- |
| Date | 2026-04-29 |
| Status | Accepted with changes |
| Decider | Orchestrator / Council Synthesis |
| Roles Consulted | Product, Growth, Design, Data Model, Implementation, QA, Automation, Review Gate |
| Context | Product Direction Council role files compared future directions for autp after the URL Saving MVP, including generic URL management, AI bookmarks, fashion/brand, shopping candidates, hospital/life information, student workflows, SNS-found info saving, and broader decision support. |
| Options Considered | Generic URL manager; AI bookmark organizer; fashion / brand manager; shopping candidate manager; hospital / life information manager; student links / assignments / procedures manager; SNS-found product / shop / info saver; broad personal decision workspace; creator / small-team brand link manager. |
| Decision | Adopt a council recommendation, not a final user decision: autp should proceed toward an AI-ready private decision board for saved links, introduced first through shopping / purchase candidates, with fashion / brand as an early template, student research as a secondary template, and hospital / life information deferred until stronger privacy and claim guardrails exist. |
| Rationale | This direction is clearer and more monetizable than generic URL management, safer than hospital/service as a lead vertical, more broadly adoptable than fashion-only, and naturally extends the current URL/title/category/tag/memo/favorite/search/card-list MVP. |
| Risks / Tradeoffs | The direction still needs user confirmation; shopping can tempt price tracking, affiliate, and purchase flows; AI features require persistence, consent, evaluation, and cost controls; sensitive verticals require stronger Review Gate and QA. |
| Follow-up | Complete `NEXT-006` preview verification, then run `NEXT-008` to confirm or revise the user's preferred direction before Supabase/Auth persistence or new feature work. |
| Links | `docs/council/product-direction/synthesis.md`, `docs/product-direction.md`, `docs/roadmap.md`, `docs/feature-priority.md`, `docs/growth-strategy.md`, `docs/monetization-notes.md` |

### DEC-2026-04-29-009 - Create Product Direction Council Workspace Without Choosing Direction

| Field | Content |
| --- | --- |
| Date | 2026-04-29 |
| Status | Accepted |
| Decider | Orchestrator |
| Roles Consulted | Automation Runner, Product, Growth, Design, Data Model, Implementation, QA, Review Gate |
| Context | autp needs a safe docs-based space where multiple roles can discuss future product direction beyond URL saving without one chat prematurely deciding the service strategy. |
| Options Considered | Decide product direction immediately; keep discussion inside shared status docs; create per-role council files and defer synthesis. |
| Decision | Create `docs/council/product-direction/` with a shared brief, one file per role, a Review Gate file, and an Orchestrator synthesis file. Do not choose a product direction in this setup. |
| Rationale | Separate role files reduce conflicts and let each role contribute from its own perspective before Orchestrator integrates the discussion later. |
| Risks / Tradeoffs | The council adds more docs to maintain, but it avoids mixing strategic debate into `current-status.md`, `task-board.md`, or `decision-log.md`. |
| Follow-up | `NEXT-007`: each role fills only its assigned council file; Orchestrator synthesizes later after Review Gate has checked the inputs. |
| Links | `docs/council/product-direction/brief.md`, `docs/council/product-direction/synthesis.md`, `docs/task-board.md`, `docs/review-log.md` |

### DEC-2026-04-29-008 - Accept NEXT-003 Local Smoke QA And Move To Vercel Verification

| Field | Content |
| --- | --- |
| Date | 2026-04-29 |
| Status | Accepted |
| Decider | QA / CI / Vercel Verification |
| Roles Consulted | QA, Review Gate, Vercel Verification |
| Context | `NEXT-003` URL Saving MVP needed its local QA result formally recorded before proceeding to deployment / preview verification. |
| Options Considered | Reopen implementation before preview checks; accept the local smoke QA result and move to Vercel verification; defer all verification until Supabase-backed persistence exists. |
| Decision | Accept the local smoke QA result for `NEXT-003` and keep `NEXT-006` focused on Vercel deployment / preview confirmation. |
| Rationale | Local verification has already passed for install, verify, lint, typecheck, build, dev startup, URL registration, title, category, tags, memo, favorite toggle, listing, search, card/list switching, and MVP-acceptable page-refresh behavior, with no High or Medium issues recorded. |
| Risks / Tradeoffs | Deployment-specific runtime behavior is still unverified, and Supabase-backed persistence remains deferred until safe preview/local Supabase setup is available. |
| Follow-up | `NEXT-006`: Vercel Verification confirms the deployment / preview loads, repeats core MVP flow checks, and logs any blocker before Product Direction or Growth Strategy Council work proceeds. |
| Links | `docs/current-status.md`, `docs/review-log.md`, `docs/task-board.md` |

### DEC-2026-04-29-007 - Implement URL Saving MVP Local-First Until Supabase Is Verified

| Field | Content |
| --- | --- |
| Date | 2026-04-29 |
| Status | Accepted with changes |
| Decider | Orchestrator |
| Roles Consulted | Implementation, Data Model, QA, Review Gate |
| Context | `NEXT-003` needed a working URL Saving MVP while Supabase live connection, auth flow, reviewed migrations, and preview schema/RLS application were still unverified. |
| Options Considered | Block implementation until Supabase is fully configured; write directly to Supabase from the client now; implement a local-first MVP UI and document Supabase follow-up requirements. |
| Decision | Implement the URL Saving MVP as a local-first `localStorage` UI for this PR, keep the existing Supabase helper read-only, and document the missing Supabase setup before database-backed persistence. |
| Rationale | This proves the required save, list, edit, favorite, search, metadata, and card/list flows without adding env values, using service role keys, changing production DB, running SQL, or weakening RLS. |
| Risks / Tradeoffs | Data is browser-local until Supabase preview/local setup is completed, so cross-device persistence and RLS tests are deferred. |
| Follow-up | `NEXT-006`: QA / Review Gate verifies the PR and Vercel preview, then a later implementation task can connect the UI to reviewed Supabase migrations and RLS in a safe preview/local environment. |
| Links | `app/saved-url-manager.tsx`, `docs/current-status.md`, `docs/review-log.md`, `docs/task-board.md`, `docs/data-model.md`, `docs/supabase-schema.md`, `docs/rls-policy.md` |

### DEC-2026-04-29-006 - Adopt URL Saving Data Model And RLS Proposal

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

### DEC-2026-04-29-005 - Adopt Conflict Prevention And Branch Hygiene Rules

| Field | Content |
| --- | --- |
| Date | 2026-04-29 |
| Status | Accepted |
| Decider | Orchestrator |
| Roles Consulted | Automation Runner, Orchestrator, Review Gate, QA |
| Context | Shared docs such as `docs/current-status.md`, `docs/review-log.md`, `docs/task-board.md`, and `docs/decision-log.md` were likely to conflict when multiple Codex PRs edited broad status and log sections. |
| Options Considered | Continue ad hoc branch updates; ask humans to resolve PR conflicts; require Codex to sync from `main` at branch start, before PR creation, and while PRs wait for merge. |
| Decision | Codex must update from `main` before new branchable work, sync with latest `main` before PR creation, keep waiting PR branches current, and resolve ordinary PR conflicts directly before pushing a follow-up commit. |
| Rationale | Keeping branches close to `main` and narrowing shared docs edits reduces repeated conflicts without adding GitHub Actions, code implementation, env changes, Supabase production changes, billing, or launch actions. |
| Risks / Tradeoffs | Extra verification and sync steps add time to each automation cycle, but they are cheaper than repeated manual conflict repair. |
| Follow-up | `NEXT-005`: Automation designs a docs separation plan for detailed task logs in `docs/tasks/`, `docs/status/`, or `docs/logs/` while the next immediate task remains `NEXT-002`. |
| Links | `docs/automation-policy.md`, `docs/automation-runbook.md`, `docs/collaboration-protocol.md`, `docs/task-board.md`, `docs/current-status.md` |

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
