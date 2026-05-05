# PR Readiness Check

`npm run pr-ready` runs a short, read-only readiness check before PR creation and before Review Gate.

## What It Checks

- Current git branch and changed files.
- Git status summary.
- Conflict markers: `<<<<<<<`, `=======`, `>>>>>>>`.
- Secret-like assignments, JWT-like values, env real values, and service role key-like values.
- Unsafe file changes such as real `.env` files or private key files.
- High-risk change areas such as Supabase, Auth, RLS, env, migration, SQL, policy, and security files.
- Whether Review Gate is required.

## Read-only Rule

The script only reads git status and file contents. It must not write files, change git state, run SQL, change DB state, read or write real env values, call external services, create commits, push branches, or create PRs.

## When To Run

Run it:

```bash
npm run pr-ready
```

Use it after a task's files are edited and before Review Gate or PR creation. Run it again after fixing blockers.

## How To Read Output

- `Risk: High` means Review Gate should inspect the change carefully before PR readiness is claimed.
- `Risk: Medium` means non-doc code, scripts, config, or package files changed, but no blocker was detected.
- `Risk: Low` means no changed files or only small docs-style changes were detected.
- `Blockers` lists issues that must be fixed before PR readiness.
- `Short Summary` can be pasted into a PR body or the next Codex instruction.

Exit codes:

- `0`: no clear blocker detected.
- `1`: conflict marker, secret suspicion, unsafe file change, or similar blocker detected.

## Review Gate Required

Review Gate is required when changed files exist. It is especially important when output mentions:

- High-risk Supabase, Auth, RLS, env, migration, SQL, policy, or security files.
- Any blocker.
- App, script, package, config, or workflow-adjacent changes.
- Docs that change automation behavior, launch posture, security posture, or task routing.

## Risk Examples

High:

- `lib/supabase/client.ts`
- `supabase/migrations/*.sql`
- `docs/rls-policy.md`
- `.env.local`
- `vercel.json`
- auth, RLS, security, migration, or SQL files

Medium:

- `app/page.tsx`
- `scripts/pr-ready-check.mjs`
- `package.json`
- `next.config.mjs`

Low:

- Small docs-only updates in `docs/*.md`
- `README.md`
- No changed files

## Relationship To `npm run verify`

`npm run pr-ready` does not run `npm run verify`. It only tells Codex whether readiness blockers are visible and which command should be run next.

For code, config, script, package, security, or risky docs changes, run:

```bash
npm run verify
```

If verification cannot run, record the exact blocker in `docs/review-log.md`.

## Codex Short Prompts

PR readiness only:

```text
Run PR readiness for autp. Use npm run pr-ready, summarize blockers, risk, Review Gate need, and the next verification command. Do not commit, push, create a PR, or run npm run verify unless I ask.
```

Before Review Gate:

```text
Run pre-Review Gate readiness for autp. Use npm run pr-ready first, then Review Gate the changed files if no blockers are found. If blockers exist, report them and stop before PR creation.
```
