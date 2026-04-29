# Supabase Schema Proposal: URL Saving MVP

## Scope

This is a non-destructive Supabase schema proposal for `NEXT-002` and the `NEXT-010` persistence implementation. The reviewed migration draft is stored at `supabase/migrations/20260430000000_url_saving_persistence.sql`, but automation did not run it against any Supabase project. Production database changes, real environment values, service role keys, table deletion, and weaker RLS remain prohibited.

## Proposed Tables

### `public.saved_urls`

| Column | Type | Required | Default | Constraints / Notes |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | Yes | Database-generated UUID | Primary key |
| `owner_id` | `uuid` | Yes | Current authenticated user | References `auth.users.id`; immutable after insert |
| `url` | `text` | Yes | None | Trimmed non-empty URL; app validates valid URL before insert |
| `display_url` | `text` | No | `null` | Optional original display value |
| `title` | `text` | Yes | App-provided URL fallback | App should provide URL-derived title if user leaves blank |
| `category_id` | `uuid` | No | `null` | References `public.categories.id`; must belong to same owner |
| `memo` | `text` | No | `null` | Private user note |
| `is_favorite` | `boolean` | Yes | `false` | Favorite marker |
| `capture_source` | `text` | Yes | `manual_form` | Initial save pathway; later reviewed values can support `fast_save`, `bookmarklet`, `web_share`, `extension`, or `import` |
| `organization_state` | `text` | Yes | `needs_review` | Explicit organize-later state for URL-only saves; allowed values are `needs_review` and `organized` |
| `created_at` | `timestamptz` | Yes | Current timestamp | Set by database |
| `updated_at` | `timestamptz` | Yes | Current timestamp | Updated by trigger or app-side update path |

Recommended constraints:

- `url` is not empty after trimming.
- `title` is not empty after trimming.
- `owner_id` is set to the authenticated user on insert and cannot be changed by client updates.
- `category_id`, when present, must refer to a category with the same `owner_id`.

### `public.categories`

| Column | Type | Required | Default | Constraints / Notes |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | Yes | Database-generated UUID | Primary key |
| `owner_id` | `uuid` | Yes | Current authenticated user | References `auth.users.id`; immutable after insert |
| `name` | `text` | Yes | None | Trimmed user label |
| `normalized_name` | `text` | Yes | Derived from `name` | Lowercase/trimmed uniqueness key |
| `created_at` | `timestamptz` | Yes | Current timestamp | Set by database |
| `updated_at` | `timestamptz` | Yes | Current timestamp | Rename timestamp |

Recommended constraints:

- `name` is not empty after trimming.
- Unique pair: `owner_id`, `normalized_name`.

### `public.tags`

| Column | Type | Required | Default | Constraints / Notes |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | Yes | Database-generated UUID | Primary key |
| `owner_id` | `uuid` | Yes | Current authenticated user | References `auth.users.id`; immutable after insert |
| `name` | `text` | Yes | None | Trimmed user label |
| `normalized_name` | `text` | Yes | Derived from `name` | Lowercase/trimmed uniqueness key |
| `created_at` | `timestamptz` | Yes | Current timestamp | Set by database |
| `updated_at` | `timestamptz` | Yes | Current timestamp | Rename timestamp |

Recommended constraints:

- `name` is not empty after trimming.
- Unique pair: `owner_id`, `normalized_name`.

### `public.saved_url_tags`

| Column | Type | Required | Default | Constraints / Notes |
| --- | --- | --- | --- | --- |
| `owner_id` | `uuid` | Yes | Current authenticated user | Included in the migration draft to make owner-scoped RLS and same-owner composite foreign keys explicit |
| `saved_url_id` | `uuid` | Yes | None | References `public.saved_urls.id` |
| `tag_id` | `uuid` | Yes | None | References `public.tags.id` |
| `created_at` | `timestamptz` | Yes | Current timestamp | Link timestamp |

Recommended constraints:

- Primary key: `saved_url_id`, `tag_id`.
- A link is valid only when the saved URL owner and tag owner are the same authenticated user.
- The migration draft enforces this with composite `(id, owner_id)` references from `saved_url_tags` to both `saved_urls` and `tags`.
- Deleting a saved URL may cascade to its join rows after Implementation and Review Gate confirm user-owned delete behavior.
- Deleting a tag may remove only its join rows after Implementation and Review Gate confirm tag-management behavior.

## Deferred Table

### `public.user_preferences`

Do not add for the MVP unless persistent display preference is explicitly approved. Card/list view can be local UI state.

If later approved, proposed fields are:

| Column | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `owner_id` | `uuid` | Yes | Current authenticated user | Primary key and Auth owner |
| `default_saved_url_view` | `text` | Yes | `list` | Allowed values: `list`, `card` |
| `created_at` | `timestamptz` | Yes | Current timestamp | Set by database |
| `updated_at` | `timestamptz` | Yes | Current timestamp | Preference update timestamp |

## Index Plan

| Index Target | Purpose | Priority |
| --- | --- | --- |
| `saved_urls(owner_id, updated_at desc)` | Default private list query | Required |
| `saved_urls(owner_id, created_at desc)` | Stable fallback sort | Required |
| `saved_urls(owner_id, is_favorite, updated_at desc)` | Favorite filtering and sorting | Useful for MVP |
| `saved_urls(owner_id, category_id)` | Category filtering | Required |
| `categories(owner_id, normalized_name)` | Reuse existing category labels | Required unique |
| `tags(owner_id, normalized_name)` | Reuse existing tag labels | Required unique |
| `saved_url_tags(saved_url_id)` | Fetch tags for saved URLs | Required |
| `saved_url_tags(tag_id)` | Filter URLs by tag | Required |
| Text search over URL/title/memo/category/tag | Keyword search | Start simple; add search view or generated vector later if needed |

## Query Shapes

### Default List

Fetch saved URLs for `auth.uid()` ordered by `updated_at desc, created_at desc`, including category and tag labels. RLS should make explicit owner filters a second layer of clarity, not the only protection.

### URL-Only Save Readiness

The persistence path can insert a valid private row with URL, authenticated owner, fallback title, `capture_source = manual_form`, `organization_state = needs_review`, default favorite, nullable category, zero tag links, nullable memo, and database timestamps. Later fast-save work can reuse the same table by changing only the reviewed `capture_source` value and UI/API entry point.

### Search

For MVP, use a simple keyword strategy:

- match `url`, `display_url`, `title`, and `memo` with case-insensitive contains;
- include category name matches through `categories`;
- include tag name matches through `tags` and `saved_url_tags`;
- always scope to the current authenticated user.

If query composition becomes too complex, Implementation may propose a read-only search view that exposes only owner-scoped saved URL rows. That proposal must keep RLS equivalent or stronger.

### Card/List Display

Use the same query result for both display modes. The UI changes presentation only and does not require a schema field.

## Migration Safety Notes

Future migration drafting should be non-destructive:

- create new tables before any app queries depend on them;
- enable RLS before exposing app access;
- create owner-scoped policies before merging feature code;
- avoid table drops or production data deletion;
- keep rollback notes limited to disabling the feature path or reverting unreleased migrations in preview/local environments;
- do not run migrations against production from automation.
- review `supabase/migrations/20260430000000_url_saving_persistence.sql` before applying it to local or preview Supabase.

## Supabase Preview Diagnostics

Future automation should classify Supabase-related failures as:

| Failure Type | Diagnostic Direction |
| --- | --- |
| Missing public env names | Record as preview/config issue; do not write real values |
| RLS denial for current user | Check auth session, `owner_id`, and policy predicates |
| RLS permits cross-user rows | Treat as high-severity Review Gate blocker |
| Migration not applied in preview | Classify as preview schema drift, not app bug |
| Service role needed | Stop; service role key use is HumanConfirmationRequired |
| Production DB change requested | Stop; production DB changes are out of scope for automation |

## Implementation Handoff

Implementation should create reviewed migrations later from this proposal, then generate or update Supabase TypeScript types. It should not implement SQL in `NEXT-002`, should not touch production DB, and should keep the first app PR small enough to verify save, list, edit, favorite, search, and card/list flows.

