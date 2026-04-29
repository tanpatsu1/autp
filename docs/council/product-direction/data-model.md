# Data Model Perspective

## Role Scope

Data Model evaluates product direction through data shape, ownership, privacy, Supabase/Auth timing, persistence needs, genre extensibility, and RLS risk. This council note is planning-only: no SQL, migration, code implementation, production DB change, service role key, env value, billing, public launch, or RLS weakening is proposed for execution now.

## Recommendation

autp should keep generic private URL management as the core data model, then add genre-specific behavior as optional templates layered on top of saved URLs. The current `saved_urls`, `categories`, `tags`, and `saved_url_tags` direction is a good base because every future direction still starts with "save this link, annotate why it matters, find it later, compare it with related links."

The next durable data step should be Supabase Auth plus reviewed persistence/RLS for the existing URL-saving model before adding vertical-specific tables. Without Auth/RLS, any serious data direction is only a local prototype; with Auth/RLS, autp can safely support private shopping, fashion, student research, and sensitive comparison workflows.

## Core Data Principle

Use a stable core plus optional extensions:

| Layer | Purpose | Timing |
| --- | --- | --- |
| Core URL record | URL, title, memo, favorite, category, tags, timestamps, owner | Already specified; make persistent next |
| User taxonomy | One category plus many tags per saved URL | Already specified; refine through usage |
| Genre template | Optional template label such as fashion, hospital, shopping, student, research | Add after persistence is stable |
| Template fields | Optional structured attributes for a genre | Add only for proven workflows |
| AI annotations | Summaries, classifications, extracted facts, confidence, provenance | Add after user-entered data and consent boundaries are clear |
| Sharing/monetization | Public/private visibility, teams, plans, audit fields | Defer until private single-user RLS is proven |

This avoids two traps: making every saved URL a generic blob that cannot be queried well, and creating rigid vertical schemas before autp knows which direction users actually need.

## Data Comparison

| Direction | New Data Needed | Auth / Persistence Need | RLS Risk | AI Data Need | Notes |
| --- | --- | --- | --- | --- | --- |
| AI bookmark manager | `ai_annotations`, source metadata, model/version, confidence, user acceptance state | Required before serious use because summaries become private derived data | Medium: AI output must inherit source row ownership | High: summary, labels, embeddings, provenance, regeneration history | Good long-term fit, but do not start with embeddings or automated classification before core persistence works |
| Shopping decision board | Price snapshot, desired price, merchant, purchase status, comparison notes | Required for cross-device decision making | Medium: purchase intent is private and potentially sensitive | Medium: comparison summaries and extracted price/spec facts | Strong fit with current memo/favorite/tag model; add structured fields only after users repeat the workflow |
| Fashion / brand manager | Brand, item type, size, color, season, candidate status, image/reference URL | Required if users track real wardrobes or purchase candidates | Medium: preferences and body/size data can be sensitive | Medium: style tags, brand grouping, outfit notes | Natural genre template; start as tags/category plus optional template fields, not a separate app schema |
| Hospital / service comparison | Provider name, location, specialty, appointment status, insurance/payment notes, visit notes | Required; Auth must come before meaningful testing | High: health-related notes are sensitive even if autp is not medical software | High-risk: AI summaries must avoid medical advice and preserve provenance | Data Model recommends defer until privacy, RLS tests, deletion/export, and policy copy are mature |
| Student research organizer | Course/project, source type, citation status, reading status, due date | Required for reliable study workflows | Low to Medium: mostly private academic data | Medium: source summaries, citations, extracted concepts | Good adoption fit; can be modeled as a template over saved URLs with low security complexity |
| Broader personal decision support | Decision, options, criteria, score, status, notes | Required once decisions span devices | Medium: decisions can reveal sensitive personal data | Medium: pros/cons extraction, comparison summaries | Promising abstraction, but should emerge from one or two concrete workflows rather than be modeled first |

## Category And Tag Roles

Keep categories and tags distinct:

| Concept | Data Role | Recommended Use |
| --- | --- | --- |
| Category | One broad user-owned grouping per saved URL | "shopping", "school", "fashion", "hospitals", "work" |
| Tag | Many flexible user-owned labels per saved URL | "urgent", "compare", "cheap", "brand:nike", "read-later" |
| Genre template | Optional app-recognized behavior bundle | Enables extra fields or UI for fashion, shopping, student research |
| AI label | Suggested tag/category with provenance | Never silently replaces user taxonomy; store accepted/rejected state later |

Do not overload category into a vertical product type too early. A user may have category "shopping" but still save a hospital billing link, or category "school" with fashion research. Tags should stay lightweight and user-editable. Genre templates should be opt-in when the UI needs structured fields beyond category/tag/memo.

## Genre Template Strategy

When the core Supabase model is stable, add a conservative template layer:

- `saved_urls.template_key`: optional app-known string such as `shopping`, `fashion`, `student_research`, or `provider_comparison`.
- `saved_url_attributes`: optional key/value attributes scoped to one saved URL and owner, used only for fields that are not yet worth first-class columns.
- Promote repeated, high-value attributes to typed columns or template-specific tables only after usage proves they need filtering, sorting, validation, or indexing.

This keeps the first vertical experiments cheap while leaving a path to stronger typed schemas later. It also plays nicely with RLS because every extension row can inherit ownership through the parent `saved_urls` row or carry the same `owner_id`.

## Supabase/Auth/Persistence Position

Supabase Auth and persistent storage should be the next data foundation before serious expansion:

- Local-first is fine for UI exploration and council discussion.
- Auth is required before users store real personal collections, shopping plans, health/service comparisons, or student research.
- RLS must be enabled before app access to persistent saved URL data.
- Each user-owned table should use immutable `owner_id` and policies equivalent to `owner_id = auth.uid()`.
- Shared or public features should not be added until private RLS, ownership tests, and deletion/export expectations are reviewed.

Supabase persistence should start with the already documented MVP schema, not with a vertical schema. The first goal is trust: a user can sign in, save private URLs, and know another user cannot read or modify them.

## AI Data Requirements

Future AI features should be stored as derived annotations, not mixed into the user's source fields:

| Data | Why It Is Needed |
| --- | --- |
| Source row id | Links AI output back to the saved URL it describes |
| `owner_id` | Keeps AI output under the same RLS boundary as source data |
| Annotation type | Summary, classification, extracted facts, comparison, embedding reference |
| Model/provider/version | Enables debugging and future regeneration |
| Prompt/config version | Helps explain why output changed |
| Output text or structured JSON | Stores the generated value |
| Confidence/status | Distinguishes draft, accepted, rejected, stale, failed |
| Provenance timestamps | Supports review, refresh, and audit |

Do not add embeddings, auto-classification, or background scraping as part of the next schema step. They add cost, privacy, and review complexity. First add user-owned persistence; later add AI annotations with explicit user consent and clear provenance.

## Sharing And Monetization Cautions

Sharing and monetization are data-model multipliers:

- Sharing requires visibility states, collection ownership, invite/role tables, audit records, and RLS that distinguishes owner, collaborator, public reader, and anonymous user.
- Monetization requires account/subscription linkage, entitlements, quota tracking, webhook reliability, and plan-specific limits.
- Public collections require abuse controls, takedown/moderation states, and careful separation between private notes and public fields.
- Any paid plan, billing change, public launch, or external posting remains HumanConfirmationRequired.

Data Model recommends deferring these until private single-user persistence and RLS are proven in production-like preview checks.

## Designs To Avoid Now

Avoid these in the near term:

- A separate table per possible genre before usage proves demand.
- A single untyped JSON blob for all metadata with no owner, indexes, or validation path.
- Global categories or tags shared across users.
- Public visibility columns before private RLS is verified.
- AI-generated labels that overwrite user categories/tags.
- Storing medical, financial, or payment details without a specific privacy review.
- Service role access from the client or automation.
- Any schema that needs production DB changes before migration review.

## Implementation Handoff Assumptions

Implementation should assume:

- The immediate persistent model remains private, user-owned URL saving.
- Supabase Auth/RLS should precede serious multi-device persistence.
- `owner_id` is mandatory on user-owned data and immutable after insert.
- Category is one broad grouping; tags are many flexible labels.
- Card/list view remains UI preference until there is a reviewed reason to persist it.
- Genre-specific fields should be optional and layered, not required for every saved URL.
- AI output should be stored separately from user-entered source fields.
- Cross-user sharing, public pages, billing, and production launch are later gated work.

## Final Data Model Position

The safest product direction is "private saved links that can become structured decision boards." It keeps the current MVP as the foundation, supports fashion/shopping/student workflows naturally, leaves room for AI assistance, and does not force autp into a high-risk hospital/medical or monetized sharing model before RLS, persistence, and trust are proven.
