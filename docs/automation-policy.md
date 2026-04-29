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
- branch synchronization with `main`
- merge conflict resolution on Codex-owned PR branches
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
- merge conflicts in Codex-owned branches when the fix preserves branch work and current `main`

## Branch Hygiene Required

Codex must keep working branches close to `main` to reduce repeated conflicts in shared docs.

### Branch Start Rule

Before starting a new branchable task, Codex must update from `main`:

```bash
git checkout main
git pull origin main
npm install
npm run verify
git checkout -b <work-branch>
```

If local uncommitted work from another task exists, Codex must preserve it instead of overwriting it. A separate clean worktree is allowed when it avoids mixing unrelated changes.

### Pre-PR Sync Rule

Before creating a PR, Codex must sync the PR branch with the latest `main`. If conflicts appear, Codex resolves them, removes conflict markers, runs `npm run verify`, and only then creates the PR.

### Pre-Merge Sync Rule

If `main` changes while a PR is waiting to merge, Codex must update the PR branch from latest `main`. If conflicts appear, Codex resolves them and adds a follow-up commit after `npm run verify` passes.

### Conflict Auto-Fix Rule

Codex must not hand ordinary PR conflicts back to the human by default. Codex should:

- inspect the conflict files,
- compare `main` and branch diffs,
- keep the branch work that belongs to the PR,
- incorporate the newer `main` state,
- remove conflict markers,
- run `npm run verify`,
- push an additional PR commit.

Stop at `HumanGate` only if resolving the conflict would require secrets, billing, production data deletion, weaker RLS, service role keys, external posting, or final production launch.

### Shared Docs Edit Rule

These files are conflict-prone and must be edited narrowly:

- `docs/current-status.md`
- `docs/review-log.md`
- `docs/task-board.md`
- `docs/decision-log.md`

Use these rules:

- Keep `docs/current-status.md` short and limited to the current state.
- Treat `docs/review-log.md` as append-only.
- Treat `docs/decision-log.md` as append-only.
- In `docs/task-board.md`, change only the selected task row unless adding a clearly needed follow-up row.
- Do not add duplicate lines with the same meaning.
- Do not leave stale `Next Task` text behind.
- At the end of work, name exactly one next task.

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
