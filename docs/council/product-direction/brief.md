# Product Direction Council Brief

## Purpose

Create a docs-based council room where autp roles can discuss what service autp should become next. This setup does not choose a direction. Each role should write its own view in its assigned file, then Orchestrator can synthesize later in `synthesis.md`.

## Current Baseline

- autp currently has a URL Saving MVP direction.
- The MVP started as private manual URL saving with title, category, tags, memo, favorite, search, edit, delete, and card/list views.
- The current implementation is local-first until Supabase/Auth/persistence are safely verified.
- Supabase schema and RLS direction are documented, but production DB changes remain prohibited.
- Final public production launch remains `HumanConfirmationRequired`.

## Council Question

What should autp grow into after the current URL Saving MVP?

The council should compare directions such as fashion/brand management, hospital or appointment research, shopping decision support, student research, AI bookmark management, vertical-specific collections, and broader personal decision support.

## Discussion Themes

- How autp can expand value beyond basic URL saving.
- What direction many people would want to use.
- What use cases could spread easily or become shareable later.
- Which directions have monetization potential.
- How to compare fashion, brands, hospitals, shopping, students, AI bookmarks, and other verticals.
- When Supabase/Auth/persistent storage should become mandatory.
- Where AI summaries, AI classification, and ChatGPT-like assistance should fit.
- When Codex automation should become stronger.

## Evaluation Axes

Each role should evaluate proposals against:

- Ease of adoption.
- First-time clarity.
- Viral or shareable potential.
- Monetization potential.
- Implementation difficulty.
- Natural extension from the current MVP.
- Fit with AI features.
- Fit with autonomous development.
- Security and operational risk.
- Whether the user can make final decisions more easily.

## File Ownership

To reduce conflicts, each role edits only its own file:

| Role | File |
| --- | --- |
| Product | `product.md` |
| Growth / Marketing / Monetization | `growth.md` |
| Design / UX | `design.md` |
| Data Model | `data-model.md` |
| Implementation | `implementation.md` |
| QA / Risk | `qa.md` |
| Automation / Autonomous Development | `automation.md` |
| Review Gate | `review-gate.md` |
| Orchestrator | `synthesis.md` |

Do not edit another role file during a role pass. Do not use `current-status.md`, `task-board.md`, or `decision-log.md` for role arguments.

## Prohibited Actions

- No code implementation.
- No new feature addition.
- No real env values.
- No service role key use.
- No Supabase production DB changes.
- No production SQL execution.
- No RLS weakening.
- No billing, purchases, paid plan changes, or domain purchases.
- No external posting.
- No production launch.

## Short Role Instructions

Use this prompt for each role:

```text
Read docs/council/product-direction/brief.md and your assigned role file. Add your role's perspective only in your assigned file. Do not decide the final product direction, do not edit other role files, and do not propose prohibited actions as something Codex should execute now. Compare options using the council evaluation axes, name risks and tradeoffs, and leave decision-ready notes for later Orchestrator synthesis.
```

## Completion Rule

This council setup is complete when all role files exist with clear prompts and templates. The next phase is for each role to fill its own file. Final synthesis and product direction decision happen later.
