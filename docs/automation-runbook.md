# Automation Runbook

This runbook turns the automation registry into live Codex operation. The first active automation is `TaskBoardLoop`.

## Live Operation Decision

- Active automation: `TaskBoardLoop`
- Trigger phrase: `次進めて`
- English equivalent triggers: `next`, `continue`, `run TaskBoardLoop`
- Scope for this setup: automation operation only
- Explicit non-goal: do not implement the full URL-saving MVP during automation setup

## Automation Priority

| Priority | Automation | Use Now? | Role |
| --- | --- | --- | --- |
| 1 | `TaskBoardLoop` | Yes | Default loop for choosing and advancing the next safe task. |
| 2 | `VerificationLoop` | Support | Runs after code, config, CI, or risky docs changes. |
| 3 | `ReviewGate` | Support | Checks scope, policy, verification, docs, and follow-ups before completion. |
| 4 | `FeedbackInboxLoop` | Support | Records human-confirmation items and stops that action. |
| 5 | `CIFixLoop` | On demand | Fixes safe CI, lint, typecheck, or build failures. |
| 6 | `LaunchPrepLoop` | Later | Drafts local launch materials, but never launches publicly. |

## Branch Hygiene And Conflict Prevention

Use this section for every Codex-owned work branch and PR.

### Branch Start Rule

Before starting new work, update `main`, install dependencies, verify, and branch from the latest `main`:

```bash
git checkout main
git pull origin main
npm install
npm run verify
git checkout -b <work-branch>
```

If another task has uncommitted local changes, preserve them. Use a separate clean worktree when needed so unrelated changes do not enter the new branch.

### Pre-PR Sync Rule

Before creating a PR:

1. Fetch and update `main`.
2. Merge or rebase the PR branch onto latest `main`.
3. Resolve conflicts directly if they appear.
4. Run `npm install` if dependency files changed.
5. Run `npm run verify`.
6. Create the PR only after verification passes or a blocker is recorded.

### Pre-Merge Sync Rule

If `main` changes while a PR is waiting to merge, update the PR branch from latest `main`. Resolve conflicts, run `npm run verify`, and push a follow-up commit before treating the PR as merge-ready.

### Conflict Auto-Fix Rule

When GitHub reports a conflict on a Codex-owned PR, Codex handles the first repair pass:

1. Inspect every conflicted file.
2. Compare `main` and branch diffs.
3. Preserve the branch's intended work.
4. Incorporate newer `main` content.
5. Remove every conflict marker.
6. Run `npm run verify`.
7. Push an additional PR commit.

Escalate through `HumanGate` only if the conflict cannot be resolved without a prohibited action.

### Shared Docs Edit Rule

Conflict-prone shared docs need narrow edits:

- `docs/current-status.md`: keep only short current state, open issues, one next task, and latest verification.
- `docs/review-log.md`: append-only; do not rewrite old entries unless fixing an obvious typo in the current PR.
- `docs/decision-log.md`: append-only; add one decision entry for meaningful automation behavior changes.
- `docs/task-board.md`: change only the selected task row unless adding a necessary follow-up row.
- Avoid duplicate lines with the same meaning.
- Remove stale `Next Task` text.
- End each work session with exactly one explicit next task.

## TaskBoardLoop Prompt

Use this exact prompt when the user says `次進めて` or asks Codex to continue autp autonomously:

```text
Run TaskBoardLoop for autp. Read AGENTS.md, docs/current-status.md, docs/automation-policy.md, docs/automation-registry.md, docs/task-board.md, docs/skill-registry.md, docs/feedback-inbox.md, docs/verification-loop.md, and docs/review-log.md. Before starting a new branchable task, update main, run npm install, run npm run verify, and branch from latest main; preserve unrelated local work with a clean worktree if needed. Select the first Open safe task from docs/task-board.md in this order: Now, then Next, then Later. Skip Done, Waiting, and Blocked items. Choose the required autp Skill or Skills from docs/skill-registry.md. If the selected task requires HumanConfirmationRequired, do not perform it; add it to docs/feedback-inbox.md and record the stop in docs/review-log.md. Otherwise complete one small safe batch, run verification when relevant, use ReviewGate before finishing, update docs/current-status.md, docs/review-log.md, and docs/task-board.md, sync the PR branch with latest main, resolve conflicts directly, run npm run verify, and create a PR if files changed. Do not implement the full URL-saving MVP during automation-foundation work. Do not add real env values, charge money, post externally, change production DB, delete production data, weaken RLS, use service role keys, or execute final public production launch.
```

## TaskBoardLoop Steps

1. Read required context:
   - `AGENTS.md`
   - `docs/current-status.md`
   - `docs/automation-policy.md`
   - `docs/automation-registry.md`
   - `docs/task-board.md`
   - `docs/skill-registry.md`
   - `docs/feedback-inbox.md`
   - `docs/verification-loop.md`
   - `docs/review-log.md`
2. Apply the Branch Start Rule before new branchable work.
3. Select the first safe `Open` task from `docs/task-board.md`.
4. Prefer `Now`, then `Next`, then `Later`.
5. Ignore `Done`, `Waiting`, and `Blocked` rows.
6. Choose the smallest useful batch for the selected task.
7. Choose the required Skill or Skills from `docs/skill-registry.md`.
8. If the task hits `HumanConfirmationRequired`, route it to `docs/feedback-inbox.md` and stop that action.
9. If safe, execute the batch.
10. Run `VerificationLoop` when the batch changes code, config, CI, or risky docs.
11. Run `ReviewGate` before completion.
12. Update `docs/task-board.md`, `docs/current-status.md`, and `docs/review-log.md` using the Shared Docs Edit Rule.
13. Apply the Pre-PR Sync Rule.
14. Open a PR when files changed and verification passes.

## Skill Selection Guide

| Task Type | Preferred Skill |
| --- | --- |
| Task selection, routing, docs alignment | `autp-orchestrator` |
| Safe autonomous execution | `autp-automation-runner` |
| MVP scope, acceptance criteria, non-goals | `autp-product` |
| UI clarity, responsive polish, accessibility | `autp-design` |
| Supabase schema and RLS drafts only | `autp-data-model` |
| Small code, CI, and docs changes | `autp-implementation` |
| Safety and regression review | `autp-review-gate` |
| Local, CI, and preview checks | `autp-qa` |
| Local onboarding, FAQ, and launch copy drafts | `autp-growth` |
| Launch readiness drafts and approval checklist | `autp-launch` |
| Skill audits and registry maintenance | `autp-skill-discovery` |

## Human Gate

Stop and write to `docs/feedback-inbox.md` before:

- SNS posting
- External public posting
- Billing, purchases, paid plan changes, or domain purchases
- Real environment values or secret exposure
- Service role key use
- Production data deletion
- DB table deletion
- Weaker RLS
- Final public production launch

## Verification Rule

For code, config, CI, or risky docs changes, run:

```bash
npm run verify
```

If that is not available, run:

```bash
npm run lint
npm run typecheck
npm run build
```

For docs-only operational changes, record:

```text
Not run. Docs-only automation operation setup.
```

## Completion Output

Each `TaskBoardLoop` run should report:

- Selected task and reason
- Skills used
- Actions taken
- Verification result or blocker
- Human-gated items, if any
- Files changed
- PR link, if created
- Next recommended task
