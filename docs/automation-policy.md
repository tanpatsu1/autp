# Automation Policy

## Core Policy

`AutomationFoundation` means Codex should continue automatically by default.

The human should only be interrupted by `HumanGate` when a task involves external public posting, money, secrets, destructive production changes, weaker RLS, service role keys, or final public production launch.

## Automatically Allowed

Codex may do these without asking:

- docs creation and updates
- `AGENTS.md` updates
- README updates
- task-board updates
- next-task selection
- implementation
- bug fixes
- UI improvements
- UX improvements
- CI fixes
- build fixes
- lint fixes
- typecheck fixes
- verification runs
- safe auto-fixes after failed verification
- PR creation
- PR review
- marketing copy drafts
- launch copy drafts
- FAQ drafts
- onboarding text drafts
- non-destructive Supabase schema proposals
- RLS policy proposals that do not weaken security
- Vercel deployment checklist drafts

## AutoFixAllowed

Codex may automatically fix:

- broken imports
- missing types
- formatting issues
- simple component bugs
- accessibility warnings
- responsive layout issues
- small UI inconsistencies
- ordinary build mistakes
- CI failures caused by code quality issues
- missing docs caused by recent changes

## ReviewGateRequired

Use `ReviewGate` for:

- new feature work
- medium refactors
- dependency additions
- route changes
- Supabase client query changes
- authentication UI changes
- design system changes
- CI workflow changes
- Vercel preview checks
- README, marketing, and launch content updates

Review can continue automatically unless it finds a `HumanConfirmationRequired` item.

## HumanConfirmationRequired

Codex must stop before:

- SNS posting
- posting to X, Instagram, YouTube, TikTok, Discord, Reddit, or other public platforms
- publishing comments or content on external websites
- charging money
- purchasing anything
- subscribing to paid services
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

## FeedbackInboxRule

If human confirmation is required, Codex must not perform the action.
Instead, write it to `docs/feedback-inbox.md` with:

- Date
- Area
- Requested action
- Why human confirmation is required
- Recommended choice
- Risk if approved
- Risk if rejected

## Hard Prohibitions

- Do not implement the full URL-saving MVP during automation-foundation work.
- Do not change Supabase production DB.
- Do not add real env values.
- Do not charge money.
- Do not post externally.
- Do not execute final production launch.
