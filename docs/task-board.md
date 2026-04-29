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
| NEXT-008 | Open | Product / Orchestrator | Confirm or revise the Product Direction Council recommendation with the user before the next major product build | User confirms whether autp should proceed as an AI-ready private decision board for saved links, first wedged through shopping / purchase candidates, or chooses a different direction |
| NEXT-009 | Done | Product Direction / Growth / Review Gate | Add weakness, capture-friction, iframe feasibility, positioning, and distribution analysis to the Product Direction decision docs without implementation | Weakness analysis exists, roadmap/priority/growth/user-decision docs are updated, iframe is research-only, HumanGate risks are explicit, and verification passes |
| NEXT-010 | Open | Product / Design | Define capture-friction baseline acceptance criteria before large feature expansion | Fast paste, minimal required fields, save confirmation, mobile capture expectations, private-data handling, and iframe deferral are documented as implementation-ready criteria |

## Later

| ID | Status | Owner | Task | Done When |
| --- | --- | --- | --- | --- |
| LATER-001 | Waiting | Implementation | Implement URL-saving MVP after scope and schema are reviewed | Feature works with public Supabase env names only |
| LATER-002 | Waiting | QA | Add automated coverage for core flows | Tests cover save, edit, filtering, and basic responsive behavior |
| LATER-003 | Waiting | Launch | Prepare final release checklist | Checklist is ready; final launch waits for human approval |
| LATER-004 | Waiting | Product / Implementation | Research bookmarklet and Web Share Target capture channels after persistence and auth are stable | A comparison note covers usability, auth/session behavior, permissions, privacy copy, and verification path before implementation |
| LATER-005 | Waiting | Product / Security Review | Research capture-in-context alternatives, including why iframe / embedded browsing should remain deferred unless proven safe | Security, privacy, terms, and UX risks are reviewed without building embedded browsing |

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

`NEXT-006` is the recommended next safe task. Vercel Verification should confirm the URL Saving MVP deployment / preview loads, verify save, list, edit, favorite, search, category, tag, memo, and card/list behavior in deployment, and log any blockers. After preview verification, `NEXT-008` should capture the user's final product-direction choice before Supabase/Auth persistence or new feature work begins.
