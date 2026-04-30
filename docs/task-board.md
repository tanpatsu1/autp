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
| NEXT-002 | Done | Data Model | Draft URL-saving data model and non-destructive Supabase schema/RLS proposal with automation-ready type, test, migration, rollback, and preview-diagnostic notes | Draft exists in docs only and can be reviewed by future RoleCouncil, PR auto-review, QA, and DocsSync loops |
| NEXT-003 | Done | Implementation | Implement URL Saving MVP from the accepted Product scope and reviewed Data Model / Supabase Schema / RLS docs | Local MVP UI supports URL save, list, edit, delete, favorite, search, category, tags, memo, and card/list flows; Supabase remains documented as unverified |
| NEXT-004 | Open | Growth | Draft launch copy, FAQ, and onboarding text | Drafts exist locally and nothing is posted externally |
| NEXT-005 | Open | Automation | Design docs separation plan for detailed task logs currently crowding `docs/current-status.md` | Choose between `docs/tasks/`, `docs/status/`, or `docs/logs/` and document migration rules without moving history prematurely |
| NEXT-006 | In Progress | QA / Review Gate / Vercel Verification | Complete URL Saving MVP verification; local smoke QA has passed and Vercel deployment / preview confirmation is next | Vercel preview loads, core MVP flows are checked in deployment, no High or Medium issues are found or any blockers are logged |
| NEXT-007 | Done | Product Direction Council / Orchestrator | Fill role-specific product direction council files and synthesize the direction without implementing new features | Product, Growth, Design, Data Model, Implementation, QA, Automation, Review Gate, and Orchestrator synthesis notes exist; product direction docs are ready for the user's final decision |
| NEXT-008 | Done | Product / Orchestrator | Confirm or revise the Product Direction Council recommendation with the user before the next major product build | User confirmed the direction in `docs/user-direction-confirmation.md`: AI-ready private decision board for saved links, first wedged through shopping / purchase candidates, with capture friction tracked as a product risk |
| NEXT-009 | Done | Product / Design / Orchestrator | Capture Friction Baseline Planning | `docs/capture-friction-baseline.md` defines URL-only fast save, minimal required fields, later organization, private-data handling, persistence handoff, and research-only capture boundaries |
| NEXT-010 | Done | Implementation / Data Model / QA | Supabase/Auth/RLS Persistence | App code, Supabase Auth flow, owner-scoped persistence helper, and non-production RLS migration draft exist; post-merge QA passed with the migration draft tightened; live Supabase application and two-user verification remain `NEXT-015` |
| NEXT-011 | Waiting | Automation / Review Gate | Token Efficiency follow-up / Autonomous Planning System docs and rubrics | Task scoring, council synthesis checklist, PR readiness checklist, Vercel failure taxonomy, Supabase diagnostics, AI evaluation rubric, and DocsSync rules exist before large AI/templates/sharing/monetization expansion |
| NEXT-012 | Open | Orchestrator | Task-board hygiene | Stale task wording and selection ordering are cleaned up without changing product behavior |
| NEXT-013 | Waiting | Product / Design / Implementation | Organization / retrieval improvements | Category/tag/favorite filters, sort, empty/loading/error/no-results states, and mobile retrieval comfort are planned or implemented after persistence |
| NEXT-014 | Done | Review Gate | Supabase Persistence Review | Post-merge QA reviewed code, migration draft, docs, RLS posture, env safety, local demo behavior, unsigned Supabase-configured behavior, and Vercel commit status; one Medium migration scope issue was fixed |
| NEXT-015 | Blocked | QA / Vercel / Supabase Verification | Verify Supabase/Auth/RLS persistence in preview or safe local Supabase | Auth sign-in, URL save/list/edit/delete/favorite/search, reload persistence, and two-user RLS denial are verified after safe public env values and reviewed migration application are provided outside the repo |
| NEXT-016 | Done | Automation Architect | Token Efficiency Audit v1 | Repeated work inventory, short prompt templates, docs-reading map, Skill consolidation plan, script candidates, and next token-reduction task are documented |
| NEXT-017 | Open | Automation / Skill Discovery | Create first Token Efficiency follow-up: PR readiness Skill and read-only helper plan | `autp-pr-readiness` scope and `scripts/pr-ready-check` behavior are proposed or implemented in a small safe PR without GitHub Actions or production changes |

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
| BLOCKED-005 | QA / Data | Supabase live Auth/RLS verification | Requires real environment configuration and reviewed migration application outside production automation | Provide a safe local or preview Supabase project, public env values outside the repo, and approval to apply the reviewed migration there |

## Selection Rule

1. Choose the first safe Now task.
2. If Now is blocked, choose the first safe Next task.
3. If a task requires `HumanGate`, move it to Blocked and add it to `docs/feedback-inbox.md`.
4. After work, update `docs/current-status.md` and `docs/review-log.md`.
5. Ignore rows with `Done` status when selecting the next task.

## Next Selected Task

`NEXT-015` is the next task, but it is blocked until `BLOCKED-005` is resolved in a safe local or preview Supabase environment.
