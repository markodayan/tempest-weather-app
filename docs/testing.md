# Testing

Keep this file current: whenever testing setup or coverage changes (new test
files, a new layer added, config changes), update it here.

## Stack

- **Vitest** — unit/component test runner. Config lives in `vite.config.ts`'s
  `test` field: `environment: 'jsdom'`, `setupFiles: ['./src/test/setup.ts']`
  (imports `@testing-library/jest-dom/vitest` to extend `expect` with DOM
  matchers).
- **@testing-library/react**, **@testing-library/user-event** — installed for
  hook/component tests; not yet used.
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

Both are pure-function suites — no mocking, no DOM, no React.

## Not yet covered

- Hooks: `useDebounce`, `useLocationSearch` (need fetch mocking + fake timers)
- Components: `Search`
- Integration (multiple components wired together, once more exist)
- E2E (Playwright)
