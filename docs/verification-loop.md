# Verification Loop

Use this loop after every implementation batch, CI fix, design change, or risky docs change. For docs-only changes, record that verification was not run and why.

## Local Commands

Run these when available:

```bash
npm run lint
npm run typecheck
npm run build
```

If a `verify` script exists, prefer:

```bash
npm run verify
```

## Failure Handling

1. Read the first actionable error.
2. Fix safe issues automatically: imports, types, formatting, component bugs, accessibility warnings, responsive issues, and ordinary build mistakes.
3. Re-run the failed command.
4. If the fix would require human confirmation, stop and add it to `docs/feedback-inbox.md`.
5. If local tooling is missing, record the exact blocker in `docs/review-log.md`.

## Vercel Check

When a Vercel preview is available:

1. Confirm the deployment completed.
2. Open the preview URL.
3. Check that the app loads.
4. Check browser console errors when tooling is available.
5. Confirm no secret values are visible.
6. Record the preview result in `docs/review-log.md`.

## Review Gate

Before marking a task Done:

- Scope matches the task.
- No app feature was added during docs-only work.
- No real env values or secrets were written.
- No production DB changes were made.
- No external posts or paid actions happened.
- Verification passed, or the blocker is documented.
