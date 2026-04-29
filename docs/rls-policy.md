# RLS Policy Proposal: URL Saving MVP

## Scope

This document defines the RLS posture for the private URL-saving MVP. It is a proposal only: no SQL policy is created here and no Supabase project is changed.

## Security Goal

Every user-owned row must be readable and writable only by its owner. Anonymous users should not read or write URL-saving data. Service role keys must not be used by the app or automation.

## Auth Assumptions

- Supabase Auth is the identity source.
- Client queries use the public anon/publishable key with the signed-in user's session.
- User ownership is represented by `owner_id`.
- Policy predicates should compare `owner_id` with `auth.uid()`.
- Inserts should ensure new rows are owned by the current authenticated user.

## Table Policy Matrix

### `saved_urls`

| Operation | Proposed Rule |
| --- | --- |
| Select | Allow only when `owner_id = auth.uid()` |
| Insert | Allow only when authenticated and inserted `owner_id = auth.uid()` |
| Update | Allow only when existing row `owner_id = auth.uid()` and resulting row still has `owner_id = auth.uid()` |
| Delete | If user-owned delete is implemented later, allow only when `owner_id = auth.uid()` |

Delete behavior is product/implementation scope, not a production data deletion permission. It applies only to the authenticated user's own rows and remains subject to Review Gate before implementation.

### `categories`

| Operation | Proposed Rule |
| --- | --- |
| Select | Allow only when `owner_id = auth.uid()` |
| Insert | Allow only when authenticated and inserted `owner_id = auth.uid()` |
| Update | Allow only when existing row `owner_id = auth.uid()` and resulting row still has `owner_id = auth.uid()` |
| Delete | Defer until category-management behavior is approved; if allowed, only `owner_id = auth.uid()` |

Saved URLs must not be assigned to categories owned by another user. Enforce through constraints, triggers, or checked write paths before app release.

### `tags`

| Operation | Proposed Rule |
| --- | --- |
| Select | Allow only when `owner_id = auth.uid()` |
| Insert | Allow only when authenticated and inserted `owner_id = auth.uid()` |
| Update | Allow only when existing row `owner_id = auth.uid()` and resulting row still has `owner_id = auth.uid()` |
| Delete | Defer until tag-management behavior is approved; if allowed, only `owner_id = auth.uid()` |

### `saved_url_tags`

| Operation | Proposed Rule |
| --- | --- |
| Select | Allow only when the linked saved URL is owned by `auth.uid()` |
| Insert | Allow only when both linked saved URL and linked tag are owned by `auth.uid()` |
| Update | No update needed for MVP; replace links by deleting and inserting owned links |
| Delete | Allow only when the linked saved URL is owned by `auth.uid()` |

The join table must prevent cross-user links. A user must never be able to connect their saved URL to another user's tag, or another user's saved URL to their tag.

## Ownership Invariants

| Invariant | Why It Matters |
| --- | --- |
| `owner_id` is required on every user-owned table | Enables simple RLS predicates |
| `owner_id` is immutable after insert | Prevents record transfer or ownership spoofing |
| Category and tag labels are unique per user, not globally | Prevents cross-user leakage and naming conflicts |
| Join rows require same-owner saved URL and tag | Prevents cross-user relationship leaks |
| App queries still pass explicit owner filters where practical | Makes intent clear and helps review, while RLS remains the hard boundary |

## RLS Test Cases For QA And Review Gate

| Case | Expected Result |
| --- | --- |
| Signed-out user selects `saved_urls` | No rows and no private data |
| User A inserts a saved URL with User A `owner_id` | Success |
| User A inserts a saved URL with User B `owner_id` | Denied |
| User A selects User B saved URLs | Denied/no rows |
| User A updates User B saved URL | Denied |
| User A changes `owner_id` on own saved URL to User B | Denied |
| User A links own URL to own tag | Success |
| User A links own URL to User B tag | Denied |
| User A searches by a keyword matching User B data | User B data remains invisible |
| User A deletes own saved URL if delete is implemented | Only User A row and related join rows are removed |

## Review Gate Checks

Before Implementation closes the first URL-saving PR, Review Gate should confirm:

- RLS is enabled on every MVP table before app access is merged;
- policies preserve or strengthen the rules in this document;
- no service role key is used;
- no real env values are committed;
- no production DB is modified by automation;
- no policy permits anonymous access to private URL data;
- no policy permits cross-user category/tag/join access;
- search queries cannot return another user's rows;
- delete behavior, if included, only affects the authenticated user's own rows.

## Rollback And Failure Notes

If preview schema or policy setup fails later:

- do not weaken RLS to make the UI work;
- diagnose missing migrations, preview drift, missing public env names, or auth-session issues separately;
- disable or hide the feature path in preview if necessary rather than exposing private data;
- record blockers in `docs/review-log.md` and HumanGate items in `docs/feedback-inbox.md`;
- do not use service role keys or production DB changes as an automation workaround.

## Implementation Handoff

Implementation may convert this proposal into migrations and tests in `NEXT-003` after review. The first implementation should include owner-scoped Supabase queries and at least manual or automated checks for the RLS test cases above.

