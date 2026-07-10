# Error Investigations

Write-ups of bugs that took real investigation to root-cause (as opposed to
obvious typos/oversights) - kept for context on why the fix looks the way it
does, and as a reference for the next similarly-shaped bug.

## "Greenland" search selection throws a 400

### Symptom

Searching "greenland" and selecting the plain **Greenland** suggestion (lat
72, lon -40 - the country itself, not a city within it) showed:

- The search badge rendering literally as `Greenland, , undefined`.
- Three copies of a raw `Forecast API request failed with status 400.` error
  message, one each from `DayPreview`, `WeatherDays`, and `SelectedDayReport`.

### Investigation

Reproduced end-to-end with a scratch script (`geocodeLocation('greenland')`
followed by the same forecast request the app would make) rather than
guessing from the UI symptom alone. The geocoding API's raw JSON for this
specific result had no `country`, `admin1`, or `timezone` fields at all -
unlike every other "Greenland" result (a city/town within some country),
which all had the full set:

```json
{
  "id": 3425505,
  "name": "Greenland",
  "latitude": 72,
  "longitude": -40
}
```

Tracing the normalisation code (`src/api/geocode.ts`) showed why that turned
into visible breakage:

- `location_country: item.country` -> `undefined` (no fallback), so it was
  interpolated straight into the badge template literal as the string
  `"undefined"`.
- `timezone: item.timezone` -> `undefined`, which then got serialised into
  the forecast request URL as the literal query string `timezone=undefined`.
  Open-Meteo's forecast API responded `400 {"reason":"Invalid timezone"}` -
  confirmed by curling the URL directly.
- The 400 surfaced 3 times because `App.tsx` passes the same `error` string
  down to `DayPreview`, `WeatherDays`, and `SelectedDayReport`, and each one
  independently rendered its own raw `<p>{error}</p>`.

So: half an upstream data gap (the geocoder itself doesn't return
timezone/country for this kind of result), half ours (trusting those fields
as always-present strings, and repeating the raw error 3 times instead of
handling it once).

### Fix

- **`src/hooks/useWeather.ts`** - stopped relying on the geocoder's
  `timezone` entirely. The forecast API accepts `timezone=auto` and resolves
  the correct zone from lat/lon server-side (confirmed via
  `curl ".../forecast?latitude=72&longitude=-40&timezone=auto&..."` ->
  correctly returned `"timezone":"America/Nuuk"`). This closes off the whole
  bug class, not just this one location - any geocoding result with a
  missing or wrong timezone now just works.
- **`src/api/geocode.ts`** - `RawGeocodingItem`'s `country`/`admin1`/
  `timezone`/`country_id` are now optional (matching what the API can
  actually return), and `normaliseLocation` falls back `location_country`
  to `''` the same way `location_area` already did, so `undefined` can never
  reach a template literal again.
- **`src/lib/location.ts`** (new) - `formatLocationLabel()` joins
  title/area/country skipping empty parts, so a sparse location renders as
  `"Greenland"` instead of `"Greenland, , "`. Wired into the Search badge,
  the suggestions dropdown, `SelectedDayReport`, and `App.tsx`'s
  `document.title`.
- **Error UI** - `DayPreview` now shows one friendly "Couldn't load the
  weather for this location" message (with a `CloudOff` icon) in place of
  the raw error text; `WeatherDays` and `SelectedDayReport` render nothing
  on error instead of each repeating it. This is general resilience for any
  future fetch failure (network blip, rate limit, etc.), not just this bug.

### Verification

Re-ran the scratch repro after the fix: the Greenland entry now normalises
to `{ timezone: '', location_area: '', location_country: '' }` and the
weather request succeeds (`Success! Days: 7`). Full suite (`tsc -b`,
`eslint`, `vitest`) passing throughout.
