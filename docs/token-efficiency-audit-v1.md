# Token Efficiency Audit v1

## Scope

Token Efficiency Audit v1 inventories repeated autp work from repo docs and proposes shorter prompts, narrower docs-reading maps, Skill candidates, and script candidates.

This is docs-only. It does not implement app features, add GitHub Actions, write env values, use service role keys, run production SQL, weaken RLS, charge money, post externally, or launch production.

## Sources Reviewed

- `AGENTS.md`
- `docs/compact-context.md`
- `docs/current-status.md`
- `docs/task-board.md`
- `docs/review-log.md`
- `docs/decision-log.md`
- `docs/automation-runbook.md`
- `docs/review-protocol.md`
- `docs/automation-policy.md`

## Signal Summary

The strongest repeated patterns are review, verification, Supabase/RLS safety, PR readiness, branch/conflict hygiene, Vercel checks, and next-task selection.

Approximate keyword hits across `docs/review-log.md`, `docs/decision-log.md`, and `docs/task-board.md` during this audit:

| Signal | Count | Interpretation |
| --- | ---: | --- |
| `PR` | 191 | PR readiness and branch work dominate the operating loop. |
| `Supabase` | 82 | Data and environment safety repeatedly drive task framing. |
| `RLS` | 70 | RLS review is a high-safety recurring concern. |
| `Verification` | 52 | Every meaningful change repeats check selection and logging. |
| `Review Gate` | 49 | Review Gate is repeated often enough to deserve a compact workflow. |
| `Vercel` | 31 | Preview and deployment checks need a focused template. |
| `Conflict` | 13 | Conflict repair is less frequent but high-friction when it appears. |
| `HumanGate` | 11 | Safety stop logic is stable and templateable. |
| `branch` / `sync` | 20 combined | Branch hygiene is repeated around PR creation and conflict repair. |

## Repeated Work Inventory

| Work type | Frequency | Token cost | Safety risk | Templateability | Scriptability | Main source of repetition | Current evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Review Gate for docs/code changes | High | High | Medium | High | Medium | Prompt-derived and Codex operation-derived | Review-log entries repeatedly restate scope, verification, safety, blockers, and next task. |
| QA / VerificationLoop | High | Medium | Medium | High | High | Automation gap | `npm run verify`, command chains, and blocker logging repeat in nearly every review-log entry. |
| Supabase/RLS review | High | High | High | High | Medium | Automation gap | Data model, schema, RLS, persistence, migration, env, and two-user verification concerns recur across logs and decisions. |
| PR readiness | High | Medium | Medium | High | Medium | Codex operation-derived | PR creation, branch sync, verify status, docs drift, and HumanGate checks repeat before every branch is ready. |
| Next task selection | Medium | Medium | Low | High | High | Prompt-derived | `TaskBoardLoop` repeats the same docs list and selection rules. |
| Conflict fix / branch hygiene | Medium | High | Medium | High | Medium | Automation gap | Branch start, Pre-PR sync, Pre-Merge sync, and conflict auto-fix are already documented but still verbose. |
| Vercel preview verification | Medium | Medium | Medium | High | Medium | Automation gap | Preview status, app load, console/runtime errors, and secret visibility checks repeat as follow-up QA. |
| HumanGate routing | Medium | Low | High | High | Medium | Prompt-derived | The forbidden-action list is repeated across policy, runbook, skills, and prompts. |
| gh fallback / GitHub CLI recovery | Low | Medium | Low | High | High | Codex operation-derived | PR creation needs a concise fallback when connector or inferred PR state is unavailable. |
| Shared docs updates | High | Medium | Low | High | Medium | Automation gap | `current-status`, `review-log`, `decision-log`, and `task-board` are conflict-prone and repeatedly updated. |
| Product direction council / role review | Medium | High | Medium | Medium | Low | Prompt-derived | Role-by-role proposals and review protocols are valuable but expensive when the task is narrow. |

## Repetition Source Classification

| Source | What it means | Current repeated behaviors | Best reduction lever |
| --- | --- | --- | --- |
| Prompt-derived | The user or runbook has to restate long context or rules. | Full AGENTS/docs lists, HumanGate list, TaskBoardLoop prompt, Review Gate checklist. | Short prompt templates plus task-specific docs-reading map. |
| Codex operation-derived | The agent repeatedly performs local git, verification, status, and PR steps manually. | Branch status checks, `npm run verify`, PR body creation, gh fallback, status summaries. | Script candidates and PR readiness checklist. |
| Automation gap | The project has policy but no single executable or Skill for a repeated workflow. | Supabase/RLS review, PR readiness, conflict repair, Vercel preview triage, docs drift checks. | New workflow Skills and small scripts. |

## Priority Workflow Findings

### Review Gate

- Problem: Review Gate entries repeat the same safety and verification language, often reading broad docs even for narrow docs-only changes.
- Reduction: Use a short prompt and read only changed files, `docs/automation-policy.md`, `docs/verification-loop.md`, `docs/review-log.md`, and task-specific docs.
- Skill candidate: `autp-pr-readiness-review` or an expanded `autp-review-gate` checklist focused on diff, policy, verify, docs drift, and HumanGate.
- Script candidate: `scripts/review_snapshot` that prints branch, changed files, latest review-log heading, and verification script status.

### QA / Verification

- Problem: Logs repeatedly describe the same verify command chain.
- Reduction: Use one template that records command, result, blocker, and next owner.
- Skill candidate: keep `autp-qa`, add a compact "verification-only" path.
- Script candidate: `npm run verify:summary` or `scripts/verify-summary` to run `npm run verify` and print a copy-paste-ready review-log row.

### Fix PR / PR Readiness

- Problem: PR readiness requires branch sync, diff review, docs drift checks, verification, PR title/body, and sometimes gh fallback.
- Reduction: Use a single PR readiness template with a no-secret safety list.
- Skill candidate: `autp-pr-readiness`.
- Script candidate: `scripts/pr-ready-check` to report branch, upstream, dirty status, changed files, verify status placeholder, and remote PR URL if `gh` is available.

### Conflict Fix

- Problem: Conflict repair requires repeated branch/sync rules and careful shared-doc decisions.
- Reduction: Keep the full policy in docs, but use a tiny conflict prompt for each repair.
- Skill candidate: `autp-conflict-fix`.
- Script candidate: `scripts/conflict-scan` to list conflicted files, conflict markers, and shared-doc files touched.

### Supabase/RLS Review

- Problem: Data safety requires repeated reminders about env values, service role keys, production SQL, owner scope, and RLS weakening.
- Reduction: Use a dedicated Supabase/RLS review template and a docs-reading slice that avoids unrelated product docs.
- Skill candidate: `autp-supabase-rls-review`.
- Script candidate: `scripts/rls-safety-scan` that checks migration files for `alter table ... disable row level security`, `service_role`, destructive statements, and missing policy keywords. This should be advisory only.

### Next Task Selection

- Problem: The long TaskBoardLoop prompt repeats many stable rules.
- Reduction: Use `TB short` prompt and `docs/docs-reading-map.md`.
- Skill candidate: consolidate into `autp-orchestrator` with task-type map.
- Script candidate: `scripts/next-task` to parse `docs/task-board.md` and print first safe Open task plus required docs.

### Vercel / Preview Verification

- Problem: Preview checks repeat deployment status, app load, console/runtime errors, secret visibility, and blocker logging.
- Reduction: Use a preview QA template with explicit non-goals and blocker format.
- Skill candidate: `autp-preview-qa`.
- Script candidate: `scripts/preview-checklist` that prints the manual checklist and target fields for review-log.

### gh Fallback

- Problem: When connector or PR discovery is uncertain, Codex repeats CLI checks and PR body setup.
- Reduction: Use a small fallback prompt and script.
- Skill candidate: include in `autp-pr-readiness`.
- Script candidate: `scripts/gh-pr-fallback` to run `gh auth status`, `gh repo view`, current branch, remote default branch, and print safe `gh pr create --draft` guidance. It must not push or create PRs by default.

## Recommended Next Token Reduction Tasks

1. Create `autp-pr-readiness` as the first workflow Skill. It should combine Review Gate, QA evidence, branch sync, docs drift, and gh fallback into one compact pre-PR flow.
2. Add `scripts/next-task` and `scripts/pr-ready-check` as read-only helpers. They should print summaries only and should not mutate git, env, Supabase, or GitHub state.
3. Create `autp-supabase-rls-review` after PR readiness. It should specialize existing data-model and review-gate guidance for migrations, env safety, owner scope, and two-user verification.
4. Add a `verify-summary` helper after the read-only scripts are proven. It can reduce review-log repetition by producing a standard verification note.
5. Revisit `docs/automation-runbook.md` only after the first Skill/script follow-up exists, replacing long prompts with references to `docs/short-prompt-templates.md` and `docs/docs-reading-map.md`.

## Review Gate Result

Pass with follow-up. The audit is docs-only, uses no real env values, does not alter production data or RLS, does not add GitHub Actions, and does not implement app features.
