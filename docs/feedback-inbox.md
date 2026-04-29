# Feedback Inbox

Use this file for `HumanGate` items and unresolved product decisions.

## HumanConfirmationQueue

| Date | Area | Requested Action | Why Human Confirmation Is Required | Recommended Choice | Risk If Approved | Risk If Rejected |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-04-30 | Supabase Persistence | Provide real Supabase public env values in the appropriate local/preview/Vercel environment and approve applying the reviewed migration draft outside production automation | Real environment values must not be written to the repo, and production DB changes are HumanConfirmationRequired; automation did not run SQL or expose secrets | Use a safe local or preview Supabase project first; apply `supabase/migrations/20260430000000_url_saving_persistence.sql` only after review, then run two-user RLS QA | A wrong environment or unreviewed migration could expose private data or affect production schema | Supabase-backed cross-device persistence and RLS verification remain blocked; local demo mode continues |
|  |  |  |  |  |  |  |

## UntriagedFeedback

| Date | Source | Feedback | Suggested Destination |
| --- | --- | --- | --- |
|  |  |  |  |

## Resolved

| Date | Item | Resolution | Related Log |
| --- | --- | --- | --- |
|  |  |  |  |

## Intake Rule

Add items here when they involve SNS, external posting, billing, purchases, paid plans, domains, secrets, real env values, service role keys, production data deletion, DB table deletion, weaker RLS, or final public launch.
