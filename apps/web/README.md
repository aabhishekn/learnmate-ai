# Learnmate AI Frontend

This is the React + Vite frontend for the Learnmate AI project.

## Structure

- `index.html` (root): Vite entry point (do not add another in `src/`)
- `src/`: All React code
  - `main.jsx`: React entry
  - `App.jsx`: Routing
  - `pages/`: Top-level screens
  - `components/`: UI components
  - `hooks/`: Custom hooks
- `package.json`: Dependencies and scripts
- `vite.config.js`: Vite config (proxy, plugins)
- `vitest.config.js`, `playwright.config.js`: Test configs

## Scripts

- `npm run dev` — Start dev server (http://localhost:3000)
- `npm run build` — Build for production
- `npm run test` — Run unit tests (Vitest)

## Notes

- Only one `index.html` should exist (at root).
- All code is JavaScript (no TypeScript).
- If you use npm workspaces, the lock file is at the monorepo root.
