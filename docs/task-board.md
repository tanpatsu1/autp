# Task Board

`TaskBoardLoop` is the source of truth for choosing the next autonomous task.

## Now

| ID | Owner | Task | Done When |
| --- | --- | --- | --- |
| NOW-001 | Orchestrator | Establish `AutomationFoundation` docs, CI, and verify scripts | Foundation docs exist, CI exists, and `npm run verify` is defined |
| NOW-002 | QA | Run `VerificationLoop` when local npm or CI is available | lint, typecheck, and build pass or blockers are logged |
| NOW-003 | Review Gate | Review starter app readiness without implementing URL-saving MVP | Findings are classified and safe follow-up tasks are added |

## Next

| ID | Owner | Task | Done When |
| --- | --- | --- | --- |
| NEXT-001 | Product | Define smallest URL-saving MVP scope | Scope is documented without production DB changes |
| NEXT-002 | Implementation | Draft non-destructive Supabase schema and RLS proposal | Draft exists in docs only |
| NEXT-003 | Design | Improve first screen clarity and responsive polish | UI remains simple and verification-safe |
| NEXT-004 | Growth | Draft launch copy, FAQ, and onboarding text | Drafts exist locally and nothing is posted externally |

## Later

| ID | Owner | Task | Done When |
| --- | --- | --- | --- |
| LATER-001 | Implementation | Implement URL-saving MVP after scope and schema are reviewed | Feature works with public Supabase env names only |
| LATER-002 | QA | Add automated coverage for core flows | Tests cover save, edit, filtering, and basic responsive behavior |
| LATER-003 | Launch | Prepare final release checklist | Checklist is ready; final launch waits for human approval |

## Blocked

| ID | Owner | Blocked Item | Why Blocked | Required Human Decision |
| --- | --- | --- | --- | --- |
| BLOCKED-001 | Launch | Final public production launch | `HumanConfirmationRequired` | Approve or reject final launch |
| BLOCKED-002 | Growth | Any SNS or external public post | `HumanConfirmationRequired` | Approve exact platform and copy |
| BLOCKED-003 | Product | Paid plan, billing, purchase, or domain action | `HumanConfirmationRequired` | Approve or reject spending |
| BLOCKED-004 | Data | Production data deletion, DB table deletion, or weaker RLS | `HumanConfirmationRequired` | Approve only with rollback and risk notes |

## Selection Rule

1. Choose the first safe Now task.
2. If Now is blocked, choose the first safe Next task.
3. If a task requires `HumanGate`, move it to Blocked and add it to `docs/feedback-inbox.md`.
4. After work, update `docs/current-status.md` and `docs/review-log.md`.
