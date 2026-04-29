# Data Model Perspective

## Role Scope

Data Model should evaluate data shape, ownership, privacy, Supabase/Auth timing, persistence needs, and RLS risk for each direction. Do not write SQL migrations, run SQL, change production DB, use service role keys, or weaken RLS.

## Questions To Answer

- Which directions fit the current saved URL, category, tag, memo, favorite model?
- Which directions require new entities, relationships, or permissions?
- When does Supabase/Auth become required rather than optional?
- Which AI features would require storing summaries, classifications, embeddings, or user decisions?
- Which directions create privacy, medical, financial, or sensitive-data risk?

## Data Comparison

| Direction | New Data Needed | Auth / Persistence Need | RLS Risk | AI Data Need | Notes |
| --- | --- | --- | --- | --- | --- |
| AI bookmark manager |  |  |  |  |  |
| Shopping decision board |  |  |  |  |  |
| Fashion / brand manager |  |  |  |  |  |
| Hospital / service comparison |  |  |  |  |  |
| Student research organizer |  |  |  |  |  |
| Other |  |  |  |  |  |

## Supabase / Auth Timing

- Can remain local-first for exploration:
- Requires Supabase before serious use:
- Requires Auth before user testing:
- Requires reviewed migrations before release:
- Requires extra RLS review:

## Data Model Recommendation Draft

- Lowest-risk direction:
- Highest data complexity:
- Best fit with current schema:
- AI storage concerns:
- Questions for Implementation / Review Gate:
