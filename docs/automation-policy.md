# Automation Policy

## Core Policy

autp uses an aggressive automation model: almost everything should continue automatically, while only external posting, money-related actions, secrets, destructive production changes, and final public launch approval require a human stop.

Codex should choose the next task, make safe changes, review the result, update project docs, and keep the project moving without repeated confirmation.

## Automatically Allowed

Codex may do the following without asking:

- Implement features
- Fix bugs
- Improve UI
- Improve UX
- Refactor code
- Update docs
- Update README
- Update task board
- Update review log
- Fix CI failures
- Fix build errors
- Fix lint errors
- Fix typecheck errors
- Create PRs
- Review PRs
- Respond to review comments
- Improve copywriting
- Draft marketing content
- Draft launch content
- Draft FAQ
- Draft onboarding text
- Propose Supabase schema
- Propose RLS policies
- Create non-destructive migration drafts
- Create Vercel deployment checklists
- Decide the next task from `docs/task-board.md`
- Move completed tasks to Done
- Add newly discovered tasks to `docs/task-board.md`

## Auto-Fix Allowed

Codex may automatically fix:

- broken imports
- missing types
- formatting issues
- simple component bugs
- accessibility warnings
- responsive layout issues
- small UI inconsistencies
- broken builds caused by normal implementation mistakes
- missing docs caused by recent changes
- failing CI caused by code quality issues

## Review Gate Required But Still Automated

These tasks should go through Review Gate, but Codex may still continue automatically after review:

- new feature implementation
- medium refactors
- dependency additions
- authentication UI changes
- Supabase client query changes
- route changes
- Vercel preview deployment checks
- design system changes
- README and launch content updates

## Human Confirmation Required

Codex must stop and ask the human before:

- posting to SNS
- posting to X, Instagram, YouTube, TikTok, Discord, Reddit, or other public platforms
- publishing comments or content on external websites
- charging money
- purchasing anything
- subscribing to any paid service
- upgrading paid plans
- buying domains
- changing billing settings
- changing payment settings
- deleting production data
- dropping database tables
- weakening RLS policies
- exposing secrets
- writing real env values into files
- using service role keys
- final public production launch

## Feedback Inbox Rule

If human confirmation is required, Codex must not perform the action.
Instead, it must write the item to:

`docs/feedback-inbox.md`

Use this format:

- Date:
- Area:
- Requested action:
- Why human confirmation is required:
- Recommended choice:
- Risk if approved:
- Risk if rejected:

## Hard Prohibitions

- Do not implement the URL-saving MVP during policy-only tasks.
- Do not write real env values.
- Do not charge money.
- Do not post externally.
- Do not change production databases.
