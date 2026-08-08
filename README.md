# VousTech Website

Next.js 16 (App Router) marketing site for VousTech — bilingual (English/French), light/dark theme, 27 service pages, and a Resend-backed contact form.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/en`.

## Before launch — required TODOs

Everything below is a clearly-marked placeholder so the site runs and builds today, but these need real values before it goes live:

| What | Where | Notes |
|---|---|---|
| Resend API key | `.env.local` → `RESEND_API_KEY` | Get one at [resend.com](https://resend.com). Without it, the contact form fails gracefully (shows the "server error" message) instead of crashing. |
| Contact inbox email | `.env.local` → `CONTACT_INBOX_EMAIL` | Where leads land. |
| Sending address | `.env.local` → `CONTACT_FROM_EMAIL` | Must be on a domain verified in your Resend account. |
| Production domain | `.env.local` → `NEXT_PUBLIC_SITE_URL` | Used in canonical URLs, sitemap, OG tags, JSON-LD. |
| WhatsApp number | `src/lib/site.config.ts` → `whatsappNumber` | Powers the floating badge and the contact page's WhatsApp button. |
| Social profile URLs | `src/lib/site.config.ts` → `social` | LinkedIn, Facebook, Instagram, X. |
| Client/partner logos | `src/components/sections/TrustedByMarquee.tsx` | Currently placeholder chips — swap in real logo images. |
| Portfolio case studies | `src/messages/en.json` & `fr.json` → `portfolio.items` | Currently 6 sample/placeholder entries. |
| Blog posts | `src/messages/en.json` & `fr.json` → `blog.posts` | Ships with 3 general-interest posts; add real ones the same way. |
| Legal page copy | `src/messages/en.json` & `fr.json` → `legal.*` | Standard boilerplate — have counsel review before launch. |

Everything else (colors, copy, all 27 services, FAQs, testimonials, SEO metadata) is final content from the brief, in both languages.

## Stack

Next.js 16 · TypeScript · Tailwind CSS v4 · next-intl (i18n) · next-themes (light/dark) · Resend + Zod (contact form) · no animation library — motion is plain CSS + a couple of small hooks, on purpose, to keep the JS payload light.

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build (statically generates every locale × route)
- `npm run start` — serve the production build
- `npm run lint` — ESLint
