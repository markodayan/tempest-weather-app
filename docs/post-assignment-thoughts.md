# Post-Assignment Thoughts

A few honest reflections on scope and prioritization, and what I'd tackle next given more time.

## What I'd prioritize with more time

**End-to-end testing with Playwright.** The current suite (Vitest + Testing Library) covers pure functions, hooks, and individual components in isolation, but there's no test that drives the app the way a real user would — searching for a location, watching the weather load, clicking through days, changing preferences and applying them. `docs/testing.md` documents exactly where the automated coverage stops today; Playwright was the planned next layer (see `docs/strategy.md`) but didn't make the cut in the time available.

**Preference and recent-search caching.** Unit preferences and the current location currently live entirely in React state — refreshing the page resets both. `localStorage` (or `IndexedDB` for the recent-searches list) would have been the natural next step, and `docs/test-cases.md` already has draft test cases written against that behavior in anticipation of building it.

**Automated refresh / polling for the current day.** The current-day view is only as fresh as the last search or manual reload. A background refresh timer (abstracted behind a hook, invisible to the user beyond a "last updated" indicator) was planned but explicitly flagged as scope creep worth thinking through first — naive polling on a page left open indefinitely is a real (if small) DoS vector against a free public API, and deserved more thought than I had time to give it.

**PWA configuration.** Given prior experience with service workers, offline support and installability felt like a natural extension of a weather app people might want quick access to — parked in favor of finishing the core assignment scope first.

**Coupling a second location/weather API.** Open-Meteo's geocoder is good but not perfect (see the `Glenwood`/`Greenland` cases in `docs/api.md` and `docs/error-investigations.md`); a second source for cross-referencing or fallback would make location resolution meaningfully more robust.

**Dark mode and other UI preferences.** The app currently ships one visual theme. Structurally this would slot in fairly easily (the theme is already centralized in `src/index.css`'s `@theme` block), but it didn't make the priority list over getting the core weather experience right first.

**More animation/motion polish.** What's there (hover transitions, the collapsible preferences panel, image hover-zooms) is all hand-written CSS/Tailwind. I'd have liked to explore Framer Motion for the bigger transitions — e.g. the shift from the landing state to a searched location — given more time.

**Suspense-first data fetching.** The app fetches via plain `useEffect`-based hooks throughout. Rebuilding the data layer around Suspense (and an error boundary) would simplify a fair amount of the repeated loading/error-branching currently duplicated across `DayPreview`, `WeatherDays`, and `SelectedDayReport`.

**Data visualization.** A 7-day temperature/precipitation trend chart would add real value beyond the tile-by-tile view, but was scoped out to protect time for the core deliverable.

## What I'd do differently

**Less time on icon/graphic sourcing and editing.** A real chunk of time went into sourcing, compressing, and hand-editing SVG weather icons and mood-based background images (see `docs/image-guidelines.md`) to get the visual polish right. It was worth it for the final look, but in hindsight I'd timebox this more tightly against the core functional requirements next time.

## What surprised me

A few real bugs only surfaced by actually exercising the app end-to-end rather than reasoning about the code in isolation — most notably a geocoding result for a country-level location (rather than a city within it) that Open-Meteo returns without a `timezone` or `country` field at all, which broke both the weather request and the UI's location label. Write-up (root cause, fix, and verification) is in `docs/error-investigations.md`. It's a good example of why the Playwright layer above would have been valuable sooner rather than later.
