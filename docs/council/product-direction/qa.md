# Product Direction Council: QA / Risk

## Role

- Role: QA / Risk
- Branch: `codex/council-qa`
- Date: 2026-04-29
- Scope: Product direction proposal only. No code, SQL execution, external posting, environment values, service role keys, Supabase production changes, billing, or production launch.

## Read Context

- Read: `AGENTS.md`
- Read: `docs/compact-context.md`
- Read: `docs/current-status.md`
- Read: `docs/mvp-scope.md`
- Read: `docs/product-spec.md`
- Read: `docs/data-model.md`
- Read: `docs/supabase-schema.md`
- Read: `docs/rls-policy.md`
- Read: `docs/automation-policy.md`
- Read: `docs/automation-runbook.md`
- Read: `docs/council/product-direction/brief.md` from HEAD because the working-tree copy is currently deleted.
- Also reviewed existing council context in `product.md` and `design.md` without editing them.

## QA Position

QA should support a direction that keeps the first public value easy to verify: private URL saving, user-entered context, search, favorite, and a small decision-support layer. The safest growth path is a private decision board for saved links, introduced through shopping or fashion/brand candidates, because it extends the current MVP without adding public sharing, payment, medical claims, collaboration permissions, or AI-dependent correctness.

The highest QA risk is not the basic URL-save flow. The fragile parts are identity, persistence, cross-user data separation, deletion, search across related tables, preview environment drift, and any feature that makes claims from private user data through scraping or AI.

## Risk Comparison

| Direction | Testability | User Harm Risk | Data / Privacy Risk | AI Quality Risk | Overall Risk | QA Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Private decision board for saved links | High | Low | Medium | Low until AI is added | Medium | Best next direction if it remains private and manual-first. Status, decision note, pros/cons, and simple comparison can be tested with deterministic CRUD and search cases. |
| Shopping decision board | High | Low-Medium | Medium | Medium later | Medium | Strong fit with MVP. Risk rises if price tracking, affiliate links, recommendations, alerts, checkout, or purchases enter scope. |
| Fashion / brand manager | Medium-High | Low-Medium | Medium | Medium later | Medium | Works well with saved links, tags, images, and notes. Risk rises with image fetching, brand claims, affiliate monetization, and public sharing. |
| AI bookmark manager | Medium | Medium | High | High | High | AI summary, classification, and retrieval quality are hard to prove. Needs privacy controls, user confirmation, prompt-injection defenses, and evaluation fixtures before release. |
| Hospital / service comparison | Medium | High | High | High | High | Sensitive notes and perceived advice create trust and compliance risk. Do not lead with this direction until privacy, disclaimers, RLS, retention, export/delete, and safety copy are mature. |
| Student research organizer | Medium | Medium | Medium | Medium-High | Medium | Feasible later, but citation/export expectations and AI summary accuracy can expand scope quickly. Keep as template only after the core save/search loop is stable. |
| Creator/team brand link manager | Medium | Medium | High | Medium | High | Multi-user sharing, permissions, comments, public pages, and external posting would require a much larger auth and RLS test matrix. Defer collaboration. |

## Most Fragile Candidate Features

| Feature | Risk Level | Why It Breaks Easily | QA Guardrail |
| --- | --- | --- | --- |
| Supabase/Auth persistence | High | Missing sessions, preview env drift, auth callback issues, and stale generated types can make local success differ from preview. | Require local and preview auth checks, explicit env-name diagnostics, and no real env values in docs or code. |
| RLS and user data separation | High | A single permissive policy, missing owner predicate, or unsafe join can leak saved URLs, categories, tags, or memos across users. | Block release until cross-user select/update/delete/search/link tests pass. |
| Search across URLs, categories, tags, and memos | Medium-High | Joined search can accidentally widen scope or miss owner filters. | Verify every query path with User A/User B fixtures and keyword collisions. |
| Delete behavior | Medium-High | User-owned delete is legitimate, but cascade rules can remove related rows unexpectedly. Production data deletion remains HumanGate. | Test only own-row deletion, join-row cascade, and denial for other users. Keep production deletion out of automation. |
| AI summaries and classification | High | Prompt injection, hallucinated summaries, wrong tags, privacy leakage, cost drift, and hidden automation can erode trust. | Make AI optional, explainable, user-confirmed, non-authoritative, and covered by fixed evaluation samples. |
| Page metadata scraping or previews | Medium-High | External pages fail, block requests, contain malicious content, or change markup. | Defer until base MVP works; treat scraping as best-effort and sanitize displayed content. |
| Public sharing and SNS | High | Privacy, abuse, moderation, launch, and external posting risk. | HumanGate before any public post, public page, or shareable collection launch. |
| Monetization, affiliate, paid plans | High | Billing, legal copy, partner rules, and purchase-adjacent flows are high-risk. | HumanGate before billing, paid plans, purchases, affiliate activation, or domain actions. |
| Genre templates | Medium | Data model and UI can fragment if each genre adds fields, filters, and claims too early. | Start with generic status/decision note/pros/cons before specialized tables or screens. |

## Supabase, Auth, And Persistence Risks

QA should treat Supabase/Auth readiness as a release gate for any persistent MVP:

- Auth must be required before saved URL data is readable or writable.
- `owner_id = auth.uid()` must be the hard boundary for `saved_urls`, `categories`, and `tags`.
- `saved_url_tags` must prove both linked records belong to the same authenticated user.
- Client code must use only the public anon/publishable key with the signed-in session.
- Service role keys must not be used by the app, tests, automation, or preview diagnostics.
- Missing preview env names must be classified as configuration blockers, not fixed by committing real values.
- Generated Supabase types should match reviewed schema and should not include secrets.
- Preview schema drift must be separated from app bugs before fixes are proposed.

## RLS And User Data Separation

High-risk RLS cases that must block release:

- Signed-out users can read private saved URL data.
- User A can read, search, update, delete, or link User B data.
- User A can assign their saved URL to User B category or tag.
- `owner_id` can be changed after insert.
- Search or relation queries return rows not owned by the current user.
- A policy is weakened to make preview or local development pass.

QA should require two-user fixtures for every persistent feature. Search tests should include the same keyword in both users' titles, tags, categories, and memos to prove no cross-user leakage.

## AI Summary And AI Classification Risks

AI should stay out of the critical path until manual saving, search, and RLS are stable. When AI is added later, QA should require:

- User confirmation before AI-created tags, categories, summaries, or comparison notes are saved.
- Clear labeling that AI output is a draft, not a fact source or expert recommendation.
- No silent processing of private memos for public or external output.
- Prompt-injection tests using hostile page text and misleading saved content.
- Regression samples for short pages, long pages, non-English pages, paywalled pages, product pages, and pages with conflicting claims.
- Safety boundaries for medical, financial, legal, purchasing, and public-posting contexts.
- Cost and rate-limit failure handling before enabling recurring AI jobs.

AI features that generate medical, financial, purchase, or public-facing advice should be treated as High risk and routed to Review Gate and HumanGate before release planning.

## HumanGate Targets

The following must not be executed automatically:

| Area | HumanGate Trigger | QA Recommendation |
| --- | --- | --- |
| Public sharing | Public pages, share links, SEO pages, SNS posting, comments on external sites | Require exact scope, copy, privacy model, abuse controls, and launch checklist approval. |
| Monetization | Billing, paid plans, affiliate activation, checkout, purchases, paid domains | Require explicit human approval before any setup, copy, or external account action. |
| Production data | Production DB changes, production data deletion, table deletion, destructive migrations | Require migration plan, rollback plan, backup/restore expectations, and human approval. |
| RLS | Any weaker RLS, temporary public access, or anonymous private-data read policy | Block; do not route as a normal QA failure. |
| Secrets | Real env values, service role keys, tokens, or credentials | Block and route to Feedback Inbox if requested. |
| Launch | Final public production launch | Require human approval, release checklist, preview verification, and known-risk signoff. |

## Genre Expansion Risks

Genre expansion should be data-light at first. Categories, tags, memo, favorite, and a generic decision status can cover shopping, fashion, service research, student research, and personal reading without new tables.

Risk rises when a genre adds specialized fields:

- Shopping can pull in price tracking, alerts, affiliate monetization, and purchase flows.
- Fashion can require image handling, size/color variants, brand metadata, and public wishlists.
- Hospital/service research can create sensitive health or appointment notes and perceived medical advice.
- Student research can require citations, export formats, academic integrity boundaries, and AI accuracy checks.
- Team/creator workflows require invitations, roles, sharing permissions, audit history, and collaboration RLS.

QA recommendation: add one generic decision-support slice first, then validate whether genre templates can be represented as labels and optional fields before adding vertical-specific schema.

## Recommended Verification Order

1. Local static checks: `npm run verify` must pass for every PR.
2. Auth gate: signed-out users cannot access private saved URL screens or data operations.
3. Basic persistence: signed-in user can create, read, update, favorite, and optionally delete only their own saved URLs.
4. Relationship safety: categories, tags, and join rows cannot cross owners.
5. Search safety: search returns only the current user's matching URLs, categories, tags, and memos.
6. UI flows: save, edit, favorite, search, filter, card/list toggle, empty state, no-results state, and mobile layout.
7. Preview diagnostics: Vercel preview loads, public env names exist, Supabase schema is present, and failures are classified as app, config, schema drift, or platform.
8. Browser checks: no console errors, no visible secrets, no broken navigation, and no hydration/runtime failures.
9. AI checks only after the manual flow is stable: summary/classification eval fixtures, prompt-injection samples, user-confirmation path, cost/rate-limit behavior.
10. Launch checks last: HumanGate approval, release checklist, rollback notes, and production readiness review.

This order keeps the most security-sensitive checks early and delays AI/public/monetization risks until the private data boundary is proven.

## Risk Register

### High Risk

| Item | Release Impact | Required Control |
| --- | --- | --- |
| Cross-user data exposure through RLS, joins, or search | Must block release | Two-user RLS tests and Review Gate approval. |
| Service role key use in app or automation | Must block release | Use only public client credentials; route any service role need to HumanGate. |
| Production DB mutation from automation | Must block release | Keep migrations preview/local until explicitly approved. |
| Public sharing or SNS posting | Must block release unless approved | HumanGate and launch checklist. |
| AI-generated advice for medical/financial/purchase decisions | Must block release | Limit AI to draft organization; add disclaimers and human-reviewed scope. |
| Billing, paid plans, affiliate activation, or domain purchase | Must block release unless approved | HumanGate before external setup or spend. |

### Medium Risk

| Item | Release Impact | Required Control |
| --- | --- | --- |
| Preview env or schema drift | Can block verification | Diagnose separately from app bugs and do not commit real values. |
| Search/filter correctness | Can cause trust failures or hidden leakage | Owner-scoped query tests and deterministic fixture data. |
| Delete and cascade behavior | Can cause data loss | Own-row-only tests, clear UI confirmation, and no production destructive automation. |
| Genre template expansion | Can cause schema/UI fragmentation | Add generic fields first; require data-model review for specialized fields. |
| Metadata scraping | Can be flaky and unsafe | Defer or sandbox; sanitize all output and make it best-effort. |
| Mobile layout regressions | Can hurt capture flow | Browser/responsive checks for add/search/list/edit. |

### Low Risk

| Item | Release Impact | Required Control |
| --- | --- | --- |
| Card/list toggle as local UI state | Mostly presentation risk | Verify the same result set appears in both views. |
| Empty and no-results states | UX trust risk | Visual/browser checks and clear recovery actions. |
| Manual category/tag labels | Data quality risk | Trim, normalize, and deduplicate per user. |
| Favorite flag | Low data risk | Verify toggle persistence and filtering. |

## Vercel And Supabase Operational Risks

- Vercel builds can pass while runtime preview fails because Supabase env names are absent or schema is missing.
- Supabase Preview Branch limitations should be documented as platform/config constraints, not patched by weakening RLS.
- Preview deployments must not display env values or tokens in errors, logs exposed to users, or rendered pages.
- Build-time generated types can become stale after schema edits; QA should compare expected fields before feature PR approval.
- Auth callback URLs and allowed origins can differ between local, preview, and production; preview checks must include sign-in/out when auth UI exists.
- Rate limits, cold starts, and network failures should be tested for AI/scraping jobs before those features are user-facing.

## Next-Phase QA Checklist

Before the next implementation phase is considered ready:

- `npm run verify` passes locally and in CI.
- No files contain real env values, tokens, or service role keys.
- Signed-out users cannot access private saved URL data.
- User A and User B cannot see or mutate each other's saved URLs, categories, tags, memos, joins, search results, or delete paths.
- Create, list, edit, favorite, search, and card/list flows work for the authenticated user.
- Category/tag normalization and duplicate handling are tested per user.
- Delete behavior, if implemented, is limited to the current user's own data and related join rows.
- Vercel preview is checked for page load, runtime errors, console errors, missing env-name diagnostics, and visible secret leakage.
- Supabase schema and RLS in preview match the reviewed proposal.
- AI, scraping, public sharing, billing, affiliate, domain, and final launch features remain deferred or explicitly HumanGate-approved.
- Review Gate confirms the PR scope did not add public posting, paid actions, weaker RLS, production DB changes, service role keys, or final launch.

## QA Recommendation Draft

- Safest direction to validate: private decision board for saved links, starting with shopping or fashion/brand candidates as examples while keeping the core data model generic.
- Riskiest direction: hospital/service comparison, public sharing, collaboration, monetization, or AI-first bookmark automation before Auth/RLS/persistence are proven.
- Best development sequence: finish private URL-saving persistence and RLS, then add generic decision status/decision note, then comparison-friendly UI, then optional genre templates, then carefully gated AI assistance.
- Must-have acceptance criteria: private per-user CRUD, owner-safe category/tag joins, owner-scoped search, no secret exposure, preview diagnostics, and clear HumanGate handling.
- Questions for Review Gate: Are all queries owner-scoped? Are RLS policies enabled before app access? Are any features implying medical, financial, purchase, public, or AI authority? Are any operations trying to bypass HumanGate?

No HumanGate action is requested by this QA / Risk proposal.
