# AGENTS.md

## Project

- Repository: `tanpatsu1/autp`
- Product: `autp`, a multi-purpose URL / brand / link manager.
- Stack target: Next.js App Router, TypeScript, Supabase, Vercel.
- Primary goal: build in small, verifiable steps that can be deployed by Vercel.

## Automation Workflow

Before starting any task:

1. Read `docs/current-status.md`.
2. Read `docs/automation-policy.md`.
3. Read `docs/feedback-inbox.md`.
4. Check whether the task is blocked by missing secrets, missing environment variables, missing product decisions, or a human-confirmation requirement.
5. Prefer the smallest useful change that moves the MVP forward.

During work:

1. Keep changes focused.
2. Do not rewrite unrelated files.
3. Do not introduce unnecessary dependencies.
4. Do not hardcode secrets or credentials.
5. Do not create `.env.local` or commit real environment values.
6. Use the environment variable names already documented.
7. Keep UI bright, clean, simple, and immediately understandable.

Before finishing:

1. Run the available checks when possible:
   - `npm run lint`
   - `npm run build`
   - any existing tests
2. If commands cannot run, explain why.
3. Update `docs/current-status.md` with what changed, what works, and what remains.
4. Append a short entry to `docs/review-log.md`.
5. If user feedback was handled, mark it in `docs/feedback-inbox.md`.

## Done Definition

A task is done only when:

- The requested behavior is implemented or the blocker is clearly identified.
- The app still builds, or the exact build blocker is documented.
- No secret value is exposed.
- Status docs are updated.
- The next recommended task is written clearly.

## Supabase Rules

Use these public client variables only:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Never expose these in client code, logs, docs, or examples:

- service role key
- database password
- JWT secret
- access tokens
- refresh tokens

## Product Direction

The MVP should support:

- Saving URLs with title, URL, category, tags, memo, favorite/bookmark state.
- Multiple use cases such as fashion brands, hospitals, tools, shops, and references.
- Clean list and card views.
- Search, filtering, and grouping by category/tag.
- Future account-based data separation through Supabase Auth.

## PR Expectations

For each PR or task result, report:

- Summary
- Files changed
- Verification commands and results
- Known limitations
- Next suggested task
