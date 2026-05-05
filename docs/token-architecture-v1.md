# Token Architecture v1

## Goal

Keep autp Codex work small enough to run repeatedly without 100k+ token sessions. This is an operating architecture, not only shorter prompts: Codex must classify the task before work, decide which docs are required, reject unnecessary full reads, choose Review Gate and QA scope by risk, and keep final reports short.

## 100k+ Token Cause Classification

| Cause | Pattern | Control |
| --- | --- | --- |
| Prompt | Long project brief pasted into every task. | Use `docs/short-prompt-templates.md` and task capsules. |
| Docs over-read | Reading all policy, status, logs, role, product, schema, and launch docs even for docs-only work. | Use `docs/context-intake-gate.md` first; read capsule, map, diff, and search results before full docs. |
| Skill over-read | Opening multiple full skill files for common operations. | Use only the skill that owns the task plus one support skill when needed. Do not read unrelated role skills. |
| Logs over-read | Full `docs/review-log.md` and `docs/decision-log.md` reads every run. | Search by task id, date, file, or domain; read only the matching entry plus nearby lines. |
| Review Gate | Full Review Gate performed for low-risk docs or mechanical changes. | Use `docs/review-gate-matrix.md`; skip dedicated Review Gate for low-risk changes, use lightweight Review Gate for high-risk. |
| QA | Full lint/typecheck/build/browser checks for docs-only or no-runtime tasks. | Use Token Budget Class QA scope; run `npm run pr-ready` and `npm run verify` only when policy or task scope requires it. |
| Command output | Large command output pasted or re-read repeatedly. | Prefer summary commands; capture first actionable error, changed-file list, and exit status. |
| Codex final report | Long narrative completion reports repeat known policy and file details. | Use Output Budget Rule: changed files, checks, risk, blockers, next. |

## Required Operating Sequence

1. Run the Context Intake Gate before reading long docs.
2. Assign one Token Budget Class.
3. Read only required docs and changed files.
4. Prefer task capsule, reading map, git diff, and targeted search over full-document loading.
5. Run `npm run pr-ready` before PR-bound Review Gate or PR creation.
6. Run QA according to the selected class.
7. Use the Review Gate Matrix to choose skip, lightweight, or full Review Gate.
8. Keep completion output within the Output Budget Rule.

## Token Budget Classes

| Class | Typical scope | Required docs | Review Gate | QA | Output |
| --- | --- | --- | --- | --- | --- |
| Tiny docs task | Typos, small docs clarifications, task-board row updates. | Capsule or map, changed file, policy only if safety scope changes. | Skip dedicated Review Gate; do embedded safety check. | `npm run pr-ready` only when PR-bound; `npm run verify` optional unless requested. | 5 bullets max. |
| Low-risk implementation | Small UI or TypeScript fix outside auth, env, Supabase, CI, or scripts. | Capsule/map, compact context, changed files. | Skip if `npm run pr-ready` is clean and diff is narrow; otherwise lightweight. | `npm run verify`. Browser check only if UI behavior changed. | 5 bullets max. |
| Medium-risk implementation | Routes, scripts, config, package files, automation behavior, or non-security shared behavior. | Capsule/map, compact context, task-specific docs, changed files. | Decide from `npm run pr-ready`; usually lightweight. | `npm run pr-ready` and `npm run verify`. Targeted browser/API check if behavior changed. | 7 bullets max. |
| High-risk Supabase/Auth/RLS | Supabase client, auth, RLS, SQL, migrations, env, security docs. | `docs/data-model.md`, `docs/supabase-schema.md`, `docs/rls-policy.md`, `docs/automation-policy.md`, changed files. | Lightweight Review Gate required; full Review Gate only with written reason. | `npm run pr-ready`, `npm run verify`, targeted tests/checks available locally. | 8 bullets max. |
| QA | Verification-only task. | QA capsule, verification loop, changed files, failing output. | Only if QA finds a material risk. | Run the requested check first, then one rerun after safe fix. | Results and blockers only. |
| Review Gate | Review-only task. | Review matrix, `npm run pr-ready` output, changed files, targeted docs. | The task itself. Full Review Gate requires reason. | Only run verify if needed to resolve a finding. | Findings first; no broad summary. |
| Conflict fix | Conflict markers, branch drift, merge repair. | Conflict capsule, conflicting files, pr-ready output. | Lightweight after markers are resolved. | `npm run pr-ready`, targeted check, `npm run verify`, `npm run pr-ready`. | Files, checks, residual risk. |

## Full Read Prohibition

Do not full-read these by default:

- `docs/review-log.md`
- `docs/decision-log.md`
- long product, schema, RLS, launch, growth, or runbook docs unrelated to the selected class
- all `.agents/skills/**/SKILL.md`
- full command logs after the first actionable failure is known

Full read is allowed only when the Context Intake Gate records the reason, such as unknown task type, missing capsule, conflict across decisions, or a high-risk domain change with no targeted entry.

## Output Budget Rule

Codex completion reports should default to:

- changed files
- checks
- risk
- blockers
- next

Do not repeat policy text, full task history, long command logs, or every doc consulted unless the user asks for it or a blocker requires exact reproduction.

## Success Criteria

Token Architecture v1 is working when a new Codex session can choose a task type, risk, required docs, optional docs, forbidden full reads, Review Gate level, QA scope, and expected output length before doing substantial reading or editing.
