# User Direction Confirmation

## Scope

This document records the user's final direction for `NEXT-008`. It is a planning and decision record only. It does not implement code, add features, create iframe or embedded browsing, create a browser extension, create a bookmarklet, scrape pages, add environment values, use service role keys, run SQL, change Supabase production data, weaken RLS, charge money, post externally, buy domains, or launch publicly.

## Source Inputs

- `docs/product-direction.md`
- `docs/roadmap.md`
- `docs/feature-priority.md`
- `docs/growth-strategy.md`
- `docs/monetization-notes.md`
- `docs/user-decision-pack.md`
- `docs/council/product-direction/synthesis.md`
- `docs/council/product-direction/review-gate.md`
- `docs/council/product-direction/weakness-capture-friction.md` from prior analysis commit `96bbad9`

## Confirmed Direction

The user conditionally approves the Product Direction Council recommendation:

> autp should proceed as an AI-ready private decision board for saved links.

The first entrance should be shopping / purchase candidates. The product should be easy to explain as saving links the user is considering, adding context, comparing later, and deciding when ready.

Fashion / brand board remains an early template candidate because it is important to the user's interests and has strong visual and repeat-use potential.

Hospital / life information is deferred. It remains a possible later private template only after stronger privacy, trust, claim, and advice-risk guardrails exist.

## Confirmed Product Risks

Capture friction is a first-class product risk. The current manual flow of copying a URL, opening autp, pasting, filling fields, saving, and returning to the original context is a weakness that must be tracked.

autp also has a distribution risk: a private decision board may be useful but quiet. Future planning should include how the product becomes understandable through demo boards, screenshots, onboarding examples, and simple user-facing wording without external posting.

Future Product, Growth, QA, Automation, and Review Gate work should continue looking for weaknesses the user has not explicitly named. If a weakness could affect habit formation, growth, trust, privacy, retention, or monetization, Codex should add it to planning before large feature expansion.

## Explicit Non-Goals

iframe / embedded browsing is research-only. It is not approved for implementation now.

Do not implement:

- iframe or embedded external browsing;
- site-internal browser surfaces;
- Chrome extension;
- bookmarklet;
- scraping;
- automatic price tracking;
- purchase flow;
- public sharing;
- SNS or external posting;
- billing, paid plans, affiliate activation, or domain purchase;
- final public production launch.

## HumanGate Boundaries

These actions remain `HumanConfirmationRequired`:

- public sharing;
- SNS posting;
- billing or paid plan changes;
- purchases;
- purchase flows;
- affiliate activation;
- external posting;
- domain purchase;
- production data deletion;
- DB table deletion;
- weaker RLS;
- real env values or secret exposure;
- service role key use;
- final public production launch.

## Next Task Candidates

| Candidate | Position |
| --- | --- |
| Capture Friction Baseline Planning | Add a small docs/product/design planning slice before or alongside persistence planning. Define fast paste, minimal required fields, save confirmation, mobile comfort, private-data handling, and staged capture research boundaries. |
| Supabase/Auth/RLS Persistence | Next major implementation candidate. It should persist the current MVP only, enforce owner-scoped records, and avoid AI, sharing, billing, scraping, and production DB changes from automation. |
| Automation v2 / Autonomous Planning System | Add docs/rubrics before large AI, template, sharing, or monetization expansion. Include task scoring, council synthesis, PR readiness, Vercel failure taxonomy, Supabase diagnostics, AI evaluation, and DocsSync rules. |
| Task-board hygiene | Clean stale task wording and make future TaskBoardLoop selection clearer without changing product behavior. |
| Organization / retrieval improvements | After persistence, improve category/tag/favorite filters, sort, empty/loading/error/no-results states, and mobile retrieval comfort. |

## Sequencing Decision

The next major implementation candidate is Supabase/Auth/RLS persistence.

Before that, or at the same time as its planning, autp should add a small capture-friction baseline planning task. This keeps the manual save-flow weakness visible without expanding the persistence PR into capture-channel implementation.

Automation v2 docs/rubrics should happen before large AI, template, sharing, or monetization expansion.

## Decision Status

Status: confirmed by user with conditions.

`NEXT-008` is marked complete after this document, `docs/current-status.md`, `docs/task-board.md`, `docs/decision-log.md`, and `docs/review-log.md` are updated and `npm run verify` passes.
