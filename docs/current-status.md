# Current Status

## Project

- Repository: `tanpatsu1/autp`
- Framework target: Next.js App Router
- Language: TypeScript
- Deploy target: Vercel
- Database/client target: Supabase

## Current setup

- Minimal Next.js application structure is present.
- Supabase browser client helper is present.
- Secret values are not committed.
- Local `.env.local` is intentionally not included.

## Required environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Next step

Configure the two Supabase environment variables in Vercel, then run a production build/deploy.
