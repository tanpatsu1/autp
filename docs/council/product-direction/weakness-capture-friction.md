# Weakness And Capture Friction Analysis

## Scope

This note extends the Product Direction Council decision pack. It is product analysis only. It does not implement code, add features, create a bookmarklet, create a browser extension, embed external websites, scrape pages, change environment values, run SQL, change Supabase production data, weaken RLS, charge money, post externally, or launch publicly.

The user's iframe / site browsing / save-in-context idea is treated as a hypothesis, not an accepted requirement.

## Executive Addendum

The current direction remains sound:

> autp should become an AI-ready private decision board for saved links, first explained through shopping / purchase candidates.

The main weakness is not the destination. The weakness is the path into the product. If users must copy a link, remember autp, open autp, paste the URL, add fields, and save, the product can be useful but still fail to become a habit.

The second weakness is distribution. A private decision board is valuable but visually quiet. If the app cannot be explained in one screenshot, one short video, or one sentence, it risks becoming "a nicer bookmark app" with low word of mouth.

Recommended planning change:

1. Keep Supabase/Auth/RLS persistence as the first major implementation foundation.
2. Add a small capture-friction baseline before or alongside persistence planning: fast paste, minimal required fields, clear saved confirmation, and mobile comfort.
3. Treat automatic title fetch, bookmarklet, and Web Share Target as staged capture improvements after persistence.
4. Treat Chrome extension as a later distribution/capture project after the core habit is proven.
5. Keep iframe / embedded external browsing as research-only for now. Prefer safer alternatives.
6. Add Growth validation earlier: demoable boards, screenshot/video story, and onboarding examples should be planned before large templates or AI.

## 1. Current Direction Weaknesses

| Weakness | Why It Matters | Mitigation |
| --- | --- | --- |
| Abstract internal positioning | "AI-ready private decision board" is useful for strategy, but too abstract for first-time users. | Use external copy like "Save links you are considering and decide later." |
| Capture friction | Manual copy, app switching, form filling, and save steps interrupt the moment when users find a link. | Add fast capture as a core product requirement, not late polish. |
| Generic bookmark comparison | Users may compare autp with browser bookmarks, Notes, Notion, Raindrop, Pocket, spreadsheets, wishlists, and chat saves. | Lead with decision context, notes, shortlists, and revisit flow. |
| Shopping wedge can look small | Shopping is clear, but it can sound like a wishlist unless context and decision status are visible. | Frame it as "things you might buy, with the reason and next decision." |
| Low natural virality | Private boards do not spread by default and public sharing is intentionally deferred. | Use demoable private examples, local onboarding, and later HumanGate-approved sharing concepts. |
| Repeat-use risk | Users may save links once and never return if there is no reminder, status, or decision ritual. | Add decision status, favorites, filters, and later revisit prompts after persistence. |
| AI promise gap | "AI-ready" can imply current AI features that are not implemented. | Keep AI as internal roadmap language until persistence, consent, cost, and evaluation are ready. |
| Sensitive context creep | Hospital, life admin, purchases, and personal research can reveal private intent. | Treat saved links, memos, tags, categories, and browsing/capture history as private data. |
| Template sprawl | Shopping, fashion, student, and life templates can fragment the product too early. | Keep one saved-link model; templates start as optional fields/copy. |
| Data quality dependency | Saved URLs without titles, notes, or categories can become a dead archive. | Make title capture and "why saved" lightweight, optional, and easy to improve later. |

## 2. Save Flow Friction

Current implied flow:

1. User finds a product, article, shop, social post, search result, or service page.
2. User copies the URL.
3. User opens or returns to autp.
4. User pastes the URL.
5. User enters title, category, tags, memo, or favorite.
6. User saves.
7. User returns to the original browsing context.

Friction points:

| Step | Friction | Impact |
| --- | --- | --- |
| Copy URL | Mobile apps, SNS apps, and shopping apps hide or transform URLs. | Capture fails before autp is opened. |
| Open autp | App switching breaks attention and makes autp feel separate from discovery. | Habit formation weakens. |
| Paste URL | Fine on desktop, slower on mobile. | Acceptable for MVP, but not enough for repeat capture. |
| Enter fields | Context fields are valuable, but every required field reduces capture rate. | The app may become "homework." |
| Save confirmation | If feedback is weak, users may not trust that the link was saved. | Trust and repeat use suffer. |
| Return to source | Users may abandon the original task. | autp becomes interruption, not helper. |

Most affected users:

- Mobile-first shoppers saving links from SNS, search, and EC apps.
- Fashion / brand users who browse visually and move quickly between shops.
- Users collecting many candidates in one session.
- Casual users who have not yet built trust in autp.
- Users who already rely on native bookmarks, notes, screenshots, or chat-to-self.

MVP judgment:

- Manual URL paste is acceptable for the earliest private MVP because it is safe, deterministic, and easy to verify.
- It is not acceptable as the long-term capture strategy.
- The first implementation foundation should still be persistence, but capture friction must be written into acceptance criteria before the product expands.

## 3. Save Method Comparison

| Candidate | Ease For User | Implementation Difficulty | MVP Extension Fit | Security / Privacy Risk | Growth Effect | Timing |
| --- | --- | --- | --- | --- | --- | --- |
| Manual URL paste | Medium. Understandable but interruptive. | Low | Strong baseline | Low if stored privately | Low to medium | Keep now |
| Auto title fetch on paste | High. Reduces typing. | Medium | Natural after URL validation | Medium: server fetch, SSRF, malicious metadata, tracking, terms risk | Medium | After persistence or in a small reviewed slice |
| Paste-only fast save mode | High. User can save first and organize later. | Low to medium | Very natural | Low | Medium | Early, before complex capture channels |
| Bookmarklet | High on desktop browser; weak in mobile apps. | Medium | Natural after stable save endpoint | Medium: injected script, URL handling, auth/session concerns | Medium | After persistence and auth are stable |
| Chrome extension | Very high for desktop capture. | High | Good later, but separate release and review surface | Medium to high: permissions, store review, update trust, cross-site data exposure | High if polished | Later after habit proof |
| Mobile share sheet / Web Share Target | High for mobile web/PWA users. | Medium | Strong fit for mobile capture | Medium: incoming URLs and titles must be sanitized; auth state matters | High for mobile adoption | After persistence and PWA/auth review |
| Site-internal search / browsing screen | Medium. Keeps user in autp, but may be worse than real web search. | Medium to high | Weak until core board is strong | Medium: query logging, result source, content claims | Medium | Research or prototype only after core |
| iframe / embedded external browser | Low to medium in practice because many sites block embedding. | High | Poor early fit | High: clickjacking, cookies, tracking, CSP, X-Frame-Options, terms, broken UX | Low to medium | Research-only, do not roadmap as build item |
| SNS/EC save helpers | High if tailored to real discovery flows. | Medium to high | Good after capture foundation | Medium: platform terms, URL normalization, private intent data | High | Later per-channel research |
| Clipboard detection / paste suggestion | Medium. Can reduce effort after app open. | Medium | Good if permission-respecting | Medium: clipboard privacy and browser permission expectations | Medium | Later, optional and explicit |
| Email-to-board or bot capture | Medium. Useful for some users, slower than direct capture. | Medium | Secondary channel | Medium: inbound spam, auth mapping, private data in email | Medium | Later |
| Screenshot / image capture | Medium for fashion and SNS, but loses canonical URL. | High | Weak for URL MVP | Medium to high: image privacy, OCR/AI cost | High for visual demos | Later template/AI research |

## 4. iframe / Site-Inside-Browsing Hypothesis

Hypothesis:

> Let users browse external sites inside autp, like a Google-style search or embedded browser, and save while viewing.

Feasibility:

- Many external sites block iframe embedding with `X-Frame-Options` or `Content-Security-Policy frame-ancestors`.
- Logged-in shopping, SNS, and marketplace pages may depend on third-party cookies, anti-bot controls, app-only routes, or dynamic client behavior that break in embedded contexts.
- A web app cannot provide the same embedded browsing control as a native browser or extension without platform-specific limitations.
- Search result aggregation introduces ranking, source, legal, and trust questions.

Risks:

| Area | Risk |
| --- | --- |
| Security | Clickjacking, mixed trust boundaries, malicious pages, phishing-like UI, and unsafe frame messaging. |
| Privacy | autp could appear to observe browsing history, search queries, product intent, cookies, or personal pages. |
| Terms / compliance | Some sites disallow embedding, automated access, scraping, or altered display. |
| UX | Broken frames, login failures, mobile viewport issues, blocked interactions, and user confusion. |
| Product focus | Building a weak browser can distract from building a strong board. |

Recommendation:

- Do not build iframe / embedded external browsing in the MVP.
- Do not use technical workarounds to bypass embedding restrictions.
- Keep the idea as a research note under "capture in browsing context."
- Prefer safer capture surfaces: fast paste, title fetch, bookmarklet, Web Share Target, and later browser extension.

How to reflect the user's hypothesis:

- Accept the underlying problem: users want to save without leaving their browsing flow.
- Reject iframe as the initial solution.
- Add capture friction to roadmap and priority docs.
- Add a later research task for "capture while browsing" with security, privacy, and terms review before implementation.

## 5. Growth And Distribution Weaknesses

Main risk:

autp can be genuinely useful but too quiet to spread. Private tools are often hard to show because the value is hidden in personal context.

Weaknesses:

- The product may look like "a form plus a list" in screenshots.
- The strongest value appears after users save multiple items, not on first open.
- The private positioning limits public sharing loops by design.
- Shopping/fashion is visual, but generic saved links may not be visually compelling.
- AI is not ready to be the growth promise, so the story needs to work without it.

Countermeasures:

| Growth Problem | Countermeasure |
| --- | --- |
| "Convenient but boring" | Show before/after: scattered tabs to shortlist. |
| Hard to explain | Use one-sentence copy: "Save links you are considering and decide later." |
| Hard to screenshot | Build demo boards with cards, notes, favorites, and statuses after persistence. |
| No public sharing yet | Use local demo content, private beta scripts, and HumanGate-approved launch copy only. |
| Weak habit loop | Add status, favorites, filters, and later revisit prompts. |
| Shopping looks like wishlist | Emphasize reason, comparison, and decision outcome. |
| Fashion could be clearer visually | Use fashion/brand as a first template or demo board, not as a separate app yet. |

Save flow improvements also help growth because users can describe autp as:

- "I save products from anywhere into one decision board."
- "I send links into autp while browsing, then compare later."
- "It is not a wishlist; it remembers why each option mattered."

## 6. Product Wording And Positioning

| Wording | Strength | Weakness | Recommendation |
| --- | --- | --- | --- |
| AI-ready private decision board | Strong internal strategy and roadmap frame | Abstract and may overpromise AI | Use internally and in planning docs |
| Shopping board | Concrete and easy to understand | May sound too narrow or wishlist-like | Use for first wedge examples |
| Decision board | Clearer than bookmark manager | Still somewhat abstract | Good user-facing category once examples exist |
| Saved links with context | Honest and understandable | Less exciting; can sound like notes | Use as feature explanation |
| Save-to-decide | Memorable action phrase | Needs explanation | Good tagline candidate |
| Clip board | Familiar capture metaphor | Ambiguous and can conflict with clipboard meaning | Not preferred as primary name |
| Private shortlist | Strong for shopping and comparison | Less broad for research/life admin | Good campaign or UI phrase |

Recommended layered language:

- Internal: "AI-ready private decision board for saved links."
- User-facing headline: "Save links you are considering and decide later."
- Shopping wedge: "A private board for things you might buy."
- Feature explanation: "Saved links with notes, tags, favorites, and search."
- Later AI: "Optional help to summarize, group, and compare your saved items."

## 7. Roadmap Impact

Current recommended order:

1. Vercel preview verification.
2. User direction confirmation.
3. Supabase/Auth/RLS persistence.
4. Automation v2 docs/rubrics.
5. Search, classification, and UI improvements.
6. Templates, AI, and monetization later.

Adjusted recommendation:

1. Keep Vercel preview verification first.
2. Use user direction confirmation to explicitly confirm the capture-friction priority.
3. Add a docs-only capture baseline before persistence implementation: fast paste, minimal required fields, save confirmation, mobile comfort, and private-data handling.
4. Keep Supabase/Auth/RLS persistence as the first major implementation foundation.
5. Implement capture improvements in small slices after or alongside persistence, starting with paste-only fast save and optional title fetch.
6. Move Growth validation earlier as planning: demoable boards, onboarding examples, and non-public copy drafts.
7. Put bookmarklet and Web Share Target after persistence and stable auth.
8. Put Chrome extension after the core habit and board value are proven.
9. Keep iframe / embedded browsing as research-only until a security/privacy/terms review says otherwise.

Do not let capture work become a hidden scope expansion inside the persistence PR. The persistence slice should remain small and verifiable.

## 8. Safety And HumanGate

Treat these as private data:

- Saved URLs.
- Titles and metadata.
- Categories, tags, memos, favorites, and decision status.
- Search queries inside autp.
- Capture source, share target source, or browsing/referrer context.
- AI summaries and derived annotations.

Risk rules:

- Automatic price tracking and automatic scraping should stay deferred.
- AI summaries of external pages require prompt-injection, source, consent, privacy, cost, and provenance review.
- Product information extraction can create accuracy and terms risks.
- Public sharing, public boards, SNS posting, affiliate activation, purchase flows, paid plans, billing, domains, and final launch are HumanGate.
- Browser extensions and share targets need permission minimization and clear privacy copy before release.
- External site embedding must not bypass site protections or terms.

## 9. Additions To User Decision Pack

The current User Decision Pack should be accepted with added cautions:

- The direction is good, but capture friction is now a first-class product risk.
- Shopping / purchase candidates remain the best wedge, but only if saving from real browsing flows becomes easier over time.
- "AI-ready private decision board" should remain internal wording; user-facing copy should be more concrete.
- Growth should not wait until monetization. A demoable, screenshot-friendly board and capture story are part of product validation.
- iframe / embedded browsing should not be treated as the preferred solution. It is a signal that capture-in-context matters.

## 10. Items To Add

Add to roadmap / priority:

- Capture-friction baseline planning.
- Paste-only fast save.
- Optional title fetch with security review.
- Mobile share target / Web Share Target research.
- Bookmarklet research after auth persistence.
- Capture-in-context research that explicitly compares bookmarklet, extension, share target, and iframe.
- Growth demo board and onboarding examples.
- Product wording test around "save-to-decide", "private shortlist", "shopping board", and "saved links with context."

## 11. Items To Defer

Defer:

- iframe / embedded external browser implementation.
- Site-internal web search as a product surface.
- Chrome extension implementation.
- Automatic scraping.
- Automatic price tracking.
- Background AI classification.
- Public sharing / public collections.
- SNS posting.
- Affiliate activation.
- Purchase flows.
- Billing and paid plans.
- Hospital / life information as a headline workflow.

## 12. User Decisions Needed Next

The user should decide:

1. Confirm whether capture friction should be treated as a must-solve product risk before large feature expansion.
2. Choose the first user-facing wording to test: "shopping board", "decision board", "saved links with context", "save-to-decide", or "private shortlist."
3. Decide whether the next planning slice should specify fast paste and optional title fetch before persistence implementation begins.
4. Decide whether mobile capture should prioritize Web Share Target before desktop bookmarklet / Chrome extension.
5. Confirm that iframe / embedded browsing should stay research-only unless a later review finds a safe, compliant use case.

