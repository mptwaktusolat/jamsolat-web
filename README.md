<img width="2288" height="1285" alt="Github hero jamsolat" src="https://github.com/user-attachments/assets/7458c7c7-a7e0-462c-a7be-5c9ad95109e4" />

# JamSolat

JamSolat is a site to view Malaysia daily prayer times, built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).

## Getting Started

1. Clone repository
2. Install dependencies with `pnpm install`
3. Start dev server with `pnpm run dev`

Or quickly run with Docker compose:

```bash
docker compose -f compose.debug.yaml up
```

## API

JamSolat uses Waktu Solat Malaysia API: https://api.waktusolat.app. The data is sourced from the official JAKIM e-Solat page.
