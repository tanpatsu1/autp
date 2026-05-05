# User Decision Pack: Product Direction Council

## Purpose

This pack turns the Product Direction Council synthesis and the merged Review Gate result into a short decision memo for the user. It is decision support only: no code implementation, feature addition, environment value, SQL execution, Supabase production change, billing action, external posting, or public launch is included.

## Source State

- Latest main reviewed: `d579e1b` (`Merge pull request #25 from tanpatsu1/codex/council-synthesis-review-gate`).
- Review Gate result: approve equivalent.
- High issues: 0.
- Medium issues: 0.
- Low follow-ups: keep Token Efficiency follow-up work from slipping behind larger feature expansion; clean up stale `LATER-001` wording in a later task-board hygiene pass.
- HumanGate items requested or executed: 0.

## Additional User Feedback Incorporated

The user broadly accepts the direction, but raised a material concern: autp may be useful yet fail to become habitual if saving requires copy URL, open autp, paste, fill fields, save, and return to the original context.

This pack now adds three caveats:

- Capture friction is a first-class product risk.
- Distribution and "useful but quiet" risk need earlier growth planning.
- iframe / site-inside-browsing is a hypothesis to evaluate, not a feature to accept now.

## 1. Recommended Direction

autp should become an AI-ready private decision board for saved links.

The first user-facing story should be:

> Save links you are considering, add context, compare later, and decide when ready.

The strongest first wedge is shopping / purchase candidates. Fashion / brand management should be an early template, not the whole product yet. Student research can follow as a secondary template. Hospital / life information should stay later because privacy, trust, and advice-risk are higher.

## 2. Candidate Comparison

| Candidate | Strength | Main Risk | Decision |
| --- | --- | --- | --- |
| Generic URL manager | Easy and safe foundation | Too similar to bookmarks or notes | Keep as base, not headline |
| AI bookmark organizer | Strong long-term AI story | AI quality, privacy, cost, and evaluation are not ready | Defer as assistant layer |
| Shopping candidate board | Clear, frequent, low-risk, easy to explain | Could drift into price tracking, affiliate, or purchase flows | Best first wedge |
| Fashion / brand board | Visual, repeat-use, aligned with user interest | Too narrow if it becomes the whole app too early | Early template |
| Hospital / life information | Real need and high value | Sensitive data and advice-risk | Later private template |
| Student research board | Good fit for saved links and notes | May require citation/export quickly | Secondary template |
| SNS-found product/shop/info saver | Strong growth framing | Must avoid external posting and public sharing until gated | Later positioning angle |
| Broad decision workspace | Best long-term umbrella | Too abstract as first message | Use internally, explain through shopping first |
| Creator/team link manager | Monetizable later | Collaboration and permissions expand RLS/QA risk | Defer |

## 3. Most Likely Winner

Proceed with:

**AI-ready private decision board for saved links, first explained through shopping / purchase candidates.**

## 4. Why This Wins

- It is clearer than a generic bookmark manager.
- It builds directly on the current URL, title, category, tags, memo, favorite, search, edit/delete, and card/list MVP.
- It gives users a reason to return: compare options, update notes, shortlist favorites, and decide.
- It is safer than starting with hospital or medical-adjacent workflows.
- It keeps fashion / brand ideas alive as a strong early template.
- It leaves AI and monetization room for later, after persistence, privacy, cost, and quality checks are credible.
- Review Gate found no High or Medium issues and approved the synthesis as safe decision support.

## 5. Defer For Now

- AI-first positioning.
- Public sharing, public collections, SNS posting, or SEO pages.
- Billing, paid plans, affiliate activation, paid domains, or purchase flows.
- Automatic price tracking or automatic scraping.
- iframe / embedded external browsing implementation.
- Site-internal external search or browser-like surfaces.
- Chrome extension implementation.
- Multi-user collaboration.
- Hospital / life information as the first headline product.
- Vertical-specific schemas before the generic saved-link and decision loop is proven.

## 5.5 Weaknesses To Track

| Weakness | Impact | Direction |
| --- | --- | --- |
| Manual save flow is slow | Users may not save enough links for the board to become useful. | Add fast capture planning before large feature expansion. |
| Private boards are hard to spread | The value can be invisible to others. | Use demo boards, screenshots, and short videos with non-sensitive examples. |
| Shopping can sound like a wishlist | Users may miss the decision-board value. | Emphasize notes, favorites, status, and "why saved." |
| AI-ready wording is abstract | First-time users may not understand current value. | Use concrete user-facing wording, keep AI as roadmap language. |
| iframe idea is tempting but risky | Many sites block embedding; privacy/security/terms risks are high. | Keep as research-only and prefer safer capture channels. |

### Additional Weakness Discovery Policy

The listed weaknesses are not exhaustive. Future Product / Growth / QA / Automation reviews should actively search for additional adoption, retention, capture, privacy, distribution, and differentiation weaknesses even when the user has not explicitly named them. Any weakness that could affect habit formation, growth, trust, or long-term monetization should be added to roadmap planning before large feature expansion.

## 5.6 Capture Method Summary

| Method | Recommendation |
| --- | --- |
| Manual URL paste | Keep as safe MVP baseline. |
| Paste-only fast save | Early priority; lets users organize later. |
| URL paste with optional title fetch | Early candidate after security/privacy review. |
| Bookmarklet | Consider after persistence and stable auth. |
| Mobile share sheet / Web Share Target | Strong mobile candidate after persistence/PWA review. |
| Chrome extension | Later; higher permission, release, and privacy burden. |
| Site-internal search/browsing | Research only; do not build before core board value is proven. |
| iframe / embedded external browsing | Do not implement now; high compatibility, security, privacy, terms, and UX risk. |
| SNS/EC save helpers | Later per-channel research; avoid external posting and scraping. |

## 6. Next Task Candidates

| Candidate Task | Why | Recommendation |
| --- | --- | --- |
| `NEXT-006`: Vercel preview verification | Confirms the current URL Saving MVP works outside local development | Do first if preview is available |
| `NEXT-008`: user direction confirmation | Records whether the user accepts or changes the council recommendation | Do before major product build |
| Supabase/Auth/RLS persistence | Turns the local-first MVP into trusted private saved data | First major implementation after direction and preview |
| Capture-friction baseline | Defines fast paste, minimal required fields, mobile comfort, and private-data handling | Add before or alongside persistence planning |
| Organization and retrieval improvements | Filters, sort, empty/error states, mobile polish | After persistence |
| Generic decision-support fields | Status, decision note, pros/cons or next-check | After persistence and retrieval |
| Token Efficiency follow-up docs/rubrics | Keeps future autonomous work safer and more reliable | Do before large AI/templates expansion |
| Growth demo / wording validation | Makes the quiet private-board value easier to explain | Plan early; no external posting without HumanGate |
| Task-board hygiene | Fixes the stale `LATER-001` wording noted by Review Gate | Low-priority cleanup |

## 7. Token Efficiency follow-up vs Supabase/Auth/Persistence

Recommendation: **Supabase/Auth/RLS-backed persistence should come before Token Efficiency follow-up implementation work.**

Reason: the product cannot become a real private decision board until saved links, categories, tags, memos, favorites, search, and owner separation are durable and verified. Supabase/Auth/RLS is the trust foundation.

Important nuance from Review Gate: Token Efficiency follow-up work should not slip behind larger feature expansion. After persistence starts, or immediately after the first persistence slice, create the Token Efficiency follow-up docs/rubrics for task scoring, PR readiness, Vercel failure taxonomy, Supabase diagnostics, AI evaluation, and DocsSync.

Practical order:

1. Preview verification.
2. User direction confirmation.
3. Capture-friction baseline as a small docs/product/design slice.
4. Supabase/Auth/RLS persistence for the existing MVP only.
5. Token Efficiency follow-up docs/rubrics before AI, templates, sharing, monetization, or larger vertical work.

## 8. Questions For The User

Please decide these before the next major build:

1. Do you accept the recommended direction: **AI-ready private decision board for saved links**?
2. Should the first wedge be **shopping / purchase candidates**, **fashion / brand boards**, or a broader **personal decision board**?
3. Should fashion / brand be the first template after generic decision fields?
4. Should hospital / life information stay a later private template with stronger privacy and claim guardrails?
5. Should Supabase/Auth/RLS persistence be the next major implementation priority after preview verification?
6. Should Token Efficiency follow-up docs/rubrics happen before AI and vertical templates?
7. Which AI helper should come first later: summaries, tag/category suggestions, grouping, comparison drafts, or chat-style retrieval?
8. Which product wording feels best: "shopping board", "decision board", "saved links with context", or another phrase?
9. Should the first capture improvement after manual paste be paste-only fast save, optional title fetch, Web Share Target, bookmarklet, or something else?
10. Should iframe / embedded browsing remain research-only for now?

## 9. Recommended Next Move

Choose this path:

1. User confirms: **AI-ready private decision board, first wedged through shopping / purchase candidates.**
2. Run `NEXT-006` Vercel preview verification.
3. Run `NEXT-008` to record the user's final direction choice.
4. Add capture-friction baseline planning.
5. Start Supabase/Auth/RLS persistence for the existing MVP only.
6. Add Token Efficiency follow-up docs/rubrics before larger feature expansion.

Do not start AI, templates, monetization, public sharing, or hospital-specific workflows until the private persisted foundation is verified.
