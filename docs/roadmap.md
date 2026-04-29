# Roadmap

## Roadmap Principle

Do not rush into new features before the foundation is trustworthy. autp should move from a local-first URL MVP to a private persisted decision board, then add organization, templates, automation, AI, and monetization in controlled stages.

## Phase 0: Current Verification

Goal: prove the current local-first MVP in deployment / preview.

- Complete Vercel preview verification for the URL Saving MVP.
- Confirm the app loads without runtime errors.
- Confirm no visible secrets or env values appear.
- Record blockers separately as app, config, schema drift, platform, or unknown.

Exit criteria:

- `npm run verify` passes.
- Preview result is recorded.
- No High or Medium Review Gate issue is open for the current MVP.

## Phase 1: Supabase/Auth/RLS Persistence

Goal: make the existing MVP durable and private.

- Add Supabase Auth flow.
- Apply reviewed schema and RLS in a safe local/preview path.
- Persist saved URLs, categories, tags, joins, memo, favorite, and timestamps.
- Verify signed-out denial and two-user separation.
- Keep public env names only.
- Do not add AI, sharing, billing, templates, scraping, or public launch.

Exit criteria:

- Signed-in user can create, read, update, favorite, search, and delete only their own records.
- Categories and tags cannot cross users.
- RLS tests or manual two-user checks pass.
- Preview diagnostics are documented.

## Phase 2: Organization And Retrieval

Goal: make the base product feel useful every day.

- Category filter.
- Tag filter.
- Favorite filter.
- Sort by updated, created, title, and favorite.
- Better empty, loading, error, and no-results states.
- Mobile add/search/list polish.
- Result count and clear active filters.

Exit criteria:

- Users can quickly find saved items without relying on AI.
- Filter/search behavior is owner-scoped and verified.
- UX remains simple on mobile and desktop.

## Phase 3: Generic Decision Support

Goal: turn saved links into candidates.

- Decision status: considering, shortlisted, decided, rejected.
- Decision note: why this link matters or why the user chose/rejected it.
- Optional pros/cons or next-check fields.
- Comparison-friendly card/list refinements.
- Saved filters for important decision states only if needed.

Exit criteria:

- The app can support shopping, fashion, school, service, and research decisions without vertical-specific modes.
- The first repeat-use loop is visible: save, revisit, compare, decide.

## Phase 4: Automation v2

Goal: reduce user prompting and keep autonomous work safe.

- Task scoring rubric.
- Council synthesis checklist.
- PR readiness checklist.
- Vercel failure classifier.
- Supabase preview diagnostic matrix.
- AI evaluation rubric.
- DocsSync loop rules.

Exit criteria:

- Codex can identify the next safe task more reliably.
- PRs carry verification, scope, safety, and docs alignment evidence.
- HumanGate boundaries remain explicit.

## Phase 5: First Templates

Goal: test concrete use cases without fragmenting the product.

Suggested order:

1. Shopping / purchase candidate template.
2. Fashion / brand template.
3. Student research template.
4. Hospital / life information template only after privacy and safety review.

Templates should start as suggested fields, categories, tags, and copy. They should not introduce public sharing, billing, scraping, or AI by default.

Exit criteria:

- A user can start with one template and still use the same core saved-link model.
- Templates can be tested with ordinary CRUD/search/filter flows.

## Phase 6: AI Assistance

Goal: add AI where it reduces repeated organization work.

- Docs-only AI evaluation plan first.
- User-triggered summary.
- Suggested tags/categories with accept/reject.
- Group similar saved items.
- Draft comparison notes.
- Later chat-style retrieval over the user's saved items.

Exit criteria:

- AI outputs are stored as derived annotations with owner scope and provenance.
- Users control whether AI suggestions are saved.
- Cost, privacy, error, and prompt-injection risks are reviewed.

## Phase 7: Growth And Monetization Experiments

Goal: explore sustainable growth after the core habit works.

- Onboarding and FAQ drafts.
- Non-public launch copy drafts.
- Free/paid plan sketches.
- Premium template or AI-credit concepts.
- Export and shared board proposals.
- Affiliate or partner ideas only after explicit human approval.

Exit criteria:

- Monetization is a proposal, not an executed billing action.
- Public posting, paid plans, domains, affiliate activation, and final launch remain HumanGate.

## Recommended Immediate Sequence

1. Finish `NEXT-006` preview verification.
2. User confirms or adjusts the recommended product direction.
3. Plan and implement Supabase/Auth/RLS persistence for the current MVP only.
4. Add organization/retrieval improvements.
5. Add generic decision support.
6. Add Automation v2 docs and rubrics before larger AI or vertical expansion.
