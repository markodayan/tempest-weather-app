# Tempest — A 7-Day Global Weather Forecast App

A React + TypeScript weather app: search any location worldwide and see its current
weather, a 3-day history, and a 3-day forecast, with a detailed breakdown for whichever
day you select.

**Live demo:** https://tempest-weather-app-eight.vercel.app/

## Features

- **Location search** — debounced, as-you-type suggestions from Open-Meteo's Geocoding
  API, with a country-hint disambiguation step (e.g. `"Glenwood South Africa"`) for
  common place names that would otherwise be buried under more populous
  same-named locations elsewhere.
- **7-day weather window** — 3 days of history, the current day, and a 3-day forecast,
  shown as a tile grid; selecting a tile drives a detailed report for that day.
- **Unit preferences** — temperature (°C/°F), wind speed (km/h, m/s, mph, kn), and
  precipitation (mm, in), with a draft/apply flow so changing a toggle doesn't refetch
  until you explicitly apply it.
- **Missing-data handling** — any weather field absent from the API response renders as
  a consistent `-` instead of `NaN` or a blank space.
- **Animated loading skeletons** — shaped like each component's real content, so there's
  no layout shift once data arrives.
- **Fully responsive** — a single mobile/desktop breakpoint strategy applied consistently
  across every component (see [Design decisions](#design-decisions--trade-offs)).
- **Landing state** — a set of suggested cities to search for on first load, before any
  location has been searched.

## Tech stack

- **React 19** + **TypeScript** (strict mode: `noUnusedLocals`, `noUnusedParameters`,
  `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`)
- **Vite** for tooling/bundling
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Vitest** + **React Testing Library** for unit/component tests
- **[Open-Meteo](https://open-meteo.com/)** — Geocoding API + Forecast API (no key
  required)
- Native **Fetch API** only — no Axios or other HTTP client
- **lucide-react** for icons

## Getting started

**Requirements:** Node.js (version pinned in `.nvmrc`)

```bash
# use the correct Node version (if you use nvm)
nvm use

# install dependencies
npm install

# start the dev server
npm run dev
```

The app will be available at the URL Vite prints (typically `http://localhost:5173`).

### Other scripts

```bash
npm run build       # type-check (tsc -b) then production build
npm run preview      # preview the production build locally
npm run lint         # eslint .
npm test             # run the test suite once
npm run test:watch   # run tests in watch mode
```

## Design decisions & trade-offs

- **No global state library.** All state lives in `App.tsx` and flows down as props —
  the component tree is shallow and there's a single data domain, so Redux/Zustand/
  Context would have added indirection without solving a real problem here. Full
  reasoning in [`ARCHITECTURE.md`](ARCHITECTURE.md).
- **Plain hooks over a data-fetching library.** `useDebounce`/`useLocationSearch`/
  `useWeather` are hand-rolled on `useState`/`useEffect` rather than React Query/SWR —
  same reasoning: one data domain, no caching/revalidation requirements beyond what's
  already needed.
- **Search selection vs. weather location are separate state.** Resetting the search bar
  clears what the input shows, not the weather already on screen — otherwise clearing
  the search would either strand stale text in the input or blank the whole page.
- **Preferences use a draft/commit split**, so toggling a unit radio button doesn't fire
  an API request per click — only an explicit "Apply" (or selecting a new location)
  commits the draft and triggers a refetch.
- **The raw WMO weather code is kept in the normalized data**, not a pre-resolved label —
  icons, text labels, and mood-based background images are all derived from it at render
  time, keeping the data layer free of display concerns.
- **`timezone=auto` is always sent to the Forecast API**, rather than trusting the
  geocoder's own `timezone` field. Some geocoding results (country-level entries rather
  than a city within a country) omit it entirely, which used to break the request
  outright with a 400. Full root-cause write-up in
  [`docs/error-investigations.md`](docs/error-investigations.md).
- **A single `xl:` (1280px) breakpoint** is used throughout, rather than the full
  `sm`/`md`/`lg`/`xl` scale — a clean mobile-vs-desktop split matched the actual content
  well enough in practice, at the cost of less granular control over in-between (e.g.
  tablet) viewport widths.
- **Left out of scope, deliberately:** preference/recent-search caching, automated
  refresh polling, and Playwright E2E coverage. See
  [`docs/post-assignment-thoughts.md`](docs/post-assignment-thoughts.md) for the full
  reasoning and what I'd tackle next.

## Testing

82 tests across 12 files (pure functions, hooks, and components) — `npm test` to run
them. A full breakdown of what's covered, what isn't yet, and non-obvious testing
gotchas encountered along the way is in [`docs/testing.md`](docs/testing.md).

## Architecture

State management and data flow (search → geocoding → weather fetch → rendering, and how
unit preferences are staged/committed) are documented in full in
[`ARCHITECTURE.md`](ARCHITECTURE.md).

## Further reading

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — state ownership and data flow
- [`docs/testing.md`](docs/testing.md) — test coverage breakdown
- [`docs/error-investigations.md`](docs/error-investigations.md) — notable bugs found
  and fixed during development
- [`docs/post-assignment-thoughts.md`](docs/post-assignment-thoughts.md) — what I'd do
  next with more time
