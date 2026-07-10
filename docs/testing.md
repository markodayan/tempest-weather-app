# Testing

Keep this file current: whenever testing setup or coverage changes (new test
files, a new layer added, config changes), update it here.

## Stack

- **Vitest** — unit/component test runner. Config lives in `vite.config.ts`'s
  `test` field: `environment: 'jsdom'`, `setupFiles: ['./src/test/setup.ts']`
  (imports `@testing-library/jest-dom/vitest` to extend `expect` with DOM
  matchers).
- **@testing-library/react**, **@testing-library/user-event** — component
  tests and the underlying hook tests below.
- **Playwright** — planned for E2E per `docs/strategy.md`, not yet set up
  (see `docs/post-assignment-thoughts.md`).

## Scripts

- `npm test` — runs the suite once (`vitest run`); CI-safe default.
- `npm run test:watch` — interactive watch mode (`vitest`).

As of writing: **11 test files, 79 tests, all passing.**

## Current coverage

### Pure functions (`src/lib/`, `src/api/`) — no mocking, no DOM, no React

- `coordinates.test.ts` — `formatLatitude`/`formatLongitude`: sign → hemisphere
  letter, degrees/minutes formatting, and the minute-rounding-to-60 carry into
  the next degree.
- `countryCodes.test.ts` — `resolveCountryCode`/`extractCountryHint`:
  comma-separated form, plain trailing-words form (no comma), raw ISO-2 code
  passthrough, alias resolution, unrecognised-country fallback, and a
  regression case (`"New York"`) confirming an ordinary multi-word place name
  isn't misparsed as having a country hint.
- `dates.test.ts` — the various day-label formatters (`formatDayLabelShort`,
  `formatDayLabelCompact`, `formatDayLabelLong`), including a UTC-negative
  timezone-boundary regression case.
- `wind.test.ts` — `degreesToCompassDirection`: cardinal and intercardinal
  points, and the 360°-wraparound boundary.
- `weatherBackground.test.ts` — `getWeatherMood`/`getWeatherBackgroundSrc`:
  every WMO-code-to-mood bucket (including the snow-shower codes that were
  originally missing an explicit mapping — see `docs/weather-code-map.md`),
  the neutral fallback, and the built asset path.
- `formatReading.test.ts` — the missing-field-handling helper: formats a
  present value, coerces a numeric string, returns `-` for `null`/`undefined`/
  a non-numeric string, and doesn't mistake a real `0` for a missing value.

### Hooks (`src/hooks/`)

- `useDebounce.test.ts` — value doesn't update before the delay elapses,
  updates once it does, rapid changes reset the timer so only the final value
  ever commits, and the pending timer is cleared on unmount.
- `useLocationSearch.test.ts` — debounced fetching, the `loading` state while
  a request is in flight, error handling, superseded requests getting
  aborted, and suggestions/error lagging behind a cleared input by one
  debounce interval (see nuances below).

### Components (`src/components/`)

- `WeatherDays.test.tsx` — one tile per day with its label and rounded
  high/low temperatures, only `selectedDayIndex`'s tile marked current,
  `onSelectDay` called with the clicked index, and the loading/error/
  no-data-yet states each render their own thing with no tiles.
- `DayPreview.test.tsx` — the weekday/temperature/condition/location/info-pill
  content, the "Today" special case, and the loading/error/no-data states.
- `SelectedDayReport.test.tsx` — the header's day label and 3-part location
  name, each panel's unit suffix matching the selected preference, `-`
  rendered for fields missing from the API response, the prev/next day
  buttons' disabled boundaries and click behavior, and the loading/error/
  no-data states.

## Nuances worth knowing before writing more component tests

**`afterEach(cleanup)` has to be added explicitly.** Vitest's `globals`
option isn't enabled in `vite.config.ts`, so `afterEach` isn't a global -
`@testing-library/react`'s automatic cleanup-between-tests relies on
detecting that global, so it silently never registered without this. Symptom
was `getByText`/`getByRole` finding duplicate matches from a *previous*
test's still-mounted DOM, not the current one. Fixed once, in
`src/test/setup.ts`, so every component test benefits without repeating it.

**`window.matchMedia` isn't implemented by jsdom.** `Preferences.tsx`'s
`isExpanded` state reads `window.matchMedia('(min-width: 1280px)').matches`
once on mount to decide its default (expanded at/above the `xl:` breakpoint,
collapsed below it). jsdom doesn't implement `matchMedia` at all by default,
so rendering `Preferences` in a test as-is will throw
`TypeError: window.matchMedia is not a function`. Whenever a
`Preferences.test.tsx` gets written, it'll need a `matchMedia` mock/polyfill
first - either globally in `src/test/setup.ts` (if other components end up
needing it too) or stubbed per-test via `vi.stubGlobal('matchMedia', ...)`.

**Mobile/desktop dual-rendering doesn't need a viewport mock.** `WeatherDays`
and `SelectedDayReport` render *both* the mobile-compact and desktop-full
label variants at once (toggled purely via CSS `xl:hidden`/`xl:inline`, not
conditional rendering), so tests can assert on either string directly without
simulating a viewport width — see the `getAllByText('Today')` pattern in
`WeatherDays.test.tsx` for the one place this required disambiguating between
the two simultaneously-rendered copies.

## Nuances worth knowing before writing more hook tests

**Fake timers + promises don't mix trivially.** `vi.advanceTimersByTime` only
advances the clock; it doesn't wait for microtasks (promise `.then` chains) to
flush in between ticks. Use `await vi.advanceTimersByTimeAsync(ms)` instead
whenever the code under test both schedules a timer *and* does async work off
the back of it (this is exactly `useLocationSearch`'s shape: debounce timer →
fetch → state update). Wrap it in `await act(async () => { ... })` so React
processes the resulting state updates within the same act boundary.

**Mock at the module boundary, not the hook.** `useLocationSearch.test.ts`
mocks `../api`'s `geocodeLocation` (`vi.mock('../api', () => ({ geocodeLocation: vi.fn() }))`),
not the hook itself — this exercises the hook's real debounce/loading/error/
abort logic against a controlled fake network call, rather than re-asserting
a mock. For tests needing to observe state *while* a request is pending (e.g.
"is `loading` true mid-flight?"), a manually-created deferred promise (resolve
the promise from within the test, on demand) is more precise than
`mockResolvedValue`, which resolves before you get a chance to assert on the
in-between state.

**Testing an abort by inspecting the signal, not by relying on the mock to
reject.** `useLocationSearch` passes an `AbortController`'s signal into
`geocodeLocation`; on a superseded request, the hook calls `controller.abort()`
via the effect cleanup. The test captures each call's signal via
`mockImplementationOnce` and asserts `signal.aborted` directly, rather than
expecting the mocked promise to auto-reject the way a real aborted `fetch`
would — mocks don't enforce that contract for you, so asserting the signal
itself is the reliable thing to check.

**A real gap this surfaced**: designing the abort test exposed that the success
`.then()` branch had no `if (controller.signal.aborted) return` guard, unlike
`.catch()`. In production this couldn't misfire — a real `fetch` always
rejects an aborted request, never resolves it — but the hook's correctness
depended entirely on that external guarantee rather than defending itself.
Added the same guard to `.then()` for defense-in-depth, and strengthened the
test to prove it: after the second (superseded) request resolves and is
applied, the test resolves the *first* (aborted) request late with a
different result and asserts `suggestions` doesn't change. Reverting the fix
and re-running confirms this specific assertion fails without it — the test
doesn't just document the fix, it would catch a regression.

**`useLocationSearch`'s returned `suggestions`/`error` lag behind a cleared
input.** Both are gated on `hasQuery`, which is derived from
`debouncedSearchTerm`, not the raw `searchTerm`. So clearing the input doesn't
immediately reset `suggestions`/`error` to empty — they still reflect the
previous term until the debounce interval elapses again for the now-empty
value. This is covered explicitly in the test suite rather than assumed. It's
harmless today because `Search.tsx` gates dropdown *visibility* on the raw
`searchTerm` itself, not on `suggestions`/`error` — but any future consumer of
this hook needs to know not to rely on `suggestions`/`error` alone to detect
"the user cleared the input."

## Not yet covered

- `src/api/geocode.ts` and `src/api/weather.ts` — need fetch mocking at the
  network boundary (`vi.stubGlobal('fetch', ...)`), one layer below the hooks
  above (which already mock the `../api` module rather than the network).
  Worth pinning down: request URL/params built correctly (this is where the
  `count`-vs-`countryCode` ordering gotcha lives), non-ok/network-error
  handling, and `weather.ts`'s normalisation logic.
- `src/lib/location.ts` (`formatLocationLabel`) — no dedicated test file yet.
- Components: `Search`, `Preferences`, `Landing`, `Branding`, `Footer`,
  `Skeleton` (the last is trivial enough it may not need its own test).
- Integration (multiple components wired together through `App`).
- E2E (Playwright) — see `docs/post-assignment-thoughts.md`.
