# Product Direction Council: Design / UX

## Role

- Role: Design / UX
- Branch: `codex/council-design`
- Date: 2026-04-29
- Scope: Direction proposal only. No implementation, CSS, external posting, environment values, or Supabase production changes.

## Read Context

- Read: `AGENTS.md`
- Read: `docs/compact-context.md`
- Read: `docs/current-status.md`
- Read: `docs/mvp-scope.md`
- Read: `docs/product-spec.md`
- Read: `docs/council/product-direction/brief.md`

## Design Position

autp should grow from a URL saver into a bright, clean personal decision and information organizer. The product should still be understood at first glance as "save links, add context, compare or find later," even when future users apply it to fashion, brands, hospitals, shopping, school research, or AI-assisted bookmarks.

The strongest UX direction is not a narrow vertical app yet. It is a flexible saved-item workspace with optional context layers. This keeps first-time clarity high, lets users bring their own use case, and avoids forcing autp into a complex form-heavy product before the basic save/find loop has proven itself.

## First-Time Clarity

The first screen should answer three questions immediately:

- What is this? A private place to save and organize useful links.
- What do I do first? Paste a URL.
- Why would I come back? Search, filter, compare, and remember why the link mattered.

Design should avoid a marketing landing page as the primary experience. The first viewport should look like the actual tool: a URL save action, search, list/card controls, and either saved items or a useful empty state.

## Direction Comparison

| Direction | First Screen Mental Model | Visual Value | UX Complexity | Design Recommendation |
| --- | --- | --- | --- | --- |
| AI bookmark manager | "Save links and let AI help organize them later." | Strong if AI suggestions stay secondary. | Medium because AI can obscure user control. | Good later, but MVP should keep manual organization as the source of truth. |
| Shopping decision board | "Compare things I might buy." | Strong because cards, notes, tags, and favorites map naturally to candidates. | Medium because price, availability, and decision criteria can grow quickly. | Promising future use case; support through tags/memo before adding shopping-specific UI. |
| Fashion / brand manager | "Collect brands, products, outfits, and references." | Very strong screenshot appeal and card value. | Medium to high if the UI becomes image/catalog-first. | Good growth direction, but do not make the base app fashion-specific. |
| Hospital / service comparison | "Save candidates and compare practical details." | Useful but less visually expressive. | High because trust, privacy, and decision anxiety matter. | Keep possible through neutral tags/memo; avoid medical-looking claims or specialized workflows for now. |
| Student research organizer | "Collect sources for assignments or topics." | Moderate; list density and citation-like clarity matter more than decoration. | Medium because folders, notes, and source quality can expand. | Good fit for list-first UI and search; defer citation-specific tooling. |
| Broad personal decision support | "Save options, notes, and choose later." | Strong across many categories if hierarchy is clean. | Medium because it can become vague. | Best direction if anchored by URL saving and simple organization. |

Design recommendation: position autp as a general personal link-and-context organizer first, then let shopping, fashion, research, and service comparison emerge from categories, tags, and memo patterns.

## UI Direction

autp should feel like a clean personal information shelf, not a dashboard, social feed, or content publishing tool.

- Use a bright light interface with restrained color accents.
- Keep the saved item as the visual focus.
- Prefer list-first density for daily use and card view for richer browsing.
- Make search the primary retrieval control.
- Use category, tags, memo, and favorite as lightweight context, not required administration.
- Keep controls familiar: search input, star favorite, chip filters, segmented view toggle, clear add/save actions.

The visual target is "pleasant enough to share in a screenshot, calm enough to use every day."

## Screen Structure Proposal

### Saved URLs

Primary purpose: browse, search, filter, and recognize saved links quickly.

Recommended structure:

- Compact app header with the main add/save action.
- Prominent keyword search.
- Lightweight controls for view toggle, favorites, category, and tags.
- Default list view for scanning.
- Optional card view for richer browsing.
- Empty state that shows one obvious first action.

### Add URL

Primary purpose: save one URL with minimal friction.

Recommended structure:

- URL input first and visually dominant.
- Title field second.
- Category and tags grouped as optional organization.
- Memo as optional context.
- Favorite as a small star/toggle.
- Save/cancel actions easy to reach on mobile.

### Edit URL

Primary purpose: update context without losing browsing momentum.

Recommended structure:

- Same field order as Add URL.
- Clear display of URL/domain.
- Context fields easy to edit.
- Destructive actions visually separated and secondary.
- Return to previous list/search context after saving when possible.

## Input UX

The core save path must be faster than taking notes manually.

- URL should be the only required field.
- Title should be editable, but users should not need to perfect it before saving.
- Category should be one broad optional label.
- Tags should be optional chips.
- Memo should support short personal context without dominating the form.
- Favorite should be a one-tap mark, not a form section.

The interface should support both "paste and save now" and "add context before saving" without making the second path feel required.

## List And Card Evolution

List view should remain the default because autp is primarily a retrieval tool.

List view should emphasize:

- Title
- Domain or URL
- Favorite state
- Category
- A small number of tags
- Updated or saved date
- Short memo preview when useful

Card view should emphasize:

- Larger title and domain
- Memo preview
- Category and tag chips
- Favorite state
- Clear open/edit action

Both views should use the same information hierarchy. Switching views should change density and presentation, not the meaning of the item.

## Tags, Categories, Search, And Filters

Search should be the most visible retrieval control. Filters should help users narrow results without turning the app into a database admin screen.

- Category should feel like one broad grouping label.
- Tags should feel like flexible, reusable chips.
- Favorite should be a quick filter and visible state.
- Filter chips should appear near search and collapse gracefully on mobile.
- Advanced tag/category management should wait until real usage proves the need.

Avoid a large permanent filter sidebar in the MVP. It is likely too heavy for mobile and too complex for a small personal library.

## Mobile UX

Mobile should be treated as a first-class capture context.

- The add action should be easy to reach.
- Search should stay near the top of the saved list.
- Rows should be compact enough to scan and large enough to tap.
- Tags should wrap cleanly or collapse to a count when space is tight.
- Cards should avoid tall decorative layouts that force excessive scrolling.
- Save/cancel actions should remain reachable after editing fields.
- Filters should use compact chips or later bottom-sheet patterns, not desktop sidebars.

## Empty States And Onboarding

Onboarding should be embedded into the working UI.

Recommended empty states:

- No saved URLs: explain "save links with notes and find them later" and show one primary add action.
- No search results: show the query context and offer clear/reset actions.
- No favorites: explain that favorites keep important links close.
- No category/tag match: make it easy to remove the active filter.

Avoid multi-step onboarding before the user can save a URL. The first successful save should be the main teaching moment.

## Genre Expansion Guardrails

autp can support many genres if the UI keeps stable base concepts:

- Saved item
- URL
- Title
- Category
- Tags
- Memo
- Favorite
- Search

Future genre examples can fit without new modes:

- Fashion: brand, product type, season, and style can begin as tags/categories.
- Shopping: candidate status, price note, and comparison reason can begin in memo/tags.
- Hospital or services: location, department, concern, and follow-up notes can begin in category/memo.
- Student research: class, topic, source type, and assignment can begin as category/tags.

Do not add separate vertical navigation, specialized dashboards, or genre-specific forms until there is evidence that one use case deserves a dedicated product layer.

## Priority UX Improvements

Highest priority:

- Make "paste URL and save" extremely fast.
- Make the empty state communicate the product instantly.
- Make list view scan well with title, domain, category, tags, memo preview, and favorite.
- Keep search prominent.
- Make the mobile add/search/list flow comfortable.

Next priority:

- Refine card view as a richer alternate without making it decorative.
- Add lightweight filter visibility for category, tags, and favorites.
- Improve validation and first-use copy.
- Define a reusable item hierarchy that future genres can share.

Lower priority:

- Vertical-specific templates.
- Automatic metadata previews.
- AI classification controls.
- Complex category/tag management.
- Analytics-style dashboards.
- Public sharing or social presentation.

## UI Complexity To Avoid

Avoid these patterns in the next product direction:

- A landing page before the usable app.
- Required category or tags during save.
- Sidebar-heavy navigation for a small personal library.
- Separate product modes for fashion, hospital, shopping, or student use.
- Too many filters visible at once.
- Cards that hide URL/domain or make items hard to compare.
- Decorative UI that reduces scanability.
- Public/social affordances that imply sharing before the product supports it.
- AI controls that make users unsure whether their own labels or AI labels are authoritative.

## Evaluation Against Council Axes

| Axis | Design Position |
| --- | --- |
| Ease of adoption | Strongest if the product starts as paste URL, add optional context, find later. |
| First-time clarity | The saved URL workspace should be the first screen, with a useful empty state. |
| Viral or shareable potential | Fashion and shopping screenshots may be strongest later, but the base UI should remain neutral. |
| Monetization potential | Shopping/fashion and decision support have future potential, but Design should not add paid cues now. |
| Implementation difficulty | Lowest if UI stays list/card/search with optional fields. Higher if vertical modes or AI controls appear early. |
| Natural MVP extension | Broad personal decision support is the cleanest extension from URL saving. |
| Fit with AI features | Good later for suggestions and summaries, but AI should not replace manual organization in the first experience. |
| Fit with automation | Strong if screens, states, and hierarchy stay predictable for QA and ReviewGate. |
| Security and operational risk | Lower with private saved items and no public/social surface. Higher for hospital-like or public sharing workflows. |
| Decision support | Strongest when cards/lists help users compare why each link mattered, not just store URLs. |

## Recommendation

Design recommends that autp's near-term product direction be:

> A bright, simple personal link-and-context organizer that can later grow into decision support for shopping, fashion, research, services, and AI-assisted organization.

This direction keeps the first experience clear, preserves mobile usability, and gives future verticals room to emerge without breaking the UI. The main design risk is over-specializing too early. The main opportunity is making saved links feel useful at a glance through clean hierarchy, fast input, and lightweight context.

No HumanGate action is requested by this Design / UX proposal.
