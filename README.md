This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Supabase Configuration (Admin operations with service role)
NEXT_PUBLIC_SUPABASE_URL=https://wzgpgpkuozdebkwwinhb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Z3BncGt1b3pkZWJrd3dpbmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTc3MTcsImV4cCI6MjA3NjIzMzcxN30.zdoWvhHY2ABC5TyT8DAj0CXplMIq0KXMAacoN22-6vs
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Z3BncGt1b3pkZWJrd3dpbmhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDY1NzcxNywiZXhwIjoyMDc2MjMzNzE3fQ.ePD794Bm9kzQpswyc9_5f9kijN7IL2qXDzxsdSaFhBQ

# Admin Auth
JWT_SECRET=your_random_secret_key_here_min_32_chars
SESSION_COOKIE_NAME=admin_session

NEXT_PUBLIC_MAIN_APP_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001





////////
# Supabase Configuration (Public operations only)
NEXT_PUBLIC_SUPABASE_URL=https://wzgpgpkuozdebkwwinhb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Z3BncGt1b3pkZWJrd3dpbmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTc3MTcsImV4cCI6MjA3NjIzMzcxN30.zdoWvhHY2ABC5TyT8DAj0CXplMIq0KXMAacoN22-6vs
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Z3BncGt1b3pkZWJrd3dpbmhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDY1NzcxNywiZXhwIjoyMDc2MjMzNzE3fQ.ePD794Bm9kzQpswyc9_5f9kijN7IL2qXDzxsdSaFhBQ

# Email Configuration
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password_here

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
