# Shahzaib Iqbal — Portfolio

Next.js 14 · React · TypeScript · Tailwind · GSAP · Framer Motion. Single app, deploys to Vercel only.

## Run
```bash
npm install
cp .env.example .env.local   # fill in RESEND_API_KEY
npm run dev
npm run build                # verify before deploying
```

## Edit content
- Everything (bio, skills, projects, links) is in `src/data/site.ts`.
- Hero particle portrait: built from `public/images/portrait-density.png` (see `src/components/ParticleHero.tsx`). To use a new photo run `python scripts/make-density-map.py your-photo.png`.
- Project screenshots: `public/images/`.

## Deploy
Push to GitHub → import in Vercel → add the 3 env vars from `.env.example` → Deploy.
The contact form posts to `/api/contact` (Next.js Route Handler) which sends mail through Resend.
Until `RESEND_API_KEY` is set, the form shows a clear "not configured" error.
