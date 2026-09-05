# Love Ahir — Portfolio

The personal portfolio of **Love Jayesh Ahir** — a software engineer with 4+
years building production backend services, full-stack products, cloud
delivery, and applied AI across financial services and enterprise platforms.
It is built around one idea: *every claim links to an artifact* — a case study,
a repository, a metric, or a paper.

Built with **React + TypeScript + Vite**, styled with **Tailwind CSS**, enhanced
with a progressively loaded **Three.js / React Three Fiber** voxel scene and a
small 2D ambient canvas, localized into **8 languages** with i18next, and
covered by **Vitest + Testing Library**. The current production site is
[loveahir.com](https://loveahir.com); redesign work remains local until it is
explicitly approved and deployed.

## Getting started

```bash
npm install                # install dependencies
npm run dev                # start the dev server (http://localhost:8080)
npm test                   # run the test suite once
npm run test:watch         # run tests in watch mode
npm run build              # production build
npm run generate:sitemap   # regenerate public/sitemap.xml after slug changes
```

## Routes

| Route | Purpose |
|---|---|
| `/` | Recruiter-first home: hero → proof → About + profile photo → experience → projects → capabilities → credentials + education → supporting research |
| `/work` | Numbered index: 6 case studies + 10 archive rows |
| `/work/<slug>` | Full case study: context → problem → approach → outcomes → retrospective |
| `/research` | EASE 2026 paper: abstract, findings, method, and BibTeX |
| `/about` | Story, full experience timeline (`#experience`), education, capabilities, and credentials |

Primary navigation is About · Experience · Work · Contact plus a résumé pill.
Research remains supporting evidence and is linked from the footer and related
content instead of leading the identity.

Netlify SPA routing is handled by `public/_redirects`.

## Architecture

- `src/data/portfolio.ts` — canonical profile, education, experience, projects,
  skills, expertise, and credentials. Experience records hold structural facts
  and point to locale keys, so home and `/about` share one dataset.
- `src/data/caseStudies.ts` — ten typed long-form case studies. Explicit
  `featuredSlugs` curation leads with TradeOps Copilot; body copy remains English-only
  by design and retains `lang="en"` outside English locales.
- `src/lib/locales/` — eight locale dictionaries structurally locked to the
  `en-US` key set. `src/lib/i18n.ts` wires i18next and synchronizes `<html lang>`.
- `src/components/lattice/` — one deterministic 564-cube dataset shared by the
  synchronous SVG fallback and lazy WebGL enhancement. A single instanced mesh
  morphs between a dense warm mask, a cloud, and a helix; constrained, coarse,
  and reduced-motion devices keep the complete static composition.
- `src/components/ambient/` — a separately lazy hero-only 2D flow field. Four
  deterministic shallow warm streams provide bounded parallax and local
  pointer response without intercepting input. It is DPR/frame-rate capped,
  paused when hidden or offscreen, and replaced by a complete static fallback
  for reduced-motion, coarse and constrained devices.
- `src/lib/motion.ts` and `src/lib/pointerMotion.ts` — reveal and bounded depth
  helpers. Content never begins hidden; reduced motion resolves immediately.
- `src/components/Layout.tsx` — skip link, route-change focus management, and
  Person JSON-LD. `src/components/Seo.tsx` owns per-route metadata without a
  helmet dependency.
- `src/index.css` + `tailwind.config.ts` — warm semantic design tokens and
  self-hosted typography.
- `scripts/generate-sitemap.mjs` — generates `public/sitemap.xml`; integrity
  tests fail if routes, slugs, locales, or public claims drift.

The voxel transformation was independently authored from procedural rules. It
does not embed a third-party voxel matrix, texture, model, screenshot, or
reference-site source code.

## Content workflow

Case-study media lives in each entry's `media` array in
`src/data/caseStudies.ts` and renders automatically once assets are added under
`src/assets/work/<slug>/`. The résumé is served at `public/resume.pdf` through
`profile.resumeUrl`; replace that file to publish a new version.

Adding or editing a role requires the structural record in
`src/data/portfolio.ts` and its `exp.<id>.*` strings in all eight locale files.
The `Translation` type and integrity tests reject missing or empty keys.

## Testing

Vitest runs in jsdom. Pure geometry, data, capability gates, motion helpers,
components, routes, first-paint behavior, locale parity, and sitemap integrity
are all covered.

```bash
npm test
```
