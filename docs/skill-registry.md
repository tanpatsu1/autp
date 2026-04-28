# Skill Registry

Skill names are English and describe reusable Codex work modes for autp.

| Skill Name | Purpose | Inputs | Outputs |
| --- | --- | --- | --- |
| `AutomationOrchestrator` | Choose the next safe task and coordinate roles | `docs/current-status.md`, `docs/task-board.md`, `docs/automation-policy.md` | Updated task selection and status |
| `ReviewGateRunner` | Classify findings and decide safe auto-fixes | Changed files, verification output, UI notes | Findings and follow-up tasks |
| `VerificationRunner` | Run lint, typecheck, build, and preview checks | package scripts, CI logs, Vercel preview | Verification result |
| `DocsMaintainer` | Keep docs current and compact | Recent changes, task board, review log | Updated docs |
| `LaunchDraftWriter` | Draft launch, FAQ, onboarding, and marketing copy | Product notes and constraints | Local draft copy only |
| `SupabaseDraftPlanner` | Draft schema and RLS proposals without production changes | MVP scope and data needs | Non-destructive docs drafts |

## Skill Rule

Skills may run automatically unless they hit `HumanConfirmationRequired`.
