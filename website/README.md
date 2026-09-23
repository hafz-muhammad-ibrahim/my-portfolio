# Muhammad Ibrahim — Portfolio

A one-page developer portfolio built with **Next.js (App Router) + TypeScript + Tailwind CSS**.
Dark, minimal, project-first — designed to be scannable in seconds by a technical reviewer.

## Run locally

Requires Node.js 18.18+.

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Edit your content

Almost everything lives in one file: **`lib/content.ts`**
(profile, stats, experience, projects, skills). Change the text there and the
whole site updates — you rarely need to touch the components.

## Build

```bash
npm run build
npm start
```

## Deploy to Vercel (free, recommended)

Vercel is made by the Next.js team; deploying is a few clicks and needs no card.

1. Push this folder to a GitHub repo (e.g. `ibrahim-portfolio`).
2. Go to https://vercel.com → **Add New… → Project** → sign in with GitHub.
3. Import the repo. Vercel auto-detects Next.js — just press **Deploy**.
4. You get a live URL like `https://ibrahim-portfolio.vercel.app`.
5. (Optional) Add a custom domain later in Project → Settings → Domains.

Every future `git push` to `main` auto-deploys.

## Stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS 3. Fonts (Space Grotesk,
Inter, JetBrains Mono) load from Google Fonts at runtime — no build-time fetch.
