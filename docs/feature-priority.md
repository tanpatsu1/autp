# Feature Priority

## Priority Rule

Prioritize features that make the current saved-link loop more durable, private, searchable, and decision-oriented. Defer features that require high trust, public surfaces, money, service role keys, production DB changes, or unsupported AI quality.

## P0: Must Happen Before Expansion

| Priority | Feature / Work | Why |
| --- | --- | --- |
| P0 | Vercel preview verification for current MVP | Confirms the existing app works outside local development. |
| P0 | Capture Friction Baseline Planning | Defines the minimum acceptable save experience before persistence hardens schema and UX assumptions. |
| P0 | URL-only fast-save baseline | Reduces the biggest save-time habit risk while keeping the first implementation small and private. |
| P0 | Supabase/Auth persistence | Required for real private saved collections and cross-device use. |
| P0 | RLS owner separation checks | Blocks cross-user data leakage. |
| P0 | Public env-name diagnostics only | Keeps secrets out of repo and avoids unsafe fixes. |
| P0 | Review Gate and `npm run verify` for every PR | Keeps automation safe and reversible. |

## P1: Core Product Utility

| Priority | Feature / Work | Why |
| --- | --- | --- |
| P1 | Category filter | Makes the existing category field useful for retrieval. |
| P1 | Tag filter | Makes user labels actionable without AI. |
| P1 | Favorite filter | Helps users shortlist important candidates. |
| P1 | Sort controls | Improves scanning across larger saved lists. |
| P1 | Empty/loading/error/no-results states | Makes the app understandable and testable. |
| P1 | Mobile capture polish | Users often save links when browsing on mobile. |

## P2: Decision Support

| Priority | Feature / Work | Why |
| --- | --- | --- |
| P2 | Decision status | Converts links into candidates: considering, shortlisted, decided, rejected. |
| P2 | Decision note | Captures why the link mattered or why a choice was made. |
| P2 | Pros/cons or next-check fields | Supports comparison without vertical lock-in. |
| P2 | Comparison-friendly card/list layout | Helps users evaluate options quickly. |

## P3: Automation v2

| Priority | Feature / Work | Why |
| --- | --- | --- |
| P3 | Task scoring rubric | Lets Codex pick safer, higher-value work. |
| P3 | Council synthesis checklist | Prevents strategy work from skipping role input. |
| P3 | PR readiness checklist | Reduces missed verification, docs drift, and branch-sync issues. |
| P3 | Vercel failure taxonomy | Separates app bugs from env, platform, and schema drift. |
| P3 | Supabase preview diagnostics | Prevents unsafe RLS weakening or service-role workarounds. |
| P3 | AI evaluation rubric | Prepares AI features before implementation. |

## P4: Templates

| Priority | Template | Why |
| --- | --- | --- |
| P4 | Shopping / purchase candidates | Clearest first wedge and strongest MVP extension. |
| P4 | Fashion / brand board | Important user idea with strong visual and repeat-use value. |
| P4 | Student research | Good secondary acquisition and organization use case. |
| P4 | SNS-found product/shop/info saver | Strong growth framing, but must avoid external posting. |
| P4 | Hospital / life information | Useful later, but sensitive and requires stronger privacy/copy review. |

## P5: AI Assistance

| Priority | AI Feature | Why |
| --- | --- | --- |
| P5 | User-triggered summaries | Useful once saved items persist and output storage exists. |
| P5 | Tag/category suggestions | Reduces organization effort while keeping user confirmation. |
| P5 | Similar-item grouping | Helps users compare candidates. |
| P5 | Comparison drafts | Strong fit for decision-board direction. |
| P5 | Chat-style retrieval | Powerful later, but depends on indexing, privacy, and eval quality. |

## Defer

| Feature | Reason |
| --- | --- |
| Public sharing / public collections | Privacy, abuse, launch, and HumanGate risk. |
| Billing / paid plans / affiliate activation | HumanGate and business-policy risk. |
| Automatic price tracking | Data reliability, scraping, and claim risk. |
| Automatic page scraping | Reliability, security, and prompt-injection risk. |
| iframe / embedded browsing | Many sites block embedding; security, privacy, terms, and broken-UX risks are too high for the MVP. |
| Bookmarklet / Web Share Target / Chrome extension implementation | Useful capture channels later, but they require persistence, auth, permission, privacy, and platform QA first. |
| Multi-user collaboration | Permissions and RLS complexity. |
| Hospital-specific recommendations | Medical-adjacent claim and trust risk. |
| AI automatic classification in background | Privacy, cost, and user-control risk. |
| Production DB changes from automation | Prohibited without human approval. |
