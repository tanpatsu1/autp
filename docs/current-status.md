# Current Status

## Project

- Repository: `tanpatsu1/autp`
- Project: `autp`
- Stack: Next.js / TypeScript / Supabase / Vercel
- Mode: `AutomationFoundation`

## Current State

- Minimal Next.js application, Supabase browser client helper, automation docs, CI, and `npm run verify` are present.
- `TaskBoardLoop`, `HumanGate`, `ReviewGate`, and `VerificationLoop` remain the default operating loops.
- Role collaboration, MVP scope, and automation-goal alignment are documented.
- Branch hygiene is now documented: start from latest `main`, sync before PR creation, keep merge-waiting PRs current, and let Codex resolve ordinary PR conflicts.
- Shared docs rules are now documented for `docs/current-status.md`, `docs/review-log.md`, `docs/task-board.md`, and `docs/decision-log.md`.
- `NEXT-002` URL-saving data model, Supabase schema proposal, and RLS policy proposal are documented in docs only.
- `NEXT-003` URL Saving MVP is implemented as a local-first UI with URL registration, title, category, tags, memo, favorite, listing, search, edit, delete, and card/list view switching.
- `NEXT-003` URL Saving MVP local smoke QA passed for the MVP flows; no High or Medium issues are currently recorded.
- Product Direction Council role inputs have been synthesized. The council recommendation is an AI-ready private decision board for saved links, introduced first through shopping / purchase candidates, with fashion / brand as an early template and sensitive verticals deferred.
- Product direction planning docs now summarize candidate comparison, roadmap, feature priorities, growth strategy, and monetization notes without implementing new features.
- `NEXT-008` user direction confirmation is recorded in `docs/user-direction-confirmation.md`: autp should proceed as an AI-ready private decision board for saved links, first entered through shopping / purchase candidates, with fashion / brand kept as an early template and hospital / life information deferred.
- Capture friction is now a first-class product risk. The "copy URL, open autp, paste, fill fields, save, return" flow is tracked as a weakness; iframe / embedded browsing remains research-only and is not approved for implementation.
- `NEXT-009` Capture Friction Baseline Planning is documented in `docs/capture-friction-baseline.md`. The baseline is URL-only fast save: URL is the only user-required save-time field, title/category/tags/memo/favorite can be organized later, and unclassified or unorganized links remain valid private records.

## Open Issues

- Supabase live connection is not verified. Runtime public env values, authenticated user flow, reviewed migrations, and preview schema/RLS application are still needed before replacing local `localStorage` persistence with Supabase-backed persistence.
- Vercel deployment / preview behavior for the URL Saving MVP still needs confirmation before broader release readiness work.
- Final public production launch remains blocked by `HumanConfirmationRequired`.
- Detailed task logs still need a separation plan so `docs/current-status.md` can stay short.
- Supabase/Auth/RLS persistence still needs to decide whether `capture_source` and organization state are explicit fields or derived behavior before migrations are written.

## Next Task

`NEXT-006` remains the active verification track for Vercel deployment / preview confirmation. After preview verification, `NEXT-010` Supabase/Auth/RLS Persistence is the next major implementation candidate and should preserve the URL-only fast-save baseline.

## Verification Status

- URL Saving MVP implementation: `npm run verify` passed on 2026-04-29. Local dev server responded with HTTP 200 at `http://localhost:3000`.
- URL Saving MVP local smoke QA passed on 2026-04-29 at `http://localhost:3001`: URL registration, title, category, tags, memo, favorite toggle, listing, search, card/list switching, and MVP-acceptable page-refresh behavior were confirmed. No High or Medium issues are recorded.
- Local smoke QA documentation update: final `npm run verify` passed on 2026-04-29.
- URL-saving data model and RLS proposal is docs-only. Final `npm run verify` passed on 2026-04-29.
- Branch hygiene was followed: work started from latest `origin/main`, pre-edit verification passed, and Pre-PR sync found the branch up to date.
- Conflict prevention update is docs-only and final `npm run verify` passed on 2026-04-29.
- Product Direction Council setup is docs-only. Pre-edit `npm install` and `npm run verify` passed on 2026-04-29.
- Product Direction Council setup Pre-PR sync found the branch up to date with `origin/main`; final `npm run verify` passed on 2026-04-29.
- Product Direction Council synthesis is docs-only. Pre-edit `npm install` and `npm run verify` passed on 2026-04-29; final `npm run verify` passed on 2026-04-29.
- User direction confirmation is docs-only. `npm run verify` passed on 2026-04-29 after the confirmation docs update.
- Capture Friction Baseline Planning is docs-only. Verification is recorded in `docs/review-log.md`.

## Updated

- 2026-04-30
