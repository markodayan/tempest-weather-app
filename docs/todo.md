# To-do list

- ~~Update normalised weather data in `api` directory to replace weather codes with the mapped descriptions.~~ Decided against: `WeatherDay` keeps the raw `weather_code`, and components call `getWeatherCondition()` at render time instead — keeps the data layer free of display concerns.
- ~~Figure out how will go about using assets for each weather condition (cache images to CDN, use icon library, tbc)~~ Using `lucide-react` — already a dependency, keeps one consistent icon language across the whole app instead of mixing emoji with vector icons elsewhere.
- [ ] Explore swapping weather condition icons for [Meteocons](https://github.com/basmilius/meteocons) (MIT, 475+ hand-crafted icons, animated SVG/Lottie) if there's time left for visual polish. Ships raw SVG/Lottie rather than React components, so it'd need `vite-plugin-svgr` (or a Lottie player) plus a hand-built WMO-code → Meteocons-name map. Low risk to try later since `getWeatherCondition()` is the only seam between weather codes and icons — swapping only touches `weatherCodes.ts`.

- ~~Setup Vitest~~ Configured via `vite.config.ts`'s `test` field (jsdom environment, `src/test/setup.ts` for jest-dom matchers). `npm test` runs once (CI-safe), `npm run test:watch` for the interactive loop.
- ~~Write test for search-related pure functions~~ `src/lib/coordinates.test.ts` and `src/api/countryCodes.test.ts`.
- [ ] Write tests for `useDebounce` and `useLocationSearch` hooks
- [ ] Work on preferences functionality (state management, caching, connection to weather request pipeline, UI components within `Search.tsx`)
- [ ] Document the fields being requested from the Weather API (the fields specified within `current` and `daily` query params). The Open-Meteo API documentation has all the details.
- [ ] Draw a diagram of the data path and data shapes and types from inputs supplied to search all the way to weather data served from the weather hook
- [ ] Work on weather hook. This will also involve the task of potentially improving the normalised data readings (e.g. wind direction is given in degrees which we might want to change to compass directions, though we could maybe use the degrees for CSS transformations - so this is still TBC)
- [ ] work on the weather tiles and detailed day weather components which both use the weather hook (maybe just use the weather hook in App and prop drill - TBC).
- [ ] Component tests and Playwright setup later once components are ready
- [ ] Once weather fetching is set up, dynamically update application page title with `Tempest | <location_title>,<location_country>`
