# Testing

Keep this file current: whenever testing setup or coverage changes (new test
files, a new layer added, config changes), update it here.

## Stack

- **Vitest** — unit/component test runner. Config lives in `vite.config.ts`'s
  `test` field: `environment: 'jsdom'`, `setupFiles: ['./src/test/setup.ts']`
  (imports `@testing-library/jest-dom/vitest` to extend `expect` with DOM
  matchers).
- **@testing-library/react**, **@testing-library/user-event** — component
  tests (`WeatherDays.test.tsx`) and the underlying hook tests above.
- **Playwright** — planned for E2E per `docs/strategy.md`, not yet set up.

## Scripts

- `npm test` — runs the suite once (`vitest run`); CI-safe default.
- `npm run test:watch` — interactive watch mode (`vitest`).

## Current coverage

- `src/lib/coordinates.test.ts` — `formatLatitude`/`formatLongitude`: sign →
  hemisphere letter, degrees/minutes formatting, and the minute-rounding-to-60
  carry into the next degree.
- `src/api/countryCodes.test.ts` — `resolveCountryCode`/`extractCountryHint`:
  comma-separated form, plain trailing-words form (no comma), raw ISO-2 code
  passthrough, alias resolution, unrecognised-country fallback, and a
  regression case (`"New York"`) confirming an ordinary multi-word place name
  isn't misparsed as having a country hint.

  These two are pure-function suites — no mocking, no DOM, no React.

- `src/hooks/useDebounce.test.ts` — value doesn't update before the delay
  elapses, updates once it does, rapid changes reset the timer so only the
  final value ever commits, and the pending timer is cleared on unmount.
- `src/hooks/useLocationSearch.test.ts` — debounced fetching, the `loading`
  state while a request is in flight, error handling, superseded requests
  getting aborted, and suggestions/error lagging behind a cleared input by
  one debounce interval (see nuances below).
- `src/components/WeatherDays.test.tsx` — renders one tile per day with its
  label and rounded high/low temperatures, marks only the
  `selectedDayIndex` tile as current, calls `onSelectDay` with the clicked
  day's index, and the loading/error/no-data-yet states each render their
  own thing with no tiles.

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
- Components: `Search`, `Preferences`
- Integration (multiple components wired together, once more exist)
- E2E (Playwright)
