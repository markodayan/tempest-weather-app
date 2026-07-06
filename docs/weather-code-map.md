# Open-Meteo Weather Code Map

Maps a raw WMO `weather_code` to a `{ label, icon }` pair at render time (components call `getWeatherCondition(code)` — the normalised `WeatherDay` data keeps the raw numeric code, not a baked-in description, so the data layer stays free of display concerns).

Icons are `lucide-react` components (chosen over emoji so icon color/size/stroke can be styled consistently with the rest of the UI, and to avoid font-rendering inconsistency across OS/browsers) — see `src/api/weatherCodes.ts` for the current implementation and code-to-icon mapping.
