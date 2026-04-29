# Product Perspective

## Role Scope

Product should frame which user problems autp could own, how the current URL Saving MVP can expand naturally, and which options deserve deeper review. This file does not decide the final direction.

## Product Thesis

autp should grow from "save URLs" into a personal decision workspace: a private place where users collect candidates, add context, compare options, and come back until they choose. The strongest Product direction is not a generic bookmark archive, but a lightweight decision-support tool that starts with saved links and gradually adds comparison, reminders, AI assistance, and optional vertical templates.

The product should stay broad at the platform level but opinionated at the first use case. The first audience should be people who repeatedly compare online options before making a choice, because they feel the pain often, understand the value quickly, and naturally return to update notes, favorites, and decisions.

## User Problem To Own

Users do not only lose links. They lose the reason a link mattered, the tradeoffs between similar options, and the next action needed to make a final decision.

autp should become best at helping users answer:

- What did I save?
- Why did I save it?
- Which option is currently strongest?
- What do I still need to check?
- What did I decide, and why?

## Initial Audience Hypothesis

The first audience should be individual consumers comparing purchase or service options over multiple sessions.

Good early examples:

- Shopping candidates: gadgets, furniture, beauty, gifts, subscriptions, travel items.
- Fashion and brand candidates: clothes, bags, shoes, cosmetics, brands to follow.
- Local service research: clinics, salons, lessons, repair shops, venues.

This audience is better than "everyone with bookmarks" because the job is clearer: save candidates, compare them, and decide. It is also safer than starting with medical or financial advice, because autp can support user notes and comparison without making expert recommendations.

## Repeat-Use Loop

The product should create repeat usage through an open decision loop:

1. User saves a candidate URL.
2. User adds quick context: category, tags, memo, favorite.
3. User returns when considering the same purchase, brand, service, class, or research topic.
4. User compares saved candidates, updates notes, and marks favorites.
5. User either decides, rejects, or keeps watching.
6. Later, AI can help summarize, cluster, detect missing information, or draft comparison notes, but it should not replace the user's decision.

This loop extends the current MVP naturally because the MVP already has URL, title, category, tags, memo, favorite, search, and card/list views.

## Directions To Compare

| Direction | User Problem | Why It Could Work | Main Product Risk | MVP Extension Fit |
| --- | --- | --- | --- | --- |
| AI bookmark manager | Users save too many links and need help finding or summarizing them. | Easy to explain as "smarter bookmarks"; strong AI fit. | Too generic; users may not feel urgent value until there are many links. | Medium: current search/tags help, but AI summaries/classification are deferred. |
| Shopping decision board | Users compare candidates before buying and need notes, favorites, and tradeoffs. | Clear job, frequent use, easy first screen, natural path to comparison features. | Could become price-tracking or affiliate-commerce too early. | High: current URL + memo + favorite already maps to candidates. |
| Fashion / brand manager | Users collect clothes, brands, wishlists, inspiration, and purchase candidates. | Strong visual appeal, repeat browsing, clear personal value. | Can narrow the product too soon and require image-heavy UX. | High for tags/categories; medium for visual asset needs. |
| Hospital / service comparison | Users compare clinics, hospitals, appointments, services, locations, and notes. | High-stakes decisions create strong need for organization. | Medical sensitivity and trust risk; must avoid advice claims. | Medium: link/memo works, but risk and data sensitivity are higher. |
| Student research organizer | Students collect sources, notes, citations, and study links. | Repeat use, clear organization need, AI summary potential. | Seasonal use; may require citation/export features quickly. | Medium-high: tags/memos/search fit well, but academic workflow adds scope. |
| Brand / product link manager for creators or small teams | Users collect brands, references, potential partners, and content links. | Could grow into collaboration and monetization later. | Multi-user sharing and public workflows are deferred. | Medium: private MVP fits solo use, team value comes later. |
| General personal decision workspace | Users compare any set of online candidates before deciding. | Broadest long-term positioning and can host vertical templates later. | First-time message can feel abstract without a concrete use case. | High if launched through a concrete first template like shopping/fashion. |

## Evaluation Notes

| Axis | Product View |
| --- | --- |
| Ease of adoption | Shopping/fashion/service comparison is easiest because users already save candidates informally in notes, screenshots, tabs, or chat. |
| First-time clarity | "Save and compare things you are considering" is clearer than "AI bookmark manager." A concrete first template beats a broad platform claim. |
| Viral potential | Public sharing is deferred, but shopping/fashion lists can later become shareable wishlists or recommendation pages after HumanGate-approved launch planning. |
| Monetization potential | Shopping/fashion/service decision support has future paths through premium organization, reminders, AI summaries, and optional affiliate partnerships, but monetization should not be part of the first MVP. |
| Implementation difficulty | Shopping decision support is the lowest-friction extension from current data. Hospital, student, and team workflows need more specialized fields. |
| MVP extension fit | Shopping candidates and fashion/brand management fit the existing URL/title/category/tag/memo/favorite model best. |
| AI fit | AI is best as a later assistant for summaries, clustering, missing-info prompts, and comparison drafts. AI classification should remain optional and reviewable. |
| Automation fit | Product direction should keep specs deterministic so future role council, PR auto-review, QA, and DocsSync loops can evaluate small feature slices. |
| Security / operations risk | Private shopping/fashion research is lower risk. Hospital/service comparison needs sensitive-data warnings and stricter review. |
| Decision support strength | Shopping/service/fashion candidates have strong "choose one" behavior; generic bookmarks often stop at storage. |

## Recommended Product Direction For Discussion

Product's recommended direction for later synthesis is:

autp should become a private decision board for saved links, starting with shopping and fashion/brand candidates as the first understandable use case.

This direction keeps the current MVP intact while giving it a sharper promise:

- Not just "save links."
- "Keep the options you are considering, compare them, and decide later."

The product can still support generic URL saving, but the first narrative should focus on candidate management because it gives users a reason to return.

## Suggested Product Evolution

### Phase 1: Current MVP

- Private URL saving.
- Title, category, tags, memo, favorite.
- Search.
- Card/list views.
- Edit/delete if Implementation scope includes it.

### Phase 2: Candidate Decision Support

- Status: considering, shortlisted, decided, rejected.
- Lightweight decision note.
- Simple comparison fields that remain generic: price text, priority, pros, cons, next check.
- Filter by favorite/status/category/tag.
- Empty states and examples for shopping/fashion/service candidates.

### Phase 3: Vertical Templates

- Shopping template: price, store, deadline, purchase status.
- Fashion/brand template: brand, size, color, season, occasion.
- Student research template: source type, assignment/project, citation note.
- Service comparison template: location, contact, appointment note, caution around sensitive advice.

Templates should customize metadata and copy, not fragment the core product into separate apps.

### Phase 4: AI Assistance

- Summarize a saved page when safe and technically reviewed.
- Suggest tags/categories, with user confirmation.
- Group similar candidates.
- Draft comparison notes.
- Point out missing decision information.

AI should assist user judgment. It should not auto-post, purchase, give medical/financial advice, or silently classify private data without review.

## What To Build Soon

- Strong empty state and example categories for candidate saving.
- Candidate status field after the base MVP works.
- Decision note or "why this matters" field.
- Better filters for category, tag, favorite, and status.
- A comparison-friendly card layout.
- Import-safe language that frames AI as optional later assistance.

## What To Defer

- Public pages and SNS sharing.
- Multi-user collaboration.
- Billing and affiliate monetization.
- Browser extension.
- Full automatic scraping.
- AI automatic classification.
- Price tracking and alerts.
- Medical-specific workflows.
- Citation/export-heavy student workflows.

## What To Avoid For Now

- Positioning autp as a generic "AI bookmark manager" only. It is understandable, but not urgent enough.
- Starting with hospital/medical comparison as the lead vertical. The need is real, but trust and safety risks are too high for the first direction.
- Splitting into many vertical modes before the core decision loop is proven.
- Making AI the center before users trust the manual save, memo, favorite, and compare loop.
- Adding public/social growth loops before privacy, ownership, and HumanGate rules are fully settled.

## Key Risks

| Risk | Product Concern | Mitigation |
| --- | --- | --- |
| Too broad | "Save anything" can become forgettable. | Lead with candidate decisions and use examples. |
| Too narrow | Fashion-only may exclude other high-frequency use cases. | Use shopping/fashion as the first template, not the whole product. |
| AI overpromise | Users may expect automatic understanding and perfect classification. | Keep AI as later assistive features with confirmation. |
| Sensitive verticals | Hospital/service comparison can imply advice. | Treat as later template with strong boundaries and Review Gate input. |
| Feature creep | Decision support can pull in price tracking, public lists, accounts, sharing, and billing. | Keep Phase 2 fields generic and private. |

## Questions For Other Roles

- Design: Can "decision board for saved links" be understood on the first screen without a tutorial?
- Data Model: Which generic fields support candidate status and decision notes without overfitting to shopping?
- Implementation: What is the smallest post-MVP slice that adds decision support without destabilizing URL saving?
- Growth: Which phrase is clearest: "save and compare options," "personal decision board," or "AI bookmark manager"?
- QA: Which repeat-use flow should become the first end-to-end acceptance test after the MVP?
- Review Gate: What wording is needed to avoid medical, financial, public posting, or AI overclaim risk?

## Product Recommendation Draft

- Most promising direction: private decision board for saved links, introduced through shopping and fashion/brand candidates.
- Runner-up: AI bookmark manager, but only if framed as assistive organization after the manual decision loop works.
- Direction to avoid for now: hospital/medical comparison as the lead product, public sharing, and AI-first automatic classification.
- Product assumptions to test: users return more often when saved links are framed as candidates with a decision status; shopping/fashion examples make the value easiest to understand; decision notes are more useful than more taxonomy fields.
- Next judgment needed from the user: choose whether the first post-MVP story should be "shopping candidates," "fashion/brand board," or broader "decision board for saved links."
