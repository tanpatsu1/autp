# Automation Registry

This registry defines the recurring Codex Automations that keep autp moving by default. Automations should continue automatically until they hit a human-confirmation condition in `docs/automation-policy.md`.

## Operating Model

- Default mode: proceed automatically for reversible product, design, implementation, QA, review, documentation, and planning work.
- Stop mode: pause only for external public posting, money-related actions, secrets, destructive production changes, weaker RLS, service role key use, or final public production launch.
- Source of truth: read `AGENTS.md`, `docs/current-status.md`, `docs/automation-policy.md`, `docs/task-board.md`, `docs/compact-context.md`, `docs/verification-loop.md`, `docs/skill-registry.md`, and `docs/feedback-inbox.md` before making automation decisions.
- Logging: every completed or blocked automation cycle should append a short entry to `docs/automation-log.md` and `docs/review-log.md`.
- Verification: run `npm run verify` when available; otherwise run `npm run lint`, `npm run typecheck`, and `npm run build` when available. Record exact blockers when tools are missing.

## Human Confirmation Required

Codex must not perform these actions automatically. Add them to `docs/feedback-inbox.md` instead.

- SNS posting
- External public website posting
- Charging money
- Purchases
- Paid plan changes
- Domain purchases
- Production data deletion
- DB table deletion
- Weakening RLS policies
- Publishing real environment values or secrets
- Using a service role key
- Final public production launch

## Periodic Automations

| Automation | Frequency | Purpose | Inputs | Outputs | Skills | Stop Conditions |
| --- | --- | --- | --- | --- | --- | --- |
| Daily Project Sweep | Daily | Read task-board, current-status, and feedback-inbox; choose the next safe task that can move autp forward. | `docs/task-board.md`, `docs/current-status.md`, `docs/feedback-inbox.md`, `docs/automation-policy.md`, `docs/compact-context.md` | Selected task, role routing, updated status/logs, blocked human-confirmation items if any | `autp-orchestrator`, `autp-automation-runner` | Stop for any human-confirmation action, missing required decision, unavailable secrets needed for live verification, or final production launch |
| Skill Discovery Sweep | Weekly or on demand | Audit whether repeated autp workflows need new or updated Skills. | `.agents/skills/`, `docs/skill-registry.md`, `docs/skill-discovery-log.md`, `docs/task-board.md` | Skill proposals, registry updates, discovery log entries | `autp-skill-discovery` | Stop before adding unsafe guidance, secret handling, production DB actions, or external publishing actions |
| Product Improvement Sweep | Weekly | Organize MVP improvements, usability gaps, and next feature candidates without making risky production changes. | `docs/task-board.md`, `docs/current-status.md`, product notes, feedback inbox | Prioritized product tasks, acceptance criteria, local growth/onboarding drafts | `autp-product`, `autp-growth` | Stop before external posting, paid actions, domain actions, production data changes, or final launch |

## Caution Automations

| Automation | Frequency | Purpose | Inputs | Outputs | Skills | Stop Conditions |
| --- | --- | --- | --- | --- | --- | --- |
| CI Failure Fix Loop | On demand / after PR update | Automatically fix CI, build, typecheck, or lint failures when the fix is safe and scoped. | CI logs, local command output, changed files, `docs/verification-loop.md` | Code/docs fix, rerun result, review-log entry, unresolved blocker if needed | `autp-qa`, `autp-implementation`, `autp-review-gate` | Stop if the fix requires secrets, real env values, service role keys, production DB changes, weaker RLS, paid actions, or unclear product decisions |
| Review Gate Sweep | After implementation / before merge | Review PRs or local changes, auto-fix safe issues, and record remaining risks. | Diff or PR patch, `docs/automation-policy.md`, `docs/verification-loop.md`, `docs/review-log.md` | Findings, safe fixes, verification result, known limitations | `autp-review-gate` | Stop for policy violations, destructive production actions, secret exposure, weaker RLS, or final launch approval |
| Vercel Preview Check | After PR / deploy | Check Vercel Preview state and record deployment or runtime failures. | Preview URL, Vercel deployment status, browser result, console output when available | Preview status, failure notes, review-log entry, follow-up task | `autp-qa` | Stop before changing paid plans, billing, production environment settings, secrets, production data, or final public launch |
| Launch Readiness Sweep | Before launch / on demand | Prepare release readiness, README, FAQ, usage notes, LP copy, limitations, and approval checklist. | `docs/current-status.md`, `docs/task-board.md`, README, draft launch docs, verification results | Launch checklist, local copy drafts, blocked final-launch approval item | `autp-launch`, `autp-growth` | Stop before external posting, production launch execution, paid actions, domains, or secret exposure |

## Efficiency Automations

| Automation | Frequency | Purpose | Inputs | Outputs | Skills | Stop Conditions |
| --- | --- | --- | --- | --- | --- | --- |
| Documentation Sync | After every meaningful change | Fix drift in current-status, task-board, review-log, and related docs. | Changed files, `docs/current-status.md`, `docs/task-board.md`, `docs/review-log.md`, `docs/automation-log.md` | Updated docs, next recommended task, verification note | `autp-orchestrator` | Stop if the doc update would reveal real env values, secrets, credentials, or unapproved external launch details |

## Automation Detail Cards

### Daily Project Sweep

- Title: `Daily Project Sweep`
- Description: `Read the active project docs, pick the next safe autp task, route it to the right Skill, and update status without waiting for repeated confirmation.`
- Frequency: `daily`
- Internal prompt:

```text
You are running the Daily Project Sweep for autp. Read AGENTS.md, docs/current-status.md, docs/automation-policy.md, docs/task-board.md, docs/compact-context.md, docs/verification-loop.md, docs/skill-registry.md, and docs/feedback-inbox.md. Select the highest safe task from Now, then Next, then Later. Use autp-orchestrator and autp-automation-runner. Do not perform human-confirmation actions. Update docs/current-status.md, docs/review-log.md, docs/automation-log.md, and docs/task-board.md when appropriate. Run available verification or record why it cannot run.
```

### CI Failure Fix Loop

- Title: `CI Failure Fix Loop`
- Description: `Fix safe CI, lint, typecheck, and build failures automatically, then rerun verification and record any blocker.`
- Frequency: `on demand / after PR update`
- Internal prompt:

```text
You are running the CI Failure Fix Loop for autp. Inspect the failing CI, build, typecheck, or lint output. Use autp-qa, autp-implementation, and autp-review-gate. Fix only safe, scoped issues. Do not write real env values, expose secrets, use service role keys, change production databases, weaken RLS, spend money, or launch production. Rerun the failed check when possible and update docs/review-log.md, docs/current-status.md, and docs/automation-log.md.
```

### Review Gate Sweep

- Title: `Review Gate Sweep`
- Description: `Review implementation or PR changes for bugs, policy violations, verification gaps, and docs drift before merge.`
- Frequency: `after implementation / before merge`
- Internal prompt:

```text
You are running the Review Gate Sweep for autp. Review the diff or PR patch with autp-review-gate. Prioritize bugs, regressions, missing verification, policy violations, and docs drift. Auto-fix safe issues only. Stop and route human-confirmation items to docs/feedback-inbox.md. Record findings, verification, and next steps in docs/review-log.md and docs/automation-log.md.
```

### Skill Discovery Sweep

- Title: `Skill Discovery Sweep`
- Description: `Audit the autp Skill set and propose or document new Skills for repeated workflows.`
- Frequency: `weekly or on demand`
- Internal prompt:

```text
You are running the Skill Discovery Sweep for autp. Use autp-skill-discovery to inspect .agents/skills, docs/skill-registry.md, docs/skill-discovery-log.md, docs/task-board.md, and recent review-log entries. Identify repeated workflows that need new or updated Skills. Update registry and discovery docs when safe. Do not create guidance that permits external posting, paid actions, secret exposure, production destructive changes, weaker RLS, service role key use, or final public launch without human confirmation.
```

### Documentation Sync

- Title: `Documentation Sync`
- Description: `Keep status, task, review, and automation docs aligned after meaningful work.`
- Frequency: `after every meaningful change`
- Internal prompt:

```text
You are running Documentation Sync for autp. Use autp-orchestrator. Compare recent changes with docs/current-status.md, docs/task-board.md, docs/review-log.md, docs/automation-log.md, and related docs. Update stale status, verification notes, task states, and next recommended work. Do not include real env values, secrets, credentials, or unapproved external launch details.
```

### Vercel Preview Check

- Title: `Vercel Preview Check`
- Description: `Check the Vercel Preview after PRs or deployments and record failures with safe follow-up tasks.`
- Frequency: `after PR / deploy`
- Internal prompt:

```text
You are running the Vercel Preview Check for autp. Use autp-qa. Inspect the Vercel Preview status, open the preview when available, check that the app loads, and record console or deployment failures when tooling permits. Do not change billing, paid plans, production env values, secrets, production data, RLS, or final launch settings. Update docs/review-log.md, docs/current-status.md, and docs/automation-log.md.
```

### Product Improvement Sweep

- Title: `Product Improvement Sweep`
- Description: `Organize safe MVP improvements, usability gaps, and next feature tasks without performing risky actions.`
- Frequency: `weekly`
- Internal prompt:

```text
You are running the Product Improvement Sweep for autp. Use autp-product and autp-growth. Review docs/task-board.md, docs/current-status.md, docs/feedback-inbox.md, and recent review-log entries. Propose or refine small MVP tasks, acceptance criteria, onboarding copy, and local growth drafts. Do not post externally, spend money, buy domains, alter production data, weaken RLS, expose secrets, or execute final public launch.
```

### Launch Readiness Sweep

- Title: `Launch Readiness Sweep`
- Description: `Prepare launch readiness materials while keeping final public launch gated by human approval.`
- Frequency: `before launch / on demand`
- Internal prompt:

```text
You are running the Launch Readiness Sweep for autp. Use autp-launch and autp-growth. Review current status, verification results, README, FAQ, onboarding copy, launch copy, known limitations, rollback notes, and approval needs. Draft local materials only. Do not publish externally, spend money, buy domains, reveal secrets, change production data, or execute final public production launch. Add final launch approval requests to docs/feedback-inbox.md.
```
