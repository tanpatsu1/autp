# Task Board

`TaskBoardLoop` is the source of truth for choosing the next autonomous task.

## Now

| ID | Status | Owner | Task | Done When |
| --- | --- | --- | --- | --- |
| NOW-001 | Done | Orchestrator | Establish `AutomationFoundation` docs, CI, and verify scripts | Foundation docs exist, CI exists, and `npm run verify` is defined |
| NOW-002 | Done | QA | Run `VerificationLoop` when local npm or CI is available | lint, typecheck, and build pass or blockers are logged |
| NOW-003 | Done | Review Gate | Review starter app readiness without implementing URL-saving MVP | Findings are classified and safe follow-up tasks are added |
| NOW-004 | Done | Orchestrator | Establish Role Collaboration / Debate Protocol | Proposal, review, decision, handoff, and cross-role debate docs exist |

## Next

| ID | Status | Owner | Task | Done When |
| --- | --- | --- | --- | --- |
| NEXT-001 | Done | Product | Define smallest URL-saving MVP scope | Scope is documented without production DB changes |
| NEXT-002 | Done | Data Model | Draft URL-saving data model and non-destructive Supabase schema/RLS proposal with automation-ready type, test, migration, rollback, and preview-diagnostic notes | Draft exists in docs only and can be reviewed by future RoleCouncil, PR auto-review, QA, and DocsSync loops |
| NEXT-003 | Open | Implementation | Implement URL Saving MVP from the accepted Product scope and reviewed Data Model / Supabase Schema / RLS docs | Private authenticated URL save, list, edit, favorite, search, and card/list flows work with reviewed schema and RLS |
| NEXT-004 | Open | Growth | Draft launch copy, FAQ, and onboarding text | Drafts exist locally and nothing is posted externally |
| NEXT-005 | Open | Automation | Design the next automation implementation plan for scheduled task discovery, role council review, PR merge-candidate checks, Vercel failure diagnosis, Supabase preview diagnostics, and docs sync | Plan exists in docs only and does not add GitHub Actions, env values, billing, production DB changes, or launch execution |

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

`NEXT-003` is the next safe autonomous task. Implementation should build the private URL Saving MVP from `docs/mvp-scope.md`, `docs/product-spec.md`, `docs/data-model.md`, `docs/supabase-schema.md`, and `docs/rls-policy.md`. It must keep RLS enabled, avoid service role keys and real env values, avoid production DB changes from automation, and verify save, list, edit, favorite, search, and card/list behavior.

## Next Automation Task

`NEXT-005` is the next automation-specific implementation-planning task. It should define how to safely implement scheduled discovery, role council review, PR merge-candidate checks, Vercel failure diagnosis, Supabase preview diagnostics, and automatic docs sync without starting code implementation in this policy update.
