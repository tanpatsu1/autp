# Product Spec: Smallest URL Saving MVP

## Proposal Metadata

| Field | Content |
| --- | --- |
| Proposal ID | `PROP-2026-04-29-001` |
| Date | 2026-04-29 |
| Author Role | Product |
| Related Task | `NEXT-001` |
| Status | Accepted |
| Decision Needed By | Orchestrator |

## Summary

autp should start with a private, manual URL-saving MVP. The MVP includes only the behaviors needed to save a URL, add simple personal context, browse saved items, search them, and switch between card and list presentation.

## Problem

Users need a low-friction way to keep URLs with enough context to recognize and retrieve them later, without being forced into public sharing, advanced vertical workflows, or paid/productized commitments.

## Goals

- Let a user manually save a URL with a title.
- Let a user organize saved URLs with one category, optional tags, an optional memo, and a favorite flag.
- Let a user browse saved URLs in list/card views.
- Let a user search by URL, title, category, tags, and memo.
- Leave Data Model enough detail to draft a safe Supabase schema and RLS proposal.
- Keep the MVP compatible with future automated task discovery, role review, safe PR creation, failure diagnosis, and docs sync.

## Non-Goals

- No SNS posting or external public posting.
- No public pages or multi-person sharing.
- No billing, paid plans, purchases, or domain actions.
- No browser extension.
- No advanced fashion, hospital, or other vertical mode.
- No automatic metadata scraping, complete background scraping, AI automatic classification, recommendations, AI summaries, or bulk import/export in the first MVP.
- No code implementation in `NEXT-001`.
- No Supabase production database change.

## Proposed Scope

The first MVP should include these user-visible features:

- URL registration.
- Title.
- Category.
- Tags.
- Memo.
- Favorite.
- Saved URL list display.
- Search.
- Card/list display toggle.

The first MVP should treat saved URLs as private user-owned records. Authentication implementation is not decided in this Product task, but NEXT-002 must design the data shape and RLS posture so records can be safely scoped to the owning user before feature implementation.

The first MVP should also remain automation-ready: requirements, data fields, and handoff notes must be concrete enough for future role-based review, automated verification, safe-fix PRs, and docs sync without requiring humans to restate the product boundary.

## Out Of Scope

The first MVP excludes social publishing, public profiles, public URL collections, billing, paid upgrades, domains, multi-user collaboration, browser-extension capture, vertical workflow modes, automatic metadata fetching, complete automatic scraping, AI automatic classification, import/export, recommendations, and AI-generated summaries.

## Screens

| Screen | MVP Responsibility | Review Focus |
| --- | --- | --- |
| Saved URLs | Browse, search, favorite scan, and switch card/list view. | Design should check empty/loading/error states and mobile scanability. |
| Add URL | Create one saved URL with required URL and optional metadata. | Implementation should check validation and submit flow complexity. |
| Edit URL | Update saved URL metadata after creation. | Data Model should confirm update timestamps and ownership constraints. |

## Core Flows

| Flow | Start | End | Acceptance Signal |
| --- | --- | --- | --- |
| Save URL | User opens Add URL. | New saved item appears in Saved URLs. | Required URL is validated; metadata persists. |
| Search URL | User types keyword in Saved URLs. | Matching saved items remain visible. | Search checks URL, title, category, tags, and memo. |
| Switch View | User toggles card/list. | Same result set appears in selected layout. | View state changes presentation only. |
| Update Metadata | User opens Edit URL. | Updated metadata appears in browsing context. | Title/category/tags/memo/favorite changes persist. |

## Data Requirements

| Item | Required | Reason |
| --- | --- | --- |
| `id` | Yes | Stable record identity. |
| `owner_id` | Yes | Private user ownership and RLS boundary. |
| `url` | Yes | Core saved value. |
| `title` | Yes for display | Human-readable label. |
| `category` | No | One broad grouping label. |
| `tags` | No | Lightweight multi-label organization. |
| `memo` | No | User context and reminders. |
| `is_favorite` | Yes | Quick prioritization. |
| `created_at` | Yes | Default sorting and audit context. |
| `updated_at` | Yes | Edit recency and sync context. |

## Automation Compatibility

This MVP spec aligns with the near-autonomous automation goal by keeping the first product boundary deterministic, reviewable, and safe:

- `RoleCouncilLoop` can review the spec because included features, deferred features, screens, flows, and data items are explicit.
- `PRAutoReviewLoop` can later compare implementation PRs against stable acceptance criteria and HumanGate exclusions.
- `VercelFailureLoop` and `SupabasePreviewDiagnosticsLoop` should be able to separate code bugs, platform constraints, preview env-name issues, and Supabase preview limitations from product scope.
- `DocsSyncLoop` should keep `docs/current-status.md`, `docs/review-log.md`, `docs/task-board.md`, and `docs/decision-log.md` aligned after each safe batch.
- Automation may propose future enrichment features, but MVP data remains user-entered until a later reviewed decision changes that.

## Acceptance Criteria

- The Product spec defines the smallest useful URL-saving behavior.
- The spec separates included MVP features from deferred features.
- The spec lists MVP screens and core user flows.
- The spec defines saved URL data items for the Data Model role.
- The spec asks Design, Data Model, Growth, Implementation, QA, and Review Gate for concrete review.
- The spec is compatible with the near-autonomous safe development goal and gives future automation loops stable review inputs.
- The spec performs no code implementation and no production database action.

## Role Impact

| Role | Impact / Required Review |
| --- | --- |
| Product | Owns the MVP boundary and keeps deferred features out of first implementation. |
| Design | Review screen structure, empty states, responsive behavior, card/list clarity, and form hierarchy. |
| Data Model | Draft schema, RLS, ownership boundaries, search/indexing, generated type expectations, preview diagnostics, and migration notes in docs only. |
| Implementation | Review feasibility, affected app routes/components, validation path, later verification strategy, and safe PR boundaries. |
| Review Gate | Confirm no HumanGate item, implementation, env value, production DB change, scope drift, or contradiction with automation policy. |
| QA | Translate acceptance criteria into local verification, CI checks, preview checks, and later browser-flow checks. |
| Growth | Review positioning and onboarding implications without external posting. |
| Launch | Keep final public launch blocked until human approval. |

## Options Considered

| Option | Pros | Cons | Recommendation |
| --- | --- | --- | --- |
| Minimal manual URL manager | Small, verifiable, clear handoff to schema and UI work. | Less automation and fewer delight features. | Recommended for first MVP. |
| Include automatic metadata fetching | Better default titles and richer cards. | Adds fetch reliability, parsing, security, and preview complexity. | Defer. |
| Include public collections/sharing | Stronger growth loop. | Adds privacy, abuse, launch, and permission risks. | Defer. |
| Include vertical modes from day one | More tailored use cases. | Splits the product before the core save/search loop is proven. | Defer. |
| Include AI classification or complete scraping | Could reduce user effort later. | Adds automation reliability, cost, safety, privacy, and review complexity before the base data model exists. | Defer. |

## Risks And Mitigations

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Scope expands into full product before schema review. | Medium | Mark deferred features explicitly and keep `LATER-001` waiting until schema is reviewed. |
| Category/tag modeling is overbuilt. | Medium | NEXT-002 must compare simple and normalized schemas before choosing. |
| Search requirements exceed simple MVP implementation. | Medium | Start with keyword search over selected fields; defer advanced ranking. |
| Auth and RLS assumptions are unclear. | High | Product requires `owner_id`; NEXT-002 must define RLS before implementation. |
| Public or paid actions slip into MVP. | High | HumanGate table marks these as No for this task; deferred features stay out of scope. |
| MVP spec is too ambiguous for future autonomous review. | Medium | Keep screens, data items, acceptance criteria, and NEXT-002 handoff concrete enough for automated review and docs sync. |

## Verification Plan

- For `NEXT-001`, run `npm run verify` after docs changes when tooling is available.
- Review Gate checks that the change is docs-only and did not implement the URL-saving MVP.
- Review Gate checks that the scope does not contradict the automation goal, HumanGate boundaries, or DocsSync expectations.
- Later Implementation/QA should verify save, search, edit, favorite, and card/list flows after approved implementation begins.

## HumanGate Check

| Item | Status |
| --- | --- |
| SNS or external public posting | No |
| Billing, purchase, paid plan, or domain action | No |
| Production data deletion or DB table deletion | No |
| Weaker RLS | No |
| Real env values, secrets, or service role keys | No |
| Final public production launch | No |

## Requested Reviews

- Design: Confirm the three-screen structure is enough for a clean first experience and identify needed empty/error states.
- Data Model: Draft the smallest safe Supabase schema and RLS proposal for the listed data items.
- Growth: Confirm local onboarding/FAQ language can describe the product without public posting or unsupported claims.
- Implementation: Confirm the MVP can be built in small steps after schema review and list likely affected files.
- QA: Convert the flows into local acceptance checks for a later implementation PR.
- Review Gate: Confirm policy compliance, docs alignment, verification status, and absence of HumanGate triggers.

## Orchestrator Decision

| Field | Content |
| --- | --- |
| Decision | Accepted |
| Required Changes | Use this spec and `docs/mvp-scope.md` as the source for NEXT-002; include automation-ready schema/RLS/type/diagnostic notes; do not implement the URL-saving MVP in this task. |
| Decision Log ID | `DEC-2026-04-29-002` |
| Next Owner | Data Model |
| Next Action | `NEXT-002`: Draft non-destructive Supabase schema and RLS proposal in docs only. |

## Handoff

| Field | Content |
| --- | --- |
| Date | 2026-04-29 |
| From Role | Product |
| To Role | Data Model |
| Related Task | `NEXT-001`, `NEXT-002` |
| Status | Ready |
| Summary | The smallest URL-saving MVP is defined as private manual URL saving with title, category, tags, memo, favorite, list/search, and card/list display. |
| Approved Scope | Draft schema and RLS proposal for saved URLs, ownership, category, tags, memo, favorite, timestamps, search support, generated type expectations, preview diagnostics, and rollback notes. |
| Out of Scope | No production DB changes, no env values, no service role keys, no weakened RLS, no public posting, no billing, no implementation. |
| Key Decisions | `DEC-2026-04-29-002` |
| Open Questions | Category text vs table; tags array vs normalized tables; search/index strategy; delete behavior boundary; RLS test cases; generated type workflow; Supabase Preview diagnostics. |
| Verification | `NEXT-001` docs should pass `npm run verify`; NEXT-002 should remain docs-only unless separately approved. |
| HumanGate Items | None |
| Next Action | Data Model writes the Supabase schema and RLS proposal for `NEXT-002`. |
