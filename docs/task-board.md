# Task Board

Codex uses this file to choose the next autonomous task. Pick the highest item in Now first, then Next, then Later. If a task requires human confirmation under `docs/automation-policy.md`, move it to Blocked and add details to `docs/feedback-inbox.md`.

## Now

| ID | Owner | Task | Done When |
| --- | --- | --- | --- |
| NOW-001 | Orchestrator | Keep automation docs aligned and readable | Core docs exist and point Codex to the next safe task |
| NOW-002 | QA | Run the available verification loop when local npm or CI is available | lint, typecheck, build, and Vercel checks pass or blockers are logged |
| NOW-003 | Review Gate | Review the starter app for MVP readiness without adding URL persistence yet | Issues are classified and safe follow-up tasks are added here |

## Next

| ID | Owner | Task | Done When |
| --- | --- | --- | --- |
| NEXT-001 | Product | Define the smallest URL-saving MVP scope | Scope is documented without touching production DB or real env values |
| NEXT-002 | Design | Improve the first screen for clarity and responsive polish | UI remains simple, readable, and build-safe |
| NEXT-003 | Implementation | Prepare non-destructive Supabase schema draft | Draft exists in docs only and includes RLS proposal, not production changes |
| NEXT-004 | Growth | Draft launch copy and onboarding text | Drafts exist locally; nothing is posted externally |

## Later

| ID | Owner | Task | Done When |
| --- | --- | --- | --- |
| LATER-001 | Implementation | Implement URL-saving MVP after schema and RLS review | Feature works locally with safe public env usage |
| LATER-002 | QA | Add automated tests for core flows | Tests cover save, edit, filter, and responsive basics |
| LATER-003 | Launch | Prepare final release checklist | Checklist is ready, but final public launch waits for human approval |

## Blocked

| ID | Owner | Blocked Item | Why Blocked | Required Human Decision |
| --- | --- | --- | --- | --- |
| BLOCKED-001 | Launch | Final public production launch | Human confirmation is required | Approve or reject final launch |
| BLOCKED-002 | Growth | Any SNS or external public post | Human confirmation is required | Approve exact platform and copy |
| BLOCKED-003 | Product | Paid plan, billing, purchase, or domain action | Human confirmation is required | Approve or reject spending |
| BLOCKED-004 | Data | Production data deletion, DB table drop, or weaker RLS | Human confirmation is required | Approve only with rollback and risk notes |

## Selection Rule

1. Prefer Now tasks.
2. Skip Blocked tasks unless the human has explicitly approved them.
3. Favor docs, verification, and reversible implementation before risky product changes.
4. After finishing a task, update this board, `docs/current-status.md`, and `docs/review-log.md`.
