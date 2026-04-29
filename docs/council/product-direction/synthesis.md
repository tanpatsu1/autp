# Product Direction Council Synthesis

## Scope

This synthesis integrates the Product, Growth, Design, Data Model, Implementation, QA, and Automation council inputs. It is decision support for the user. It does not implement code, add features, change environment values, run SQL, alter Supabase production data, weaken RLS, create billing, post externally, or launch publicly.

## Executive Recommendation

Recommended direction:

> autp should become an AI-ready private decision board for saved links, introduced first through shopping / purchase candidates, while keeping fashion / brand management as an early template and broader personal decision support as the long-term umbrella.

Short version:

- Base product: private saved links with context.
- First sharp use case: save things you are considering buying, compare them later, and remember why they mattered.
- Early expansion: fashion / brand boards, student research, and other templates over the same saved-link model.
- Foundation first: finish preview verification, then Supabase/Auth/RLS persistence, then filtering and decision-support UI, then Automation v2 and AI assistance.
- User role: the user makes the final direction call; Codex/AI prepares options, plans, implementation, verification, review, and improvement proposals.

## Role Summaries

| Role | Main Position | Strongest Recommendation | Main Caution |
| --- | --- | --- | --- |
| Product | autp should move from "save URLs" to "save candidates and decide later." | Private decision board for saved links, first explained through shopping and fashion/brand candidates. | Do not become a vague generic bookmark archive or a narrow vertical app too early. |
| Growth | The easiest first audience is people comparing purchase candidates across tabs, chats, and notes. | Lead with shopping / purchase decision boards; use fashion as a visual sub-use-case. | Avoid generic bookmark positioning, premature monetization, affiliate activation, and unsupported AI claims. |
| Design | The product should feel like a bright, simple link-and-context organizer. | Keep the first screen as the usable save/search/list tool; support genres through lightweight context. | Avoid a landing-page-first app, heavy sidebars, required taxonomy, vertical modes, or AI controls that confuse user control. |
| Data Model | Stable private URL records should remain the core; templates should layer on top. | Add Supabase/Auth/RLS persistence for current saved URLs before vertical tables or AI annotations. | Do not store sensitive vertical or AI-derived data before ownership, RLS, export/delete expectations, and consent are clear. |
| Implementation | Most future directions can start as saved URL plus structured notes. | Wire the existing MVP to reviewed Supabase/Auth/RLS, then add filters, states, and decision fields. | Do not mix persistence, AI, scraping, sharing, billing, and vertical templates in one PR. |
| QA | The safest direction is private manual decision support with deterministic verification. | Prove Auth/RLS, owner-scoped CRUD, search, categories, tags, preview diagnostics, and no secret exposure before expansion. | Hospital/service comparison, AI-first features, collaboration, public sharing, and monetization are high-risk early. |
| Automation | Product strategy should be broken into small, reviewable, verifiable loops. | Strengthen Automation v2 soon with task scoring, council synthesis, PR readiness, Vercel failure, Supabase diagnostics, and docs sync loops. | Do not let automation bypass HumanGate or make large product jumps from vague strategy. |

## Consensus

The council strongly agrees on these points:

- The current MVP should remain the foundation: URL, title, category, tags, memo, favorite, search, edit/delete, and card/list views.
- autp should not be positioned as only a generic URL manager; it needs a sharper return reason.
- The strongest near-term product idea is "saved links as candidates for a decision."
- Shopping / purchase candidates are the clearest first wedge because the value is obvious, frequent, visual, and low-risk compared with medical or public/social use cases.
- Fashion / brand management is important and promising, but should begin as a template or example inside the broader decision-board direction.
- Hospital / service / life information management is valuable but should not be the first headline direction because privacy, trust, and advice-risk are higher.
- Supabase/Auth/RLS-backed persistence is a prerequisite before serious expansion, AI output storage, templates, collaboration, sharing, or monetization.
- Tags, categories, search, and UI clarity are not minor polish; they are the core organization layer that makes future AI and templates useful.
- AI should assist with summaries, grouping, tag/category suggestions, and comparison drafts later, but manual user-entered context must remain the source of truth first.
- Automation v2 should be strengthened early enough to guide safe task selection, PR readiness, Vercel/Supabase diagnostics, docs sync, and Review Gate checks before large feature growth.
- User decisions remain final; Codex should recommend, compare, implement, verify, and review, but not silently choose major business direction, billing, launch, or external actions.

## Material Differences

| Topic | Difference | Synthesis |
| --- | --- | --- |
| Product label | Product and Growth prefer a sharper "decision board" or "shopping board"; Design prefers broad "link-and-context organizer"; Implementation says "AI-ready bookmark and decision organizer." | Use a layered message: internally "AI-ready private decision board"; first user-facing wedge "save and compare things you might buy"; base capability "private saved links with context." |
| First vertical | Growth strongly favors shopping; Product favors shopping/fashion/service candidates; Design avoids vertical lock-in; Data/QA warn against sensitive verticals. | Start with shopping / purchase candidates as the example. Keep fashion / brand as the first template candidate. Keep student research second. Defer hospital/service as a sensitive template. |
| Automation timing | Implementation puts Supabase/Auth persistence first; Automation wants Automation v2 soon after synthesis. | Do both early in sequence: finish preview verification, then Supabase/Auth persistence as the first implementation foundation, with Automation v2 docs/rubrics before large AI or vertical feature expansion. |
| AI timing | Growth sees AI as monetizable; Automation sees AI as product multiplier; QA/Data/Implementation warn about cost, privacy, prompt injection, and storage. | Defer AI execution until persistence, user identity, AI result storage, consent, cost controls, and evaluation fixtures exist. Prepare AI evaluation docs before AI features. |
| Generic vs specialized | Generic URL management is flexible but bland; narrow fashion/hospital apps are clearer but risky or niche. | Keep one generic core and add optional templates. Do not fork separate apps or modes until usage proves demand. |

## Direction Comparison Matrix

Scores are directional, 1 low to 5 high. Higher is better except security / operational risk, where higher means safer / lower risk.

| Direction | Used Easily | First-Time Clarity | Buzz | Monetization | Implementation Ease | MVP Extension | AI Fit | Automation Fit | Security / Ops Safety | User Decision Clarity | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Generic URL management app | 4 | 3 | 2 | 2 | 5 | 5 | 3 | 5 | 5 | 3 | 37 |
| AI bookmark organizer | 4 | 3 | 3 | 4 | 2 | 4 | 5 | 4 | 3 | 3 | 35 |
| Fashion / brand manager | 4 | 4 | 4 | 4 | 3 | 4 | 4 | 4 | 3 | 4 | 38 |
| Shopping candidate manager | 5 | 5 | 4 | 4 | 4 | 5 | 4 | 5 | 4 | 5 | 45 |
| Hospital / life information manager | 3 | 4 | 2 | 3 | 2 | 3 | 2 | 3 | 1 | 3 | 26 |
| Student links / assignments / procedures manager | 4 | 4 | 3 | 3 | 3 | 4 | 4 | 5 | 4 | 4 | 38 |
| SNS-found products / shops / info saver | 5 | 4 | 5 | 4 | 3 | 4 | 4 | 4 | 3 | 4 | 40 |
| Broad personal decision workspace | 3 | 3 | 3 | 4 | 3 | 5 | 4 | 5 | 4 | 5 | 39 |
| Creator / small-team brand link manager | 3 | 3 | 3 | 4 | 2 | 3 | 4 | 3 | 2 | 3 | 30 |

## Candidate Decisions

### 1. Generic URL Management App

Good as the base layer, weak as the headline. It is easy to implement and safe, but users may compare it with browser bookmarks, Notion, spreadsheets, Raindrop, or note apps. Keep generic URL saving as the core, not the final positioning.

### 2. AI Bookmark Organizer

Strong long-term layer, but too risky as the immediate promise. AI summaries, auto-classification, embeddings, and chat-style retrieval need persistence, consent, cost controls, prompt-injection checks, and QA fixtures. Treat AI as a later assistant on top of user-owned saved links.

### 3. Fashion / Brand Manager

Important and emotionally compelling. It can be visually strong and align with the user's fashion / brand ideas. It should be an early template inside the broader shopping / decision-board product, not the whole product yet. This avoids narrowing autp before the core loop is proven.

### 4. Shopping Candidate Manager

Best first wedge. It is easy to understand, frequent, screenshot-friendly, monetizable later, and maps directly onto URL, title, tags, category, memo, favorite, search, and card/list views. It should avoid early price scraping, affiliate activation, checkout, or purchase automation.

### 5. Hospital / Life Information Manager

Useful, but not a first product direction. Health, provider, appointment, insurance, or life-admin notes can be sensitive. The app must not imply medical advice or ranking authority. Keep this as a later private template after Auth/RLS, privacy copy, export/delete expectations, and Review Gate checks are stronger.

### 6. Student Links / Assignments / Procedures Manager

Good secondary template. It fits saved links, notes, projects, source status, and AI summaries later. Monetization is weaker for individuals, and citation/export expectations can grow quickly, so it should follow persistence and generic organization improvements.

### 7. SNS-Found Products / Shops / Info Saver

Strong growth angle because many users discover products, shops, restaurants, services, and ideas through SNS and lose them in feeds or chats. This should be framed as "save things you found online for later decision," not as automatic SNS posting or public sharing. External posting remains HumanGate.

### 8. Broad Personal Decision Workspace

Best long-term umbrella, but too abstract as the first message. It should become the product architecture and roadmap frame after shopping/fashion examples make the value obvious.

### 9. Creator / Small-Team Brand Link Manager

Potentially monetizable later, but collaboration, permissions, public pages, and team workflows expand RLS and QA significantly. Defer until single-user private persistence is trusted.

## Recommended Direction By Role Lens

| Lens | Why The Recommended Direction Wins |
| --- | --- |
| Product | It solves a sharper problem than bookmarking: users need to remember why each saved option mattered and decide later. |
| Growth | Shopping / purchase candidates are easy to explain in one sentence and visible in screenshots without external posting. |
| Design | The UI can stay simple: paste URL, add optional context, search, filter, compare. Vertical examples do not require separate apps. |
| Data Model | The existing saved URL schema remains valid; templates and AI annotations can be layered after owner-scoped persistence. |
| Implementation | It supports small PRs: persistence, filters, status, decision notes, comparison UI, templates, then AI. |
| QA | The manual private flow is deterministic and testable before adding AI, sharing, billing, or sensitive claims. |
| Automation | It can be decomposed into task-board items, council reviews, PR readiness checks, Vercel/Supabase diagnostics, and safe verifications. |

## Next Build Sequence

This sequence intentionally separates foundation, product utility, automation, templates, AI, and monetization.

1. Finish current deployment / preview verification for the URL Saving MVP.
2. Ask the user to confirm or adjust the recommended direction and first wedge.
3. Implement Supabase/Auth/RLS-backed persistence for the existing MVP only.
4. Verify owner-scoped CRUD, category/tag joins, search, delete, and signed-out behavior in local/preview environments.
5. Add category/tag/favorite filters, sort controls, stronger empty/loading/error states, and mobile capture polish.
6. Add one generic decision-support slice: status, decision note, pros/cons or next-check fields.
7. Add Automation v2 docs and rubrics: task scoring, council synthesis checklist, PR readiness, Vercel failure taxonomy, Supabase preview diagnostics, AI evaluation rubric, and DocsSync rules.
8. Add shopping / purchase candidate template as the first concrete template.
9. Add fashion / brand template as the next template, using optional fields rather than a separate app.
10. Add student research template if the user wants an acquisition / learning use case.
11. Prepare AI assistance with docs-only evaluation first, then user-triggered summaries and tag/category suggestions.
12. Explore monetization only after the save-find-compare loop, persistence, privacy expectations, and AI cost/quality controls are credible.

## What To Build Next

### Most Urgent Foundation

- Complete `NEXT-006` Vercel preview verification.
- Then build Supabase/Auth/persistence for the existing URL-saving MVP.
- Do not add new product features inside the persistence PR.

### Next Product Utility

- Category, tag, favorite filters.
- Sort controls.
- Better empty/no-results/loading/error states.
- Mobile add/search/list comfort.
- Decision status and decision note after persistence is stable.

### Next Automation Utility

- Automation v2 docs-first plan.
- Task scoring rubric.
- PR readiness checklist.
- Vercel failure classifier.
- Supabase preview diagnostic matrix.
- AI evaluation rubric before AI implementation.

### Deferred Product Expansion

- Shopping template.
- Fashion / brand template.
- Student research template.
- Hospital / life information template only after stronger privacy and Review Gate work.

## User Decision Points

The user should decide:

1. Is the recommended direction acceptable: "AI-ready private decision board for saved links"?
2. Should the first wedge be shopping / purchase candidates, fashion / brand boards, or broader personal decision support?
3. Should fashion / brand management be the first template after generic decision fields?
4. Should hospital / life information remain a later private template rather than a headline product?
5. Should Supabase/Auth persistence be the next implementation priority after preview verification?
6. Should Automation v2 be prioritized before AI features and vertical templates?
7. Should AI begin with summaries, tag/category suggestions, grouping, comparison drafts, or chat-style retrieval?
8. What level of monetization exploration is acceptable later: limits, premium templates, AI credits, export, shared boards, or affiliate experiments?
9. What privacy/export/delete expectations must be satisfied before real personal data use?
10. What tone should the product use: "shopping board", "decision board", "saved links with context", or another phrase?

## HumanGate Items

No HumanGate action is requested or executed by this synthesis.

Future work must still stop before:

- SNS or external public posting.
- Billing, purchases, paid plans, affiliate activation, domains, or paid services.
- Real env values, secrets, or service role keys.
- Supabase production DB changes, production SQL, production data deletion, table deletion, or weaker RLS.
- Final public production launch.

## Synthesis Decision

Status: Council recommendation ready for user decision.

Recommended path: build autp as an AI-ready private decision board for saved links, first explained through shopping / purchase candidates, with fashion / brand as an early template and sensitive verticals deferred.

Safe next task: complete URL Saving MVP preview verification, then proceed to Supabase/Auth/RLS persistence only after the user confirms or adjusts the direction.
