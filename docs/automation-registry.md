# Automation Registry

Automation names are English and define repeatable project loops.

| Automation Name | Trigger | Steps | Human Gate |
| --- | --- | --- | --- |
| `TaskBoardLoop` | Any short instruction or new work session | Read status, choose Now/Next task, execute safe batch, update docs | Stop if the selected task requires human confirmation |
| `VerificationLoop` | Code, config, CI, or risky docs changes | Run verify, fix safe failures, rerun, log result | Stop if a fix requires secrets, billing, production deletion, weaker RLS, or final launch |
| `ReviewGate` | Before marking work done | Check scope, safety, verification, docs, and follow-ups | Stop only for `HumanConfirmationRequired` |
| `FeedbackInboxLoop` | Human-gated or unclear item appears | Record requested action, reason, recommendation, and risks | Wait for human decision |
| `CIFixLoop` | CI fails | Inspect first actionable failure, patch safe issue, rerun or document | Stop for paid plan, secret, or destructive production requirements |
| `LaunchPrepLoop` | Launch preparation starts | Draft checklist and copy locally | Stop before public post or final production launch |

## Activation Priority

| Priority | Automation Name | Operating Mode | Why |
| --- | --- | --- | --- |
| 1 | `TaskBoardLoop` | Active first | It turns short instructions into the next safe task, chooses Skills, advances one small batch, and updates docs. |
| 2 | `VerificationLoop` | Support loop | It runs after code, config, CI, or risky docs changes selected by `TaskBoardLoop`. |
| 3 | `ReviewGate` | Support loop | It checks scope, safety, verification, and docs before work is considered done. |
| 4 | `FeedbackInboxLoop` | Support loop | It captures human-gated items without performing them. |
| 5 | `CIFixLoop` | On demand | It runs only when CI, lint, typecheck, or build fails. |
| 6 | `LaunchPrepLoop` | Later / on demand | It prepares local launch materials but cannot execute public launch. |

## First Active Automation

`TaskBoardLoop` is the first automation to use in live operation. A short request like `next`, `continue`, or `次進めて` should be interpreted as a request to run `TaskBoardLoop`.

## Registry Rule

Codex should prefer these automations over ad hoc decisions. If an automation conflicts with `docs/automation-policy.md`, the policy wins.
