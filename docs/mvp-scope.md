# URL Saving MVP Scope

## Purpose

Define the smallest useful URL-saving MVP for autp so Design, Data Model, Growth, Implementation, QA, and Review Gate can review the same product boundary before any feature implementation begins.

## User Problem

A user needs a simple private place to save URLs they may want to revisit, organize them lightly, add personal context, and find them again without committing to a specialized workflow.

## MVP Decision

The first MVP is a private URL manager with manual URL registration, lightweight metadata, list browsing, search, and a card/list view toggle. It is not a public publishing product, social tool, marketplace, browser extension, or advanced vertical workflow.

## In Scope

| Capability | MVP Behavior | Notes For Review |
| --- | --- | --- |
| URL registration | User can add one URL at a time. | URL is required. Validation should reject empty or clearly invalid URL input. |
| Title | User can enter or edit a title. | Auto-fetching metadata is out of scope for the first MVP unless later approved as a small enhancement. |
| Category | User can assign one optional category. | Product expects a simple user-defined label; Data Model may decide whether this is a text field or normalized table. |
| Tags | User can assign zero or more optional tags. | Tags are lightweight labels for filtering/search. Advanced tag management is deferred. |
| Memo | User can add optional personal notes. | Memo is private user content. |
| Favorite | User can mark/unmark a saved URL as favorite. | Favorite is a boolean user action. |
| List display | User can see saved URLs in a default list. | Most recent saved or updated items should be easy to scan. |
| Search | User can search saved URLs by URL, title, category, tag, and memo. | Search should be simple keyword search for MVP. |
| Card/list toggle | User can switch between card and list presentation. | This affects display only; it should not change saved data. |

## Out Of Scope

| Deferred Capability | Reason |
| --- | --- |
| SNS posting | External posting requires HumanGate and is not needed to prove URL saving. |
| External public pages | Public sharing adds launch, privacy, and abuse risks outside the first MVP. |
| Billing, payments, paid plans, or domains | Paid actions require HumanGate and are not part of the MVP value test. |
| Multi-person sharing | Sharing requires permissions, invitations, and collaboration rules beyond the first private MVP. |
| Browser extension | Useful later, but it expands implementation and release surface. |
| Fashion, hospital, or other advanced vertical modes | Specialized workflows should wait until the generic URL-saving flow is stable. |
| Automatic page metadata scraping | Nice-to-have; manual title entry is enough for the first MVP scope. |
| Complete automatic scraping | Future automation may propose safe capture or enrichment flows, but MVP should not depend on background scraping reliability. |
| AI automatic classification | Future automation may suggest categories or tags later, but MVP keeps user-controlled metadata as the source of truth. |
| Bulk import/export | Not required for the first useful save-and-find loop. |
| Recommendations, ranking, or AI summaries | Adds cost, policy, and quality questions before the basic product is proven. |
| Public launch execution | Final public production launch remains HumanConfirmationRequired. |

## Screens

| Screen | Purpose | Required MVP Elements |
| --- | --- | --- |
| Saved URLs | Primary working screen for browsing, searching, and switching display modes. | Search input, view toggle, saved URL results, favorite state, category/tag/memo visibility, empty state. |
| Add URL | Create a saved URL record. | URL, title, category, tags, memo, favorite, save/cancel actions, validation feedback. |
| Edit URL | Update or delete a saved URL record after it exists. | Same editable fields as Add URL plus delete affordance if Implementation later includes deletion in the approved CRUD scope. |

Deletion is a product-level open detail for Implementation and Review Gate: local user deletion of their own saved URL is likely necessary for CRUD completeness, but production data deletion policies and destructive database actions remain HumanGate-protected. NEXT-002 should make the data model capable of safe row-level ownership before Implementation decides delete behavior.

## User Flows

### Save A URL

1. User opens the Saved URLs screen.
2. User chooses Add URL.
3. User enters a required URL.
4. User optionally enters title, category, tags, memo, and favorite state.
5. User saves.
6. App returns to Saved URLs and shows the new item.

### Find A URL

1. User opens Saved URLs.
2. User types a keyword in search.
3. App filters saved URLs by URL, title, category, tags, or memo.
4. User opens or scans the matching item.

### Review Saved URLs

1. User opens Saved URLs.
2. User switches between card and list view.
3. App preserves the same results while changing presentation.
4. User can identify favorite items without opening each record.

### Update A Saved URL

1. User opens a saved URL record from the list or card.
2. User edits title, category, tags, memo, or favorite state.
3. User saves.
4. App returns to the browsing context with updated content visible.

## URL Data Items

| Field | Required | Product Meaning | NEXT-002 Data Model Notes |
| --- | --- | --- | --- |
| `id` | Yes | Stable saved URL identifier. | Use database-generated unique id. |
| `owner_id` | Yes | User ownership boundary. | Should align with Supabase Auth and RLS, likely `auth.uid()`. |
| `url` | Yes | The saved web address. | Store normalized URL string; preserve enough original value for display. |
| `title` | Yes for display | User-facing name for the saved URL. | Can default from URL if user leaves blank, but no metadata fetching is required. |
| `category` | No | One broad grouping label. | Decide text field vs category table; keep migration path simple. |
| `tags` | No | Multiple lightweight labels. | Decide array/text relation vs tag join table; consider search/filter requirements. |
| `memo` | No | Private user note. | Free text, not public. |
| `is_favorite` | Yes | Favorite marker. | Boolean default false. |
| `created_at` | Yes | Sort and audit timestamp. | Database timestamp. |
| `updated_at` | Yes | Recency and edit timestamp. | Database timestamp or trigger proposal. |

## Automation Goal Compatibility

The MVP should support autp's near-autonomous safe development goal without adding autonomous user-facing behavior in the first release.

- Product scope remains small, explicit, and docs-first so `RoleCouncilLoop` can review it before implementation.
- User-provided URL, title, category, tags, memo, and favorite state remain the source of truth for MVP data.
- Automatic scraping, AI classification, public posting, billing, and launch actions stay deferred or HumanGate-protected.
- Screens, flows, data items, and acceptance criteria are written so future `PRAutoReviewLoop`, QA, and Review Gate checks can map requirements to tests.
- Data Model should produce schema, RLS, index, migration, and type notes that future automated implementation and safe-fix PRs can consume.
- Supabase Preview Branch limits or missing environment constraints should be documented as diagnostics, not treated as product scope or app bugs.
- Docs updates for this MVP should remain compatible with `DocsSyncLoop`: status, task board, review log, decision log, and handoff records should name the next owner and exact next action.

## Acceptance Criteria

- The MVP scope is documented in `docs/mvp-scope.md`.
- `docs/product-spec.md` contains a proposal-style spec and role review prompts.
- In-scope and out-of-scope features are explicit enough to prevent scope drift.
- Screens and user flows cover saving, finding, reviewing, and updating saved URLs.
- Saved URL data items are defined for the next Data Model / Supabase Schema task.
- The MVP scope does not conflict with the near-autonomous automation goal in `docs/automation-policy.md`, `docs/automation-runbook.md`, and `docs/automation-registry.md`.
- No app feature implementation, env value, production DB change, billing, external posting, or final public launch is performed.

## Handoff To NEXT-002

NEXT-002 should draft a non-destructive Supabase schema and RLS proposal in docs only. The proposal should answer:

- Which tables are needed for saved URLs, categories, and tags in the smallest safe schema?
- How should `owner_id` and RLS ensure private per-user access?
- Should category be a simple field or normalized table for MVP?
- Should tags be stored as an array, separate tag records, or a join table?
- What indexes are needed for URL/title/category/tag/memo search?
- How can migrations be drafted without touching the production database?
- What implementation-facing TypeScript types or generated types will be needed later?
- Which schema notes, RLS test cases, rollback notes, and generated type expectations should future automated PR review use?
- How should Supabase Preview Branch limits, missing preview env names, or platform constraints be diagnosed separately from schema or app bugs?
