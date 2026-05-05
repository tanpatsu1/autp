# Product Direction

## Recommendation

autp should grow into an AI-ready private decision board for saved links.

The product should be introduced first through a concrete use case:

> Save the links you are considering, add context, compare later, and decide when ready.

The strongest first wedge is shopping / purchase candidates. Fashion / brand management should be an early template because it is important to the user's interests and has strong visual and repeat-use potential. Hospital / life information and student research should remain supported by the generic model, but not become the first headline direction.

## Product Positioning Layers

| Layer | Role |
| --- | --- |
| Core capability | Private saved links with title, category, tags, memo, favorite, search, edit/delete, and card/list views |
| First wedge | Shopping / purchase candidate board |
| Early template | Fashion / brand board |
| Secondary template | Student research / useful links board |
| Later sensitive template | Hospital / life information board with stronger privacy and claim guardrails |
| Long-term umbrella | Personal decision workspace |
| AI layer | Optional assistant for summaries, grouping, tag/category suggestions, and comparison drafts |

## Why This Direction

- It is clearer than generic URL management.
- It is safer than leading with hospital or other high-stakes workflows.
- It keeps the current MVP useful instead of replacing it.
- It gives users a reason to return: compare, update notes, favorite finalists, and decide.
- It supports the user's fashion / brand and hospital ideas without locking the product into one narrow vertical.
- It leaves room for AI and monetization after persistence and trust are established.
- It decomposes well into small Codex tasks with verification and Review Gate checks.

## Why Other Directions Are Deferred

| Direction | Reason To Defer As Lead Direction |
| --- | --- |
| Generic URL manager | Useful foundation, but too easy to confuse with bookmarks or notes. |
| AI bookmark organizer | Good long-term layer, but AI quality, cost, privacy, and evaluation are not ready. |
| Fashion / brand-only app | Strong template, but too narrow before the generic save-find-compare loop is proven. |
| Hospital / life information app | Sensitive data and advice-risk make it a later private template, not first positioning. |
| Student organizer | Useful, but lower monetization and can quickly require citations/export. |
| SNS-found info saver | Strong acquisition angle, but must avoid external posting and public sharing until gated. |
| Creator/team brand manager | Collaboration and permissions add RLS and QA complexity. |

## Supabase/Auth/Persistence Position

Supabase/Auth/persistence should be the next major implementation foundation after deployment / preview verification. The goal is not a new feature set; the goal is trust:

- signed-in private records;
- owner-scoped saved URLs, categories, tags, and joins;
- RLS enforced before app access;
- no service role key use;
- no real env values in repo;
- no production DB change from automation;
- preview/local verification of cross-user denial.

Without persistence, autp can demonstrate UI flow. With persistence, autp can become a real private decision board.

## Token Efficiency follow-up Position

Token Efficiency follow-up should be strengthened early, before large vertical or AI expansion. It should begin docs-first:

- task scoring rubric;
- council synthesis checklist;
- PR readiness checklist;
- Vercel failure taxonomy;
- Supabase preview diagnostics;
- AI evaluation rubric;
- DocsSync rules for current status, task board, decision log, and review log.

Token Efficiency follow-up should help Codex propose, implement, verify, review, and repair small safe tasks. It must not bypass HumanGate.

## Tags, Categories, Search, And UI Position

Tags, categories, search, and UI clarity are part of the core product, not optional polish.

Priority:

1. Keep URL saving fast.
2. Keep search prominent.
3. Add category, tag, and favorite filters after persistence.
4. Add sort controls and better empty/no-results/loading/error states.
5. Add decision status and decision notes after the saved-link foundation is stable.
6. Keep mobile capture and retrieval comfortable.

## Capture Friction Position

Capture friction is a first-class product risk. The current "copy URL, open autp, paste, fill fields, save, return" flow is acceptable only as an earliest MVP baseline. It should not be treated as the long-term capture strategy.

Adopt URL-only fast save as the initial capture baseline:

- URL is the only user-required save-time input.
- Title, category, tags, memo, and favorite can be edited after save.
- Blank titles should receive a deterministic fallback title from the URL.
- Uncategorized, untagged, and memo-empty links remain valid records.
- Fast-saved links should be easy to organize later.
- Supabase/Auth/RLS persistence should allow inserting a valid owner-scoped saved URL with URL, fallback title, defaults, and timestamps only.

`docs/capture-friction-baseline.md` is the source for the capture baseline. iframe / embedded browsing remains research-only. Bookmarklet, Web Share Target, and Chrome extension capture are later candidates after persistence and auth are stable.

## Genre Expansion Position

Genres should be templates over one core model:

- Shopping: status, price note, store, deadline, pros/cons, next check.
- Fashion / brand: brand, item type, size/color notes, season, occasion.
- Student research: project, course, source type, reading status, citation note.
- Hospital / life information: location, department, appointment note, caution copy, privacy guardrails.

Do not create separate apps, heavy mode switching, or vertical-specific schemas until usage proves a need.

## AI Position

AI should be assistive and user-confirmed:

- page or note summaries;
- suggested tags/categories;
- grouping similar saved items;
- draft comparison notes;
- missing-information prompts;
- later chat-style retrieval.

AI should not auto-post, purchase, provide medical/financial/legal advice, silently overwrite user taxonomy, or become required for core save/find flows.

## Confirmed Direction And Open Planning

The user has confirmed the direction in `docs/user-direction-confirmation.md`: autp should proceed as an AI-ready private decision board for saved links, first entered through shopping / purchase candidates. Fashion / brand remains an early template candidate, and hospital / life information remains deferred.

Open planning items:

- Vercel deployment / preview verification.
- Supabase/Auth/RLS persistence for the existing MVP.
- Implementation of the URL-only fast-save baseline after persistence assumptions are clear.
- Token Efficiency follow-up docs and rubrics before large AI, template, sharing, or monetization expansion.
