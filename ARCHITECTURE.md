# Architecture

## Layers

```
src/
  api/          Open-Meteo request/response shapes + normalization. Zero React.
  hooks/        Stateful glue between the API layer and components.
  lib/          Small, pure, unit-tested formatting/utility functions.
  components/   Presentation.
```

- **`api/`** (`geocode.ts`, `weather.ts`, `weatherCodes.ts`, `types.ts`, `countryCodes.ts`) — the only code that talks to Open-Meteo. Converts each API's raw response shape into the app's own normalized types (`Location`, `WeatherReadings`) so nothing outside this layer needs to know what Open-Meteo's JSON actually looks like. `requestWeather`'s `currentFields`/`dailyFields` are typed against literal string unions (`CurrentParamOption`/`DailyParamOption`) rather than `string[]`, so a typo'd or unsupported field name fails to compile instead of silently going out in a request.
- **`hooks/`** (`useDebounce`, `useLocationSearch`, `useWeather`) — own the async state (loading/error/data) for one concern each, built on plain `useState`/`useEffect` rather than a data-fetching library (React Query, SWR) or a global state library (Redux, Zustand). The app has one data domain and a shallow component tree (see below), so the extra abstraction didn't pay for itself here.
- **`lib/`** — pure functions with no React or fetch dependency: date/label formatting, coordinate formatting, wind-degree-to-compass conversion, the WMO-code-to-mood-bucket mapping for background images, and `formatReading` (see [Design decisions](README.md#design-decisions--trade-offs)). These are the most heavily unit-tested part of the codebase precisely because they're pure — no mocking required.
- **`components/`** — presentation only. Each component receives everything it needs as props; none of them call the API layer directly.

## State ownership

All stateful values live in `App.tsx` and flow down as props — there's no context provider and no external state library:

| State | Owned by | Fed by |
|---|---|---|
| `searchSelection` | `App` | `Search`'s badge/write-mode UI only |
| `weatherLocation` | `App` | Drives `useWeather`; only ever moves forward (a reset clears `searchSelection`, never this) |
| `committed` (unit preferences) | `App` | The only preferences value `useWeather` actually reads |
| `selectedDayIndex` | `App` | Which of the 7 day tiles is active |

`searchSelection` and `weatherLocation` are deliberately two separate pieces of state rather than one. Resetting the search bar (the × button) should let the user start a new search without losing the weather currently on screen — if there were only one "current location" value, clearing the search bar would have to either keep stale text in the input or blank the whole page.

## Data flow

**Search → weather:**

```
Search input
  → useLocationSearch (debounces 300ms, calls geocodeLocation)
  → Open-Meteo Geocoding API
  → suggestions dropdown
  → user selects a location
  → App.handleLocationSelect sets searchSelection AND weatherLocation
  → useWeather(weatherLocation, committed) fires
  → Open-Meteo Forecast API (timezone=auto — see docs/error-investigations.md)
  → WeatherReadings { days: WeatherDay[] }
  → passed to DayPreview / WeatherDays / SelectedDayReport, all keyed by selectedDayIndex
```

**Preferences:**

`Preferences` owns an uncommitted `draft` copy of the unit preferences locally. Changing a radio button only updates `draft` — it does **not** refetch. A fetch only happens when `draft` is committed, either by:

1. Clicking "Apply" (or "Apply for Current Location" if the search bar has been reset but a location is still showing), or
2. Selecting a brand-new location, which auto-commits whatever `draft` was already showing (so a preference changed *before* searching doesn't get silently discarded).

This draft/commit split exists so toggling a radio button doesn't fire an API request per click — only an explicit, visible action does.

## Rendering states

Every data-driven component (`DayPreview`, `WeatherDays`, `SelectedDayReport`) handles the same four states in the same order: `loading` → animated skeleton (shaped like that component's real content, reusing its actual container/grid classes so there's no layout jump) → `error` → a friendly message (shown once, in `DayPreview`, rather than duplicated across all three) → `weather === null` → renders nothing → otherwise, the real content.

`WeatherDay` types every field as possibly `null`/`undefined`, since Open-Meteo doesn't guarantee every field for every location/date. `SelectedDayReport` uses a shared `formatReading()` helper to render a consistent `-` for a missing field, rather than letting `NaN` or a blank string leak into the UI.
