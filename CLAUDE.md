# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Tempest is a weather application built for a take-home technical assessment (see `docs/assignment-instructions.md` for the full brief). It is a React + TypeScript SPA that shows current weather, a 3-day history, and a 3-day forecast for a searched location, with a detail view for whichever day is selected.

The project is at an early scaffolding stage — `src/App.tsx` is currently a placeholder and the component architecture described below is the target design from `docs/`, not yet fully implemented.

## Commands

```bash
npm run dev       # start Vite dev server
npm run build     # type-check (tsc -b, project references) then production build
npm run lint      # eslint .
npm run preview   # preview the production build
npm run playground  # run playground/index.ts via tsx (scratch space for testing API calls, e.g. geocode.ts)
npm test           # run the Vitest suite once (jsdom environment, config in vite.config.ts's `test` field)
npm run test:watch  # Vitest in watch mode
```

Playwright for E2E is specified in `docs/strategy.md` but not yet set up — add it when there's enough UI to drive end-to-end.

TypeScript uses project references (`tsconfig.json` → `tsconfig.app.json` for `src`/`playground`, `tsconfig.node.json` for Vite config). `npm run build` runs `tsc -b` across all references before bundling.

## Architecture

**Data source**: Open-Meteo, via two APIs (no API key required):
- **Geocoding API** (`geocoding-api.open-meteo.com/v1/search`) — resolves a free-text location search into lat/lon + place metadata, returning the top matches for search-as-you-type UX. See `playground/geocode.ts` for the request/response shape and normalized `LocationResult` type.
- **Forecast API** — supplies current conditions plus the 3-day history/3-day forecast window.

Only the native Fetch API is used (no Axios or similar).

**Intended component structure** (per `docs/components.md`):
- `SearchBar` — debounced location search with live top-5 suggestions, unit preference toggles (temperature, wind speed, precipitation), and an auto-refresh preference. Submitting locks in a `query` state that drives the fetch.
- `WeatherGrid` — 7 tiles (3 prior days, current day, 3 forecast days); clicking a tile selects it.
- `DetailedWeatherReport` — verbose weather data for whichever tile is selected; the current-day view differs from past/future-day views (e.g. freshness of data, day/night indication).

**State/behavior notes from `docs/strategy.md`** (design intent, verify against actual code before relying on it):
- Search results and user preferences (units, auto-refresh) are intended to be cached/persisted across sessions.
- Current-day weather should reflect freshness (show time since last fetch) and a manual refresh affordance.
- A custom hook is the planned mechanism for data retrieval/synchronization rather than a general-purpose state library, since the app has no broader extensibility requirements.

## Styling

Tailwind CSS v4, wired in via `@tailwindcss/vite` (not the PostCSS plugin) — see `vite.config.ts`. Global styles are just `@import 'tailwindcss';` in `src/index.css`; prefer utility classes in JSX over adding custom CSS.

## Testing

`docs/testing.md` tracks current testing stack/scripts and what's covered so far — update it whenever testing setup or coverage changes (new test files, a new layer added, config changes).

## Commit messages

Follow `docs/commit-convention.md` (`type(scope): summary`, Conventional-Commits-based) for every commit — it's the mechanism for documenting progress against the assignment.

## Notes

- The `playground/` directory (gitignored) is a sandbox for exercising API/data-layer code standalone via `npm run playground` — it is not part of the app bundle and is excluded from `tsc -b`'s build coordination but included in `tsconfig.app.json`'s `include`.
- TypeScript is configured strictly: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, and `verbatimModuleSyntax` are all on — type-only imports must use `import type`.
