# Task Board

`TaskBoardLoop` is the source of truth for choosing the next autonomous task.

## Now

| ID | Status | Owner | Task | Done When |
| --- | --- | --- | --- | --- |
| NOW-001 | Done | Orchestrator | Establish `AutomationFoundation` docs, CI, and verify scripts | Foundation docs exist, CI exists, and `npm run verify` is defined |
| NOW-002 | Done | QA | Run `VerificationLoop` when local npm or CI is available | lint, typecheck, and build pass or blockers are logged |
| NOW-003 | Done | Review Gate | Review starter app readiness without implementing URL-saving MVP | Findings are classified and safe follow-up tasks are added |
| NOW-004 | Done | Orchestrator | Establish Role Collaboration / Debate Protocol | Proposal, review, decision, handoff, and cross-role debate docs exist |
| NOW-005 | Done | Automation | Document conflict prevention and branch hygiene rules | Branch start, Pre-PR sync, Pre-Merge sync, conflict auto-fix, and shared docs edit rules are documented |

## Next

| ID | Status | Owner | Task | Done When |
| --- | --- | --- | --- | --- |
| NEXT-001 | Done | Product | Define smallest URL-saving MVP scope | Scope is documented without production DB changes |
| NEXT-002 | Open | Data Model | Draft URL-saving data model and non-destructive Supabase schema/RLS proposal with automation-ready type, test, migration, rollback, and preview-diagnostic notes | Draft exists in docs only and can be reviewed by future RoleCouncil, PR auto-review, QA, and DocsSync loops |
| NEXT-003 | Open | Design | Improve first screen clarity and responsive polish | UI remains simple and verification-safe |
| NEXT-004 | Open | Growth | Draft launch copy, FAQ, and onboarding text | Drafts exist locally and nothing is posted externally |
| NEXT-005 | Open | Automation | Design docs separation plan for detailed task logs currently crowding `docs/current-status.md` | Choose between `docs/tasks/`, `docs/status/`, or `docs/logs/` and document migration rules without moving history prematurely |

## Later

| ID | Status | Owner | Task | Done When |
| --- | --- | --- | --- | --- |
| LATER-001 | Waiting | Implementation | Implement URL-saving MVP after scope and schema are reviewed | Feature works with public Supabase env names only |
| LATER-002 | Waiting | QA | Add automated coverage for core flows | Tests cover save, edit, filtering, and basic responsive behavior |
| LATER-003 | Waiting | Launch | Prepare final release checklist | Checklist is ready; final launch waits for human approval |

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
5. Ignore rows with `Done` status when selecting the next task.

## Next Selected Task

`NEXT-002` is the one next safe autonomous task. It is a docs-only Data Model task to draft the URL-saving Supabase schema and RLS proposal from `docs/mvp-scope.md` and `docs/product-spec.md`; it should include generated type expectations, RLS test cases, rollback notes, search/index notes, and Supabase Preview diagnostics for future automation loops. It must not change the production database, write real env values, weaken RLS, or use service role keys.
