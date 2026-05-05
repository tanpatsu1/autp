# Implementation Perspective

## Role Scope

Implementation evaluates feasibility, sequencing, affected areas, verification cost, and how to keep future work small and reversible. This is an implementation opinion only: it does not choose the final product direction and does not implement code.

## Baseline Assessment

The current MVP is a local-first URL manager with URL registration, title, category, tags, memo, favorite, list/search, edit/delete, and card/list views. The strongest implementation advantage is that nearly every future direction can start as "saved URL plus structured notes." The main constraint is that local `localStorage` persistence is only good for proving UI flows; any serious product direction needs Supabase/Auth before data becomes durable, private across devices, or testable against RLS.

## Most Natural Extension From The MVP

The most natural next product direction is an AI-ready bookmark and decision organizer, not a narrow vertical mode yet. It extends the current data shape with the least churn:

- Saved URL remains the core entity.
- Category and tags become the first organization layer.
- Memo becomes the first user-owned interpretation layer.
- Favorite and search remain the primary retrieval layer.
- Later vertical templates can be metadata presets rather than separate products.

This direction keeps implementation incremental. It can support students, shopping, fashion, hospital research, and personal decision support without forcing the app to pick a complex vertical data model too early.

## Low-Cost, High-Effect Candidates

| Candidate | Difficulty | Effect | MVP Fit | Verification | Implementation Notes |
| --- | --- | --- | --- | --- | --- |
| Supabase/Auth-backed persistence | Medium | High | Required | Medium | Add authenticated persistence before serious expansion; use anon key only, RLS, and reviewed migrations. |
| Saved URL detail/edit route | Low | Medium | Strong | Easy | Move edit state into a clearer route or panel once persistence exists; improves QA and deep-linking later. |
| Category and tag filters | Low | High | Strong | Easy | Add filter chips/dropdowns after search; uses existing metadata and is easy to test. |
| Sort controls | Low | Medium | Strong | Easy | Sort by updated, created, favorite, title; no schema change needed beyond timestamps. |
| Empty/loading/error states | Low | Medium | Strong | Easy | Needed before preview/release; reduces support and QA ambiguity. |
| Import/export JSON or CSV | Medium | Medium | Good | Medium | Useful while persistence is immature, but should wait until data shape stabilizes. |
| Basic metadata preview fields | Medium | Medium | Good | Medium | Allow user-entered source/site/price/date fields before auto-scraping. |

## Feasibility Comparison

| Direction | Smallest Next PR | Main Dependencies | Complexity | Verification Path | Notes |
| --- | --- | --- | --- | --- | --- |
| AI bookmark manager | Persist current MVP data with Auth, then add manual summary fields before AI generation | Supabase/Auth, RLS, later AI provider/env policy | Medium now, High later | Verify CRUD, RLS, search, then AI output logging/cost controls | Best long-term technical fit if AI is layered after reliable persistence. |
| Shopping decision board | Add optional decision fields such as price, status, rating, purchase link notes | Persistence, optional currency/price model later | Medium | Verify create/edit/filter/sort and no payment flows | High user value, but avoid checkout, price scraping, or purchase actions early. |
| Fashion / brand manager | Add brand, item type, size/color notes as a template over saved URLs | Persistence, template metadata design | Medium | Verify template creation/edit/filter and generic fallback | Natural extension, but can over-specialize the generic MVP if introduced as the default too soon. |
| Hospital / service comparison | Add comparison criteria and appointment notes | Persistence, strong privacy copy, careful scope | High | Verify private data handling, no medical advice claims, no external submission | Technically possible but policy/UX risk is high; should wait. |
| Student research organizer | Add project/workspace, citation notes, reading status | Persistence, optional workspace model | Medium | Verify project filters, notes, search, export | Good fit with current URL + memo model and easier than healthcare. |
| Broad personal decision support | Add collections/projects and comparison criteria | Persistence, workspace/collection model | Medium-High | Verify collection CRUD, search isolation, filters | Good umbrella direction if Product wants shopping, school, and research under one architecture. |

## Recommended Implementation Order

1. Verify and stabilize the current local MVP in preview.
2. Add Supabase/Auth persistence in a small PR using the reviewed schema and RLS; keep local demo fallback only if clearly labeled.
3. Add generated or hand-maintained TypeScript database types for `saved_urls`, `categories`, `tags`, and `saved_url_tags`.
4. Implement owner-scoped CRUD against Supabase: save, list, edit, favorite, delete own URL, category reuse, tag reuse, and tag links.
5. Add focused QA for RLS test cases, signed-out behavior, and cross-user denial in a safe preview/local Supabase environment.
6. Add category and tag filters, sort controls, and stronger empty/loading/error states.
7. Add collections/projects only after individual saved URL persistence is stable.
8. Add vertical templates as optional presets over the same saved URL model.
9. Add AI summaries/classification only after persistence, user identity, job/result storage, cost controls, and reviewable prompts exist.

## Supabase/Auth/Persistence Timing

Supabase/Auth should be the next major implementation foundation before the product picks a vertical-heavy direction. Without it, the app cannot reliably support:

- cross-device saved URLs;
- private user ownership;
- RLS validation;
- useful Vercel preview QA;
- AI result history;
- project or collection data;
- import/export consistency.

The first Supabase PR should be boring and narrow. It should not introduce AI, scraping, sharing, billing, or vertical templates at the same time. The implementation should use public env names only, the browser client with anon/publishable key only, and RLS as the hard boundary. Missing preview env values should be documented as configuration blockers, not patched with real values in the repo.

## Tag, Category, Search, And UI Sequence

1. Keep category and tags user-entered until persistence is stable.
2. Once Supabase is wired, implement category reuse and tag reuse exactly as the data model proposes.
3. Add filters before advanced search: category filter, tag filter, favorites filter.
4. Keep keyword search simple over URL, title, category, tag, and memo.
5. Add sort controls and better result count/empty states.
6. Only then consider search views, generated search columns, full-text ranking, or AI-assisted retrieval.

This order is easy to verify and avoids prematurely committing to a search architecture that may be wrong for later verticals.

## Features That Are Too Complex Right Now

| Feature | Why It Should Wait | Required Foundation |
| --- | --- | --- |
| AI summaries | Needs prompt design, model/env configuration, cost controls, result storage, retry/error states, and user trust patterns | Supabase/Auth, AI policy, generation persistence |
| AI classification | Could rewrite user organization unexpectedly and needs reviewable suggestions | Persistent metadata, undo/accept flow, confidence display |
| Automatic page scraping | Fetch reliability, CORS/server-side fetch design, metadata quality, abuse limits | API route design, rate limits, queue/error handling |
| Public sharing | Adds permissions, abuse risk, privacy states, launch policy, and external surface | Auth, access model, Review Gate, HumanGate for launch |
| Multi-user collaboration | Requires invitations, roles, row-level permissions, conflict handling | Mature ownership model and collaboration schema |
| Healthcare/hospital specialization | High privacy and claim-risk surface; UX must avoid medical advice | Product/legal/QA guardrails and strong private data handling |
| Payments or purchase actions | HumanGate and financial/policy constraints | Explicit human approval and separate payment architecture |

## Genre-Specific Templates

Genre templates should come after stable persistence and filters, before AI. They should be implemented as optional presets over a generic collection/item model, not as separate hard-coded apps. A safe first template system could include:

- template name;
- suggested category;
- suggested tag set;
- optional extra text fields stored as structured metadata;
- no external submission or automation.

Suggested order:

1. Student research template.
2. Shopping decision template.
3. Fashion/brand template.
4. Healthcare/service comparison only after QA and policy review.

Student and shopping templates are easier to verify and less risky than healthcare. Fashion is also plausible, but it can quickly demand image handling, product variants, price tracking, and brand-specific fields, so it should start as a lightweight preset.

## AI Foundation Needed First

Before AI summary or AI classification, Implementation needs:

- persisted user-owned saved URL records;
- stored AI outputs linked to a saved URL or collection;
- prompt/version metadata for review and rollback;
- clear user action to request AI, not automatic background generation at first;
- loading, error, retry, and empty states;
- cost and rate-limit controls;
- no secret values committed;
- server-side route boundaries for model calls;
- QA fixtures for deterministic UI behavior when model output varies.

AI should assist organization, not become required for saving or finding URLs. The base CRUD/search flow must keep working when AI is unavailable.

## Vercel, Supabase, And Env Notes

- Use only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` on the browser side.
- Never use service role keys in the app or automation.
- Do not write real env values into `.env.example`, docs, or code.
- Treat missing Vercel preview env values as a deployment configuration blocker.
- Treat missing migrations in preview as schema drift, not as a reason to weaken RLS.
- Keep production DB changes outside automation.
- Run `npm run verify` for every implementation PR, and add browser/preview checks once a preview exists.
- Keep branch work small because shared docs and schema files are conflict-prone.

## Fragile Areas In The Current MVP

| Area | Risk | Mitigation |
| --- | --- | --- |
| `localStorage` persistence | Browser-local data can disappear and is not cross-device | Replace with Supabase after preview/auth setup; keep fallback clearly labeled. |
| Client-only state | Harder to deep-link, test server behavior, or share routes | Add routes/detail views after persistence. |
| URL validation | Current MVP likely accepts broad URL shapes but does not check reachability | Keep validation simple; avoid metadata fetching until server route exists. |
| Search | Simple contains search may become slow or awkward after database persistence | Start with scoped queries; move to search view/full-text only after usage warrants it. |
| Tags/categories | Normalized model is good but write flows can become multi-step and failure-prone | Implement create/reuse/link operations with narrow helper functions and rollback/error states. |
| Delete | User-owned delete is okay, but production data deletion policies must stay clear | Limit delete to authenticated user's own rows and verify RLS cases. |
| Docs drift | Council and implementation branches may edit shared docs in parallel | Keep this role pass confined to `implementation.md`. |

## Next Implementation Phase Candidates

| Phase | Scope | Why This Phase |
| --- | --- | --- |
| Phase 1 | Supabase/Auth persistence for the existing MVP only | Highest leverage and prerequisite for real product direction. |
| Phase 2 | Filter/sort polish and empty/loading/error states | Low cost, high UX and QA value. |
| Phase 3 | Collections/projects | Natural bridge from bookmarks to decision support and research workflows. |
| Phase 4 | Lightweight templates | Lets Product test student/shopping/fashion directions without schema lock-in. |
| Phase 5 | AI-assisted summaries/classification | Valuable after data, auth, storage, and cost controls are stable. |

## Implementation Recommendation Draft

- Easiest direction to build: AI-ready bookmark/research organizer, with no AI dependency at first.
- Highest low-cost impact: Supabase/Auth persistence, then category/tag filters and sort controls.
- Most expensive direction: healthcare/service comparison or public sharing, because they add privacy, permissions, policy, and QA risk.
- Safest next technical step: wire the existing MVP to reviewed Supabase schema/RLS in a preview/local environment, then verify owner-scoped CRUD.
- Biggest unknown: whether Product wants autp to stay generic or specialize in a vertical such as fashion/shopping/student research.
- Questions for Product / QA: Which vertical should be tested first as a lightweight template? What data must be exportable? What privacy copy is required before users store sensitive decision notes?
