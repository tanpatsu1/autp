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

## Registry Rule

Codex should prefer these automations over ad hoc decisions. If an automation conflicts with `docs/automation-policy.md`, the policy wins.
