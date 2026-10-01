# Mockit

Generate realistic, internally consistent **Canadian** mock people for testing: names, date of birth, email, phone, a Luhn-valid SIN, a real address, employment and financials. One at a time, or in bulk with CSV/JSON export.

Runs entirely in the browser. Nothing is sent to a server.

## What's generated

| Field | How |
|---|---|
| Name | Faker; Quebec residents mostly get French names |
| SIN | Luhn-valid; first digit matches the province |
| Phone | Area code from the person's province; local number in the fictional `555-01XX` range |
| Email | Derived from the name, on reserved `example.com/.net/.org` domains |
| Address | Real residential addresses sampled from StatCan's National Address Register |
| Employment | Status by age, NAICS industry, matching job title, income scaled by industry and age |
| Financials | Liquid/fixed assets, mortgage and other debts, correlated with age, income and province |

## Development

Requires Node 22.

```sh
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest
npm run lint       # Biome
npm run build      # type-check + production build to dist/
```

Stack: React 19, Vite, TypeScript, Tailwind v4, shadcn/ui, Faker, Vitest, Biome. Deployed on Netlify (`netlify.toml`).

Generators live in `src/lib/generators/` as pure TypeScript with no React, seeded for reproducibility.

## Refreshing address data

`public/addresses/{PROVINCE}.json` is committed, so this step is only needed to pull a newer release.

1. Download the latest NAR zip (~1.7 GB) from the [National Address Register page](https://www150.statcan.gc.ca/n1/pub/46-26-0002/462600022022001-eng.htm) to `scripts/.cache/nar.zip`.
2. Run `npm run build:addresses`. This takes about 1–2 minutes and samples 1,500 residential addresses per province (500 per territory) with a fixed seed.

## Data attribution

Addresses are from Statistics Canada's National Address Register, used under the [Statistics Canada Open Licence](https://www.statcan.gc.ca/en/terms-conditions/open-licence). The register also contains information licensed under the Open Government Licence – Yukon.
