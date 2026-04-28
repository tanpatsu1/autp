# autp

URL Manager MVP built with Next.js, TypeScript, and Supabase.

## Stack

- Next.js App Router
- TypeScript
- Supabase JavaScript client
- Vercel deployment target

## Getting started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Environment variables

Copy `.env.example` to `.env.local` for local development and fill in values from Supabase. Do not commit secret values.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

For Vercel, configure these variables in the project environment settings.
