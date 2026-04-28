# Verification Loop

`VerificationLoop` proves changes before they are considered done.

## Standard Command

```bash
npm run verify
```

## Script Chain

`verify` should run:

1. `npm run lint`
2. `npm run typecheck`
3. `npm run build`

## Failure Handling

1. Read the first actionable error.
2. Auto-fix safe issues: imports, types, formatting, component bugs, accessibility warnings, responsive issues, ordinary build mistakes, and code-quality CI failures.
3. Re-run the failed command.
4. If the fix requires `HumanGate`, stop and record it in `docs/feedback-inbox.md`.
5. If local tooling is unavailable, record the blocker in `docs/review-log.md`.

## VercelPreviewCheck

When a Vercel preview exists:

1. Confirm deployment completed.
2. Open the preview URL.
3. Confirm the app loads.
4. Check obvious console/runtime errors when tooling is available.
5. Confirm no secret values are visible.
6. Record the result in `docs/review-log.md`.

## ReviewGateChecklist

- Scope matches the selected task.
- No URL-saving MVP was implemented during automation-foundation work.
- No real env values or secrets were written.
- No Supabase production DB changes were made.
- No external posts, paid actions, or final launch happened.
- Verification passed or the blocker is documented.
