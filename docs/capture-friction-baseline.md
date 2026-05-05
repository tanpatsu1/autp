# Capture Friction Baseline

## Scope

This document defines the baseline capture experience for autp before Supabase/Auth/RLS persistence implementation. It is planning only. It does not implement fast save, iframe browsing, bookmarklets, Web Share Target, Chrome extensions, scraping, AI, new environment values, SQL, Supabase production DB changes, weaker RLS, service role keys, billing, external posting, or public launch.

## Source Direction

The confirmed product direction is:

- autp is an AI-ready private decision board for saved links.
- The first entrance is shopping / purchase candidates.
- Fashion / brand board remains an early template candidate.
- Hospital / life information is deferred.
- Capture friction is a first-class product risk.
- iframe / embedded browsing remains research-only.
- Supabase/Auth/RLS persistence is the next major implementation foundation, but its data assumptions should account for low-friction capture.
- Token Efficiency follow-up should happen before large AI, template, sharing, or monetization expansion.

## Problem Definition

Capture friction is the risk that a user finds a useful link but does not save it because saving requires too many steps at the moment of discovery.

The current weak flow is:

1. Copy a URL.
2. Open autp.
3. Paste the URL.
4. Fill title, category, tags, memo, and favorite state.
5. Save.
6. Return to the original browsing context.

This can make autp feel like homework. The product can be useful in theory but still fail to become habitual if users do not save enough candidates to make the board valuable.

## Current Save Flow

The current MVP save form supports:

- required URL validation;
- optional title input, with a hostname fallback when blank;
- optional category;
- optional comma-separated tags;
- optional memo;
- optional favorite checkbox;
- local-first browser storage;
- list/card display, search, edit, delete, and favorite toggle.

The current flow is acceptable for the earliest MVP because it is deterministic, private, locally verifiable, and avoids scraping or external permissions. It is not sufficient as the long-term capture strategy.

## Weak Points

| Weak Point | Why It Matters | MVP Judgment |
| --- | --- | --- |
| App switching | Users must leave the discovery context to save. | Accept temporarily; improve with fast save and later capture channels. |
| Too many fields at save time | Every required field lowers capture rate. | Only URL should be required initially. |
| Manual title entry | Useful labels matter, but typing interrupts capture. | Keep optional; use fallback title now and consider reviewed title fetch later. |
| Category and tag entry | Organization is valuable after several links exist, but slow during capture. | Defer to later editing and retrieval flows. |
| Memo entry | "Why saved" is valuable for decisions, but should not block saving. | Optional at save time; encourage after capture. |
| Mobile typing | Product discovery often happens on mobile. | Design must make URL-only save comfortable before adding richer fields. |
| Weak saved confirmation | Users need to trust that the item is captured. | Implementation should show clear saved feedback in the next UX slice. |
| Unorganized saved links | URL-only saves can become a dead archive. | Mark or derive "needs organizing" and make later cleanup easy. |

## Baseline Decision

Adopt URL-only fast save as the initial capture baseline.

Baseline behavior:

1. A user can save a valid URL with no other required input.
2. If title is blank, the app stores a safe fallback title derived from the URL, such as the hostname.
3. Category, tags, memo, and favorite are optional at save time.
4. Saved items with no category, no tags, no memo, or fallback-only title remain valid records.
5. The UI should make it easy to organize the item later.
6. The first implementation of this baseline should stay inside the existing app flow before adding external capture channels.

This is a product baseline, not an implementation approval for this task.

## Required, Optional, Later

| Field / Behavior | Save-Time Requirement | Baseline Rule |
| --- | --- | --- |
| URL | Required | Validate and normalize. This is the only user-required input. |
| Owner / user id | Required for persistence | Required once Supabase/Auth exists; never trust client-only ownership. |
| Title | Optional input, required stored display value | If blank, store fallback title from the URL. No metadata fetch required. |
| Category | Optional | `null` / uncategorized is valid. |
| Tags | Optional | Zero tags is valid. |
| Memo | Optional | Blank memo is valid. |
| Favorite | Optional | Default `false`. |
| Created / updated timestamps | Required for persistence | Use database timestamps or reviewed app-side update path. |
| Capture source | Recommended for persistence | Store source such as `manual_form`, `fast_save`, `bookmarklet`, `web_share`, `extension`, or `import` when channels are added. |
| Organization state | Recommended for persistence planning | Either explicit `needs_review` / `organized` state or a derived "needs organizing" rule. |
| Decision status | Defer from capture baseline | Add later as generic decision support after persistence and retrieval are stable. |
| Price, store, deadline, pros/cons | Defer | Shopping template fields should not be required for core capture. |

## Unclassified And Unorganized Links

Unclassified links are allowed. A saved URL with no category should remain searchable and visible in the default list.

Untagged links are allowed. Tags are useful for retrieval, but tag entry must not block capture.

Title-unentered links are allowed. The stored title should use a deterministic URL fallback. A later reviewed title-fetch enhancement can improve titles, but the baseline must not depend on remote fetching.

Unorganized links should be treated as a normal state, not an error. Product wording can use "organize later" or "needs review" in future design work. The baseline should make the cleanup path clear enough that URL-only saves do not become abandoned records.

## Shopping / Purchase Candidate Minimum

For the first shopping / purchase-candidate entrance, the minimum useful saved item is:

- URL;
- fallback or user-entered title;
- private owner;
- created and updated timestamps;
- optional memo for "why I saved this";
- optional favorite for shortlisting;
- optional category or tag for grouping.

Do not require price, shop name, brand, size, color, deadline, decision status, pros/cons, or purchase intent at initial capture. These can be added through later generic decision support or shopping/fashion templates.

This keeps fashion / brand templates compatible because fashion-specific fields can be optional template annotations over the same saved-link record instead of separate early schemas.

## Save Method Comparison

| Method | Recommendation | Reason |
| --- | --- | --- |
| Keep manual URL paste only | Keep as fallback, not sufficient as the product baseline | Safe and verifiable, but too slow for repeat capture. |
| URL-only fast save | Adopt as the initial baseline | Biggest low-risk reduction in save-time effort. |
| URL required, title/category/tags/memo later | Adopt | Keeps capture fast and preserves later organization value. |
| Optional title fetch on paste | Later small reviewed slice | Useful, but needs SSRF, privacy, metadata, tracking, terms, and failure-mode review. |
| Organize categories/tags after save | Adopt as UX premise | Fits fast capture and avoids making save-time organization mandatory. |
| Mobile-friendly form | Design handoff | Mobile save should prioritize the URL input, save action, and clear feedback. |
| Save as "organize later" | Adopt as state or derived rule | Lets fast saves stay useful without pretending they are complete. |
| Bookmarklet | After persistence and stable auth | Needs stable authenticated save endpoint and permission/privacy copy. |
| Web Share Target / mobile share sheet | After persistence and PWA/auth review | Strong mobile fit, but needs sanitization, auth handling, and platform QA. |
| Chrome extension | Later | Higher permission, release, privacy, and maintenance burden. |
| iframe / embedded browsing | Research-only | Many sites block embedding; security, privacy, terms, and UX risks are high. |

## Persistence Handoff

Supabase/Auth/RLS persistence should be designed so fast save can be added without schema churn.

Persistence should carry these assumptions:

- `saved_urls.owner_id` remains the private owner boundary.
- `saved_urls.url` is required.
- `saved_urls.title` remains a required stored display field, but user title input is optional because the app can provide fallback text.
- `category_id` is nullable.
- zero tag joins are valid.
- `memo` is nullable.
- `is_favorite` defaults to false.
- fast save should be able to insert a valid row with URL, owner, fallback title, default favorite, and timestamps only.
- saved URLs, titles, memos, categories, tags, favorites, capture source, organization state, search terms, and future AI annotations are private user data.
- RLS must deny anonymous access and cross-user access for saved URLs, categories, tags, and joins.

Recommended persistence planning additions:

- Add or reserve a `capture_source` concept before multiple capture channels exist. Initial value can be `manual_form`; later values can include `fast_save`, `bookmarklet`, `web_share`, `extension`, or `import`.
- Decide whether "needs organizing" is explicit data or derived. If explicit, use a small field such as `organization_state` with conservative values like `needs_review` and `organized`. If derived, define the rule in app code and docs before implementation.
- Defer generic decision status, pros/cons, price tracking, automatic price fields, and AI-derived fields until after persistence and retrieval are verified.

## Growth And Distribution Impact

Reducing capture friction helps retention because the board only becomes useful after users save enough candidates to compare. URL-only fast save makes autp easier to describe:

- "Paste a link now, organize later."
- "Save products from anywhere into a private decision board."
- "Turn scattered tabs into a shortlist."

The easiest near-term demo is a short product flow:

1. Paste one shopping URL.
2. Save immediately.
3. See it appear in the board as "needs organizing" or equivalent.
4. Later add memo, tags, favorite, and category.

This makes the "useful but quiet" problem lighter because the product story becomes visible in one screenshot or short video without public sharing or AI claims.

## Deferred Capture Paths

| Deferred Item | Reason |
| --- | --- |
| iframe / embedded browsing | Research-only due to site blocking, clickjacking, cookies, tracking, terms, broken UX, and product-focus risk. |
| Chrome extension | Later because permissions, store release, privacy copy, and cross-site data handling are a separate product surface. |
| Web Share Target | Strong candidate after persistence, but needs PWA/auth review, URL sanitization, mobile QA, and fallback behavior. |
| Bookmarklet | Useful after persistence and stable auth endpoint; not before owner-scoped save is trustworthy. |
| Automatic scraping | Reliability, security, terms, and private-data risks; not needed for URL-only save. |
| Automatic price tracking | Accuracy, claim, scraping, and shopping monetization risks. |
| SNS posting | HumanGate; not needed for private capture. |
| Public sharing | HumanGate and privacy/abuse risk. |
| AI summary | Defer until persistence, consent, output provenance, prompt-injection review, cost controls, and evaluation exist. |
| AI auto-classification | Defer because user taxonomy, privacy, cost, and silent-change risks are not ready. |

## Handoffs

### Supabase/Auth/RLS Persistence

- Allow a valid saved URL insert with only URL plus authenticated owner and app/database defaults.
- Keep nullable category, zero tags, nullable memo, default false favorite, fallback title, and timestamps.
- Evaluate `capture_source` and explicit versus derived organization state before writing migrations.
- Preserve strict owner-scoped RLS and cross-user category/tag/join denial.
- Do not use service role keys, production DB changes, real env values, or weaker RLS.

### Implementation

- First capture improvement should be URL-only fast save within the existing app, after this planning task and persistence decisions.
- Save-time form must not require title, category, tags, memo, price, decision status, or template-specific fields.
- Saving should provide clear confirmation and keep the item visible immediately.
- Title fetch, bookmarklet, Web Share Target, and extension are separate later tasks.

### Design

- Design around a mobile-comfortable URL-first save surface.
- Make "organize later" feel intentional rather than incomplete.
- Keep later editing for category, tags, memo, title, and favorite obvious.
- Avoid adding explanatory in-app text that makes the tool feel heavy.

### QA

- Verify URL-only save works.
- Verify invalid URL is rejected.
- Verify title fallback appears when title is blank.
- Verify no category, no tags, and no memo are accepted.
- Verify unorganized saved items remain searchable and editable.
- Verify owner-scoped persistence denies signed-out and cross-user access once Supabase is connected.
- Verify no external fetch, iframe, scraping, extension, bookmarklet, Web Share Target, public share, AI, billing, or production DB action is introduced by the first fast-save slice.

## Acceptance Criteria

- `docs/capture-friction-baseline.md` defines the capture-friction problem.
- The current save-flow weakness is documented.
- URL-only fast save is adopted as the initial capture baseline.
- Required, optional, and later-organized fields are separated.
- Unclassified, untagged, and fallback-title links are valid.
- Supabase/Auth/RLS persistence handoff is explicit.
- Deferred capture paths and reasons are documented.
- Roadmap and feature-priority docs reflect the baseline.
- Decision and review logs record the planning result.
- No code implementation or new feature is included in this task.

