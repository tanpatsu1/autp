# User Decision Pack: Product Direction Council

## Purpose

This pack turns the Product Direction Council synthesis and Review Gate result into a short user-facing decision memo. It does not implement code, add features, change environment values, run SQL, change Supabase production data, charge money, post externally, or launch publicly.

## 1. Recommended Direction

autp should become an AI-ready private decision board for saved links.

The first clear story should be:

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
| Broad decision workspace | Best long-term umbrella | Too abstract as first message | Use internally, explain through shopping first |
| Creator/team link manager | Monetizable later | Collaboration and permissions expand RLS/QA risk | Defer |

## 3. Most Likely Winner

Proceed with:

**AI-ready private decision board for saved links, first explained through shopping / purchase candidates.**

## 4. Why This Wins

- It is clearer than "bookmark manager."
- It builds directly on the current URL, title, category, tags, memo, favorite, search, edit/delete, and card/list MVP.
- It gives users a reason to return: compare options, update notes, shortlist favorites, and decide.
- It is safer than starting with hospital or medical-adjacent workflows.
- It keeps fashion / brand ideas alive as a strong early template.
- It leaves AI and monetization room for later, after persistence, privacy, and quality checks are credible.
- Review Gate found no High or Medium issues and approved the synthesis as decision support.

## 5. Defer For Now

- AI-first positioning.
- Public sharing, public collections, SNS posting, or SEO pages.
- Billing, paid plans, affiliate activation, paid domains, or purchase flows.
- Automatic price tracking or automatic scraping.
- Multi-user collaboration.
- Hospital / life information as the first headline product.
- Vertical-specific schemas before the generic saved-link and decision loop is proven.

## 6. Next Task Candidates

| Candidate Task | Why | Recommendation |
| --- | --- | --- |
| `NEXT-006`: Vercel preview verification | Confirms the current URL Saving MVP works outside local development | Do first if preview is available |
| `NEXT-008`: user direction confirmation | Records whether the user accepts or changes the council recommendation | Do before major product build |
| Supabase/Auth/RLS persistence | Turns the local-first MVP into trusted private saved data | First major implementation after direction and preview |
| Organization and retrieval improvements | Filters, sort, empty/error states, mobile polish | After persistence |
| Generic decision-support fields | Status, decision note, pros/cons or next-check | After persistence and retrieval |
| Automation v2 docs/rubrics | Keeps future autonomous work safer and more reliable | Do before large AI/templates expansion |

## 7. Automation v2 vs Supabase/Auth/Persistence

Recommendation: **Supabase/Auth/RLS-backed persistence should come before Automation v2 implementation work.**

Reason: the product cannot become a real private decision board until saved links, categories, tags, memos, favorites, search, and owner separation are durable and verified. Supabase/Auth/RLS is the trust foundation.

Important nuance: Automation v2 should not slip behind large feature expansion. After persistence starts or immediately after the first persistence slice, create the Automation v2 docs/rubrics for task scoring, PR readiness, Vercel failure taxonomy, Supabase diagnostics, AI evaluation, and DocsSync.

Practical order:

1. Preview verification.
2. User direction confirmation.
3. Supabase/Auth/RLS persistence for the existing MVP only.
4. Automation v2 docs/rubrics before AI, templates, sharing, monetization, or larger vertical work.

## 8. Questions For The User

Please decide these before the next major build:

1. Do you accept the recommended direction: **AI-ready private decision board for saved links**?
2. Should the first wedge be **shopping / purchase candidates**, **fashion / brand boards**, or a broader **personal decision board**?
3. Should fashion / brand be the first template after generic decision fields?
4. Should hospital / life information stay a later private template with stronger privacy and claim guardrails?
5. Should Supabase/Auth/RLS persistence be the next major implementation priority after preview verification?
6. Should Automation v2 be done before AI and vertical templates?
7. Which AI helper should come first later: summaries, tag/category suggestions, grouping, comparison drafts, or chat-style retrieval?
8. Which product wording feels best: "shopping board", "decision board", "saved links with context", or another phrase?

## 9. Recommended Next Move

Choose this path:

1. User confirms: **AI-ready private decision board, first wedged through shopping / purchase candidates.**
2. Run `NEXT-006` Vercel preview verification.
3. Run `NEXT-008` to record the user's final direction choice.
4. Start Supabase/Auth/RLS persistence for the existing MVP only.

Do not start AI, templates, monetization, public sharing, or hospital-specific workflows until the private persisted foundation is verified.

## Review Gate Summary

- Review Gate status: approve equivalent.
- High issues: 0.
- Medium issues: 0.
- Low follow-ups: keep Automation v2 from slipping behind larger feature expansion; clean up stale task-board wording in a later hygiene pass.
- HumanGate items requested or executed: 0.
