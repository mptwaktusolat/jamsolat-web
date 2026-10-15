<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/66842dec-4ed1-4ad5-8280-0403cce3235f">
  <img alt="Screenshot JamSolat Light mode" src="https://github.com/user-attachments/assets/d25a549a-d65c-48a7-a686-0fd673d74491" />
</picture>

# JamSolat

JamSolat is a site to view Malaysia daily prayer times, built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).

## Getting Started

1. Clone repository
2. Install dependencies with `pnpm install`
3. Start dev server with `pnpm run dev`

## API

JamSolat uses Waktu Solat Malaysia API: https://api.waktusolat.app. The data is sourced from the official JAKIM e-Solat page.

## Deployment

Open http://localhost:54329.

The canonical deployment is at https://jamsolat.com (deployed on GitHub Pages).

I also deployed to Firebase at https://waktusolat.web.app and https://malaysia-waktu-solat.web.app because I had spare domains from previous projects that were not active. I would have released these domains if I could, but unfortunately, Firebase [doesn't allow](https://stackoverflow.com/questions/64901714/how-long-does-it-take-for-a-firebase-hosting-url-to-be-available-again-after-it) it.

Want to self host? Run the site with Docker:

```bash
docker run -d --restart unless-stopped -p 54329:54329 ghcr.io/mptwaktusolat/jamsolat-web:main
```
