# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Tempest is a weather application built for a take-home technical assessment (see `docs/assignment-instructions.md` for the full brief). It is a React + TypeScript SPA that shows current weather, a 3-day history, and a 3-day forecast for a searched location, with a detail view for whichever day is selected.

The project is feature-complete and submitted. `README.md` is the primary hiring-facing document (features, setup, design decisions); `ARCHITECTURE.md` covers state ownership and data flow in depth; `docs/post-assignment-thoughts.md` covers what was deliberately left out of scope and why. Read those before `docs/strategy.md`/`docs/components.md`/`docs/todo.md`, which are earlier-stage planning notes and may describe intent that changed once actually built.

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

Playwright for E2E was planned (per `docs/strategy.md`) but not set up in the time available — see `docs/post-assignment-thoughts.md` for why, and add it first if this project is picked back up.

TypeScript uses project references (`tsconfig.json` → `tsconfig.app.json` for `src`/`playground`, `tsconfig.node.json` for Vite config). `npm run build` runs `tsc -b` across all references before bundling.

## Architecture

Full details (state ownership table, search→geocoding→weather data flow, the preferences draft/commit split, loading/error/missing-data handling) are in `ARCHITECTURE.md` — read that first for anything beyond the summary below.

**Data source**: Open-Meteo, via two APIs (no API key required), both wrapped in `src/api/` (`geocode.ts`, `weather.ts`):
- **Geocoding API** — resolves a free-text location search into lat/lon + place metadata for search-as-you-type suggestions. Includes country-hint disambiguation (`extractCountryHint`/`countryCodes.ts`) for common place names buried under more populous same-named locations elsewhere.
- **Forecast API** — supplies current conditions plus the 3-day history/3-day forecast window. Always requested with `timezone=auto` rather than the geocoder's own `timezone` field, since some geocoding results omit it entirely (see `docs/error-investigations.md`).

Only the native Fetch API is used (no Axios or similar).

**Component structure** (`src/components/`):
- `Branding` — logo/title/tagline; clicking the logo reloads the app (`<a href="/">`, no JS needed).
- `Search` — debounced location search with live suggestions (ARIA combobox, full keyboard nav), plus the selected-location badge/reset UI.
- `Preferences` — unit toggles (temperature, wind speed, precipitation) with a draft/apply flow; changes don't refetch until explicitly applied or a new location is searched.
- `Landing` — suggested-city cards shown before any location has been searched.
- `DayPreview` — photo-hero banner for the selected day, background image keyed to a weather "mood" bucket (`src/lib/weatherBackground.ts`).
- `WeatherDays` — the 7-day tile grid (3 history, today, 3 forecast); clicking a tile selects it. Mobile: 2-column grid with the unpaired 7th tile spanning both columns.
- `SelectedDayReport` — detailed panel-based report for whichever day is selected; missing fields render `-` via `src/lib/formatReading.ts` rather than leaking `NaN`.
- `Footer`, `Skeleton` — page footer, and the shared loading-skeleton primitive used by `DayPreview`/`WeatherDays`/`SelectedDayReport`.

**State management**: no global state library — all state (`searchSelection`, `weatherLocation`, committed preferences, `selectedDayIndex`) lives in `App.tsx` and flows down as props. `src/hooks/` (`useDebounce`, `useLocationSearch`, `useWeather`) are plain `useState`/`useEffect` hooks, not a data-fetching library — deliberate, since the app has one data domain and a shallow component tree. See `ARCHITECTURE.md` for the reasoning and `docs/post-assignment-thoughts.md` for what was cut (preference/search caching, auto-refresh polling, PWA support) and why.

## Styling

Tailwind CSS v4, wired in via `@tailwindcss/vite` (not the PostCSS plugin) — see `vite.config.ts`. Global styles are just `@import 'tailwindcss';` in `src/index.css`; prefer utility classes in JSX over adding custom CSS.

## Testing

`docs/testing.md` tracks current testing stack/scripts and what's covered so far — update it whenever testing setup or coverage changes (new test files, a new layer added, config changes).

## Commit messages

Follow `docs/commit-convention.md` (`type(scope): summary`, Conventional-Commits-based) for every commit — it's the mechanism for documenting progress against the assignment.

## Notes

- The `playground/` directory (gitignored) is a sandbox for exercising API/data-layer code standalone via `npm run playground` — it is not part of the app bundle and is excluded from `tsc -b`'s build coordination but included in `tsconfig.app.json`'s `include`.
- TypeScript is configured strictly: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, and `verbatimModuleSyntax` are all on — type-only imports must use `import type`.
