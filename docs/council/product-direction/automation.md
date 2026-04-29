# Automation / Autonomous Development Perspective

## Role Scope

Automation evaluates which product directions can be advanced safely through Codex-driven task discovery, role review, docs sync, verification, PR creation, Vercel diagnosis, Supabase preview diagnostics, and repair loops.

This file is a council input only. It does not add automations, GitHub Actions, code, external services, env values, database changes, billing, posting, or launch execution.

## Automation Position

autp should treat autonomous development as a product capability multiplier, not only an internal convenience. The best next product direction is one that can be decomposed into small, reviewable, verifiable increments where Codex can repeatedly:

1. discover the next safe task,
2. collect role-specific opinions in docs,
3. synthesize a narrow decision,
4. implement or document one small batch,
5. run verification,
6. create a PR,
7. react to CI, Vercel, QA, and review feedback,
8. stop at HumanGate for dangerous actions.

From an Automation Runner view, the strongest direction is an AI-assisted personal decision workspace that starts as URL saving and grows into comparison, summarization, classification, and recommendation support. Shopping, fashion/brand, student research, and AI bookmark management all fit this path. Hospital or medical-service comparison may have strong user value, but it carries higher trust, privacy, and claim-risk burdens and should wait until Review Gate and QA automation are stronger.

## What Codex Needs To Suggest Next Tasks Automatically

Codex can suggest next task candidates reliably when project state is machine-readable enough to avoid guessing. Automation v2 should add a docs-first task discovery model before deeper feature expansion:

- A single task source of truth with stable IDs, status, owner, risk level, dependencies, and verification requirement.
- Per-role council files for strategic debate, with Orchestrator synthesis separate from role notes.
- A rule that each completed PR records exactly one next task and optional follow-up candidates.
- A lightweight task scoring rubric: user value, safety, dependency readiness, verification cost, conflict risk, and HumanGate risk.
- Explicit blockers for Supabase/Auth, Vercel preview, AI evaluation, billing, posting, and launch.
- A stale-docs detector rule: if `current-status.md`, `task-board.md`, or council files disagree, DocsSync should propose a docs-only correction PR.

The user should not need to ask "what next?" every time. The default loop should be: inspect task board and council state, propose the safest highest-leverage next task, execute if allowed, and stop only for HumanGate or unresolved product direction.

## Strengthening Docs-Based Role Council Flow

The Product Direction Council should become the pattern for future strategy work:

- Each role edits only its own file to prevent conflicts.
- Review Gate reviews all role files after they are filled.
- Orchestrator writes synthesis only after Review Gate confirms the inputs are safe and complete.
- Synthesis should separate consensus, disagreements, unknowns, HumanGate items, and safe next tasks.
- Product direction decisions should become small acceptance criteria, not broad strategy slogans.
- Implementation should not start until the decision names the approved scope, non-goals, verification path, and rollback or deferral plan.

This makes autonomous development safer because Codex can operate from structured role inputs instead of inventing direction inside an implementation chat.

## Automation Fit Comparison

| Direction | Small PR Fit | Docs Review Fit | Auto-Verification Fit | HumanGate Risk | Notes |
| --- | --- | --- | --- | --- | --- |
| AI bookmark manager | High | High | Medium | Medium | Natural extension from saved URLs. AI summaries/classification need evaluation, cost, privacy, and prompt-output review before automation runs them broadly. |
| Shopping decision board | High | High | High | Medium | Strong fit for saved URLs, comparison fields, favorites, notes, and decision status. Monetization and affiliate ideas must remain HumanGate until approved. |
| Fashion / brand manager | High | High | Medium | Medium | Good visual and categorization fit. Brand/product data can start user-entered; scraping, external posting, and affiliate monetization need later gates. |
| Hospital / service comparison | Medium | High | Low | High | Useful but sensitive. Claims, medical-adjacent advice, privacy, and ranking risk require strong Review Gate and QA before productization. |
| Student research organizer | High | High | Medium | Low | Good fit for URL saving, notes, summaries, and project grouping. AI assistance needs citation and hallucination checks. |
| Personal decision workspace | High | High | Medium | Medium | Best umbrella direction for automation: URLs become evidence, notes become criteria, AI helps compare, and roles can review vertical templates incrementally. |

## Evaluation Against Council Axes

| Axis | Automation View |
| --- | --- |
| Automation effect | Highest when the product decomposes into repeatable evidence, metadata, comparison, summary, and verification tasks. |
| Human effort reduction | Strongest if Codex can generate next tasks, draft role reviews, verify PRs, and diagnose failures without waiting for "next?" prompts. |
| Safety | Strong if HumanGate remains hard-coded for billing, posting, secrets, service role keys, production DB changes, weaker RLS, and launch. |
| Conflict prevention | Strong if role files stay separate and shared docs only track current state, decisions, and one next task. |
| Docs operation fit | Very high for product strategy, because council files can become durable inputs to Orchestrator synthesis and PR review. |
| Implementation ease | Best if Automation v2 starts as docs/runbook/rubric improvements before GitHub Actions or external services. |
| Early value | High: even docs-only Automation v2 can reduce user prompting, PR drift, and unsafe scope jumps. |

## Automation v2 Need

Automation v2 should happen soon after the Product Direction Council role inputs are filled and synthesized, but before large AI or vertical feature expansion.

Reason: the current project already has enough moving parts that manual prompting becomes the bottleneck. Supabase/Auth, Vercel preview checks, local-first persistence, AI feature proposals, docs sync, and role debates will create more coordination work than a human should repeatedly manage by hand.

Automation v2 should not start by adding GitHub Actions. It should start as docs and local-runner behavior:

- `TaskDiscoveryLoop`: reads task board, council synthesis, review log, current status, and open blockers; proposes the next safe task.
- `RoleCouncilLoop`: checks whether required role files exist before synthesis or implementation.
- `SynthesisLoop`: helps Orchestrator convert role notes into decision-ready options without choosing silently.
- `PRAutoReviewLoop`: checks scope, changed files, verification result, HumanGate risk, and docs alignment before PR creation or merge-readiness.
- `VercelFailureLoop`: inspects deployment state and classifies failures as code, config, env-name, platform, or unknown before proposing a safe fix.
- `SupabasePreviewDiagnosticsLoop`: separates missing preview env names, unapplied migrations, RLS denial, RLS over-permission, and service-role requests.
- `DocsSyncLoop`: keeps current status short, review log append-only, decision log append-only, and task board focused on selected rows.

## Proposed Automation v2 Implementation Candidates

These are candidate future tasks, not work to execute in this council pass:

| Candidate | Purpose | Safe First Form | HumanGate Risk |
| --- | --- | --- | --- |
| Task scoring rubric | Rank next tasks without user asking | Docs-only rubric in automation runbook | Low |
| Council synthesis checklist | Ensure Orchestrator integrates all role inputs | Docs-only checklist in council synthesis template | Low |
| PR readiness checklist | Prevent PRs missing verify, docs, or branch sync | Docs-only checklist before code automation | Low |
| Vercel failure classifier | Reduce manual deployment debugging | Docs-only failure taxonomy first | Medium if env or billing is needed |
| Supabase preview diagnostics | Avoid confusing platform limits with app bugs | Docs-only diagnostic matrix first | High if service role or production DB is requested |
| Local automation runner prompt | Let Codex run a full safe cycle from one trigger | Runbook prompt only, no scheduled external execution | Low |
| AI evaluation harness proposal | Prepare for summaries/classification safely | Docs-only quality rubric first | Medium because AI cost/privacy may matter |

## Orchestrator Integration Procedure

After all role files are filled, Orchestrator should:

1. Confirm each role edited only its assigned file.
2. Ask Review Gate to identify unsafe proposals, missing evidence, and HumanGate items.
3. Build an option matrix in `synthesis.md` with support signals, concern signals, open questions, and safe next tasks.
4. Separate product direction from implementation sequencing.
5. Mark each option as `Ready for decision`, `Needs more role input`, `Needs verification`, `Deferred`, or `Blocked by HumanGate`.
6. Recommend one small next task rather than a full roadmap.
7. Record any accepted strategy later in `decision-log.md`; do not use this role file as the final decision.

## Review Gate Stop Procedure

Review Gate should stop or redirect automation when a proposal:

- requires real env values, secrets, or service role keys;
- changes Supabase production DB or runs production SQL;
- weakens RLS or exposes private user data;
- charges money, changes billing, buys domains, or starts paid services;
- posts externally or launches publicly;
- makes medical, financial, or safety-sensitive claims without review;
- relies on AI output without an evaluation plan;
- merges code without `npm run verify`, branch sync, and conflict marker checks.

The stop action should be: do not execute, record the HumanGate item, and propose a safe docs-only or local-only alternative.

## PR, Verify, QA, And Repair Automation

The desired automated PR loop is:

1. Branch from latest `main`.
2. Make one small scoped change.
3. Run `npm run verify`.
4. If verification fails, classify the first actionable failure.
5. Apply safe fixes for imports, types, lint, build, simple UI bugs, docs drift, or conflict markers.
6. Re-run verification.
7. Run QA checks appropriate to the change: local smoke, browser flow, or preview check.
8. Sync with latest `main` before PR creation.
9. Create a draft PR with summary, verification, safety, and HumanGate status.
10. If CI or review fails, create a follow-up fix commit or safe fix PR.

This loop should remain draft-first until the project has reliable preview verification and clear merge-candidate rules.

## Vercel Failure Loop

When Vercel fails, automation should classify before fixing:

| Failure Class | Automation Response |
| --- | --- |
| Build/lint/type error | Fix if scoped and safe, then verify locally. |
| Runtime app error | Reproduce locally or in preview, then patch if safe. |
| Missing public env name | Document blocker; do not invent real values. |
| Billing or plan limit | HumanGate. |
| Platform outage or unknown | Record evidence and defer unsafe fixes. |
| Supabase preview mismatch | Route to Supabase diagnostics, not generic app bug fixing. |

## Supabase Preview Diagnostics

Supabase-related failures need their own branch of automation:

- Missing `NEXT_PUBLIC_*` names: config blocker, not code bug.
- Missing migrations in preview: schema drift, not product failure.
- RLS denies current user: check auth session, owner assignment, and policy predicates.
- RLS exposes cross-user data: High severity blocker; do not ship.
- Service role key appears necessary: HumanGate, stop.
- Production DB change appears necessary: HumanGate, stop.

Automation should prefer local/preview-only diagnostics and docs updates before any migration implementation.

## HumanGate Must Remain

These actions should never be fully automated:

- External public posting, SNS posting, or launch announcements.
- Billing, purchases, paid plans, domain purchases, or paid AI/service activation.
- Real env value entry or secret exposure.
- Service role key usage.
- Supabase production DB changes or production SQL execution.
- Production data deletion or table deletion.
- RLS weakening.
- Final public production launch.
- Medical or high-stakes recommendation claims without explicit human approval.

## Automation Timing

- Safe to automate now: task discovery proposals, council completeness checks, docs sync suggestions, PR readiness checks, verification loops, branch sync, conflict repair, local QA notes.
- Needs role council first: product direction selection, vertical prioritization, monetization direction, AI feature placement.
- Needs Supabase preview diagnostics: database-backed persistence, Auth-dependent flows, RLS tests, generated types.
- Needs AI evaluation harness: AI summaries, AI classification, chat-style decision assistance, recommendation ranking.
- Must remain HumanGate: billing, external posting, production DB actions, service role keys, RLS weakening, final launch.

## Automation Recommendation Draft

- Best fit for autonomous development: personal decision workspace or AI bookmark manager, with shopping/fashion/student templates as later verticals.
- Highest automation risk: hospital or medical-service comparison, because trust, privacy, claims, and ranking quality require stronger QA and Review Gate.
- Needed docs or workflow improvements: Automation v2 task scoring rubric, council synthesis checklist, PR readiness checklist, Vercel failure taxonomy, Supabase preview diagnostic matrix, AI evaluation rubric.
- Suggested next automation loop: after council role inputs are complete, run `RoleCouncilLoop` followed by `SynthesisLoop`; then create a docs-only Automation v2 plan before implementing new automation mechanics.
- Questions for Orchestrator / Review Gate: Which product direction can be reduced to one safe next task? Which HumanGate risks must be explicitly blocked in synthesis? Should Automation v2 be prioritized before AI summaries or Supabase-backed persistence?
