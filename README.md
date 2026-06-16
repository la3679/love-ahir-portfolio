# Love Ahir — Portfolio (Aurora Noir)

A sleek, dark, motion-rich personal portfolio for **Love Jayesh Ahir** — software
engineer and EASE 2026-published privacy researcher.

Built with **React + TypeScript + Vite**, styled with **Tailwind CSS** in a custom
"Aurora Noir" design system (glassmorphism + an aurora violet/cyan/magenta accent
palette), animated with **Framer Motion**, and covered by a **Vitest + Testing
Library** suite.

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:8080)
npm test         # run the test suite once
npm run test:watch  # run tests in watch mode
npm run build    # production build
```

## Architecture

- `src/data/portfolio.ts` — single source of truth for all content (profile, stats,
  education, experience, projects, skills, expertise, certifications) plus the pure
  `filterProjects` / `countByCategory` helpers.
- `src/lib/` — framework-free, unit-tested logic: `typing.ts` (typewriter reducer),
  `mailto.ts` (contact `mailto:` builder), `accents.ts` (static Tailwind accent maps),
  `utils.ts` (`cn`).
- `src/components/` — section components (`Hero`, `About`, `Experience`, `Projects`,
  `Skills`, `Expertise`, `Certifications`, `Contact`) plus shared building blocks
  (`AuroraBackground`, `Navigation`, `SectionHeading`, `TypingAnimation`, `Footer`).
- `src/index.css` + `tailwind.config.ts` — the Aurora Noir design tokens, fonts, and
  keyframes.

## Testing

Logic and components are tested with Vitest in a jsdom environment. Pure helpers are
tested directly; interactive components (project filtering, navigation, the hero) are
tested with Testing Library. Framer Motion is mocked in component tests so assertions
are deterministic.

```bash
npm test
```
