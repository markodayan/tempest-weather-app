# To-do list

- ~~Update normalised weather data in `api` directory to replace weather codes with the mapped descriptions.~~ Decided against: `WeatherDay` keeps the raw `weather_code`, and components call `getWeatherCondition()` at render time instead — keeps the data layer free of display concerns.
- ~~Figure out how will go about using assets for each weather condition (cache images to CDN, use icon library, tbc)~~ Using `lucide-react` — already a dependency, keeps one consistent icon language across the whole app instead of mixing emoji with vector icons elsewhere.
- [ ] Explore swapping weather condition icons for [Meteocons](https://github.com/basmilius/meteocons) (MIT, 475+ hand-crafted icons, animated SVG/Lottie) if there's time left for visual polish. Ships raw SVG/Lottie rather than React components, so it'd need `vite-plugin-svgr` (or a Lottie player) plus a hand-built WMO-code → Meteocons-name map. Low risk to try later since `getWeatherCondition()` is the only seam between weather codes and icons — swapping only touches `weatherCodes.ts`.

- [ ] Setup Vitest
- [ ] Write test for search-related pure functions
- [ ] Write tests for `useDebounce` and `useLocationSearch` hooks
- [ ] Work on preferences functionality (state management, caching, connection to weather request pipeline, UI components within `Search.tsx`)
- [ ] Work on weather hook
- [ ] Component tests and Playwright setup later once components are ready
- [ ] Once weather fetching is set up, dynamically update application page title with `Tempest | <location_title>,<location_country>`
