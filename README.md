<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/6afe9d7b-ed03-4891-929a-28920179457c">
  <img alt="Screenshot JamSolat Light mode" src="https://github.com/user-attachments/assets/e9734061-7293-4586-83e9-cc5ab8b2b23b" />
</picture>

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
