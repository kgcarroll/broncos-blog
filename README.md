# Broncos News Blog

Unofficial Denver Broncos fan blog built with **Next.js**, **Sanity**, and **Vercel**.

## Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [Sanity](https://www.sanity.io/) CMS with embedded Studio at `/studio`
- [Tailwind CSS](https://tailwindcss.com/) ù Broncos orange (`#FB4F14`), navy (`#002244`), white

## Content model

| Type | Description |
|------|-------------|
| `news` | News posts (title, slug, date, excerpt, cover image, body) |
| `siteSettings` | Site title, tagline, optional logo |

## Local setup

### 1. Create a Sanity project

1. Go to [sanity.io/manage](https://www.sanity.io/manage) and create a project.
2. Use dataset `production`.
3. Under **API ? CORS origins**, add:
   - `http://localhost:3333`
   - Your Vercel preview URL (e.g. `https://your-app.vercel.app`)

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
NEXT_PUBLIC_SITE_URL=http://localhost:3333
```

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3333](http://localhost:3333). Manage content at [http://localhost:3333/studio](http://localhost:3333/studio).

### 4. First content

1. Open **Studio** ? create a **Site settings** document (title + tagline).
2. Create a **News** post and publish it.
3. View it on the home page and `/news`.

## Deploy to Vercel

1. Push this repo to GitHub (or deploy from CLI).
2. Import the project in [vercel.com](https://vercel.com).
3. Add the same environment variables; set `NEXT_PUBLIC_SITE_URL` to your production URL.
4. Deploy.
5. Add the production URL to Sanity **CORS origins**.

CLI (requires `vercel login` first):

```bash
npm install
npx vercel link
# Add env vars in the Vercel dashboard (or `vercel env add` for each key)
npx vercel env pull .env.local   # optional: sync from Vercel
npx vercel --prod
```

After deploy, add your production URL to Sanity **CORS origins** and set `NEXT_PUBLIC_SITE_URL` on Vercel to that URL.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

## Disclaimer

This is an unofficial fan site and is not affiliated with the NFL or the Denver Broncos.
