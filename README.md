# PotentialFitness Monorepo

This repo contains the marketing site and the performance console, served by a
single Express backend.

## Structure

- `apps/marketing` - marketing/landing site
- `apps/personal-trainer-app` - Express API + console frontend

## Run locally

From the repo root:

```bash
npm install --prefix apps/personal-trainer-app
npm run dev
```

Then open:

- `http://localhost:3000/` for the marketing site
- `http://localhost:3000/app` for the console
