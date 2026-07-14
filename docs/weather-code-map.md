# Weather Code Map

How Open-Meteo's WMO weather codes (`src/api/weatherCodes.ts`) map to the
`DayPreview` mood buckets and background graphics (`src/lib/weatherBackground.ts`).

## Weather code → mood → graphic → icon

| WMO Code | Condition Label | Mood | Day-Preview Graphic | Icon SVG |
| --- | --- | --- | --- | --- |
| 0 | Clear sky | clear | `clear.webp` | `/weather/0.svg` |
| 1 | Mainly clear | clear | `clear.webp` | `/weather/1.svg` |
| 2 | Partly cloudy | partly-cloudy | `partly-cloudy.webp` | `/weather/2.svg` |
| 3 | Overcast | cloudy | `cloudy.webp` | `/weather/3.svg` |
| 45 | Fog | cloudy | `cloudy.webp` | `/weather/45.svg` |
| 48 | Depositing rime fog | cloudy | `cloudy.webp` | `/weather/48.svg` |
| 51 | Light drizzle | rainy | `rainy.webp` | `/weather/51.svg` |
| 53 | Moderate drizzle | rainy | `rainy.webp` | `/weather/53.svg` |
| 55 | Dense drizzle | rainy | `rainy.webp` | `/weather/55.svg` |
| 56 | Light freezing drizzle | stormy | `stormy.webp` | `/weather/56.svg` |
| 57 | Dense freezing drizzle | stormy | `stormy.webp` | `/weather/57.svg` |
| 61 | Slight rain | rainy | `rainy.webp` | `/weather/61.svg` |
| 63 | Moderate rain | rainy | `rainy.webp` | `/weather/63.svg` |
| 65 | Heavy rain | stormy | `stormy.webp` | `/weather/65.svg` |
| 66 | Light freezing rain | stormy | `stormy.webp` | `/weather/66.svg` |
| 67 | Heavy freezing rain | stormy | `stormy.webp` | `/weather/67.svg` |
| 71 | Slight snow fall | snowy | `snowy.webp` | `/weather/71.svg` |
| 73 | Moderate snow fall | snowy | `snowy.webp` | `/weather/73.svg` |
| 75 | Heavy snow fall | snowy | `snowy.webp` | `/weather/75.svg` |
| 77 | Snow grains | snowy | `snowy.webp` | `/weather/77.svg` |
| 80 | Slight rain showers | rainy | `rainy.webp` | `/weather/80.svg` |
| 81 | Moderate rain showers | stormy | `stormy.webp` | `/weather/81.svg` |
| 82 | Violent rain showers | stormy | `stormy.webp` | `/weather/82.svg` |
| 85 | Slight snow showers | snowy | `snowy.webp` | `/weather/71.svg`\* |
| 86 | Heavy snow showers | snowy | `snowy.webp` | `/weather/75.svg`\* |
| 95 | Thunderstorm | stormy | `stormy.webp` | `/weather/95.svg` |
| 96 | Thunderstorm, slight hail | stormy | `stormy.webp` | `/weather/95.svg`\* |
| 99 | Thunderstorm, heavy hail | stormy | `stormy.webp` | `/weather/95.svg`\* |

\* No dedicated icon was downloaded for this code, so `src/api/weatherCodes.ts`
falls back to the closest available icon (85→71, 86→75, 96/99→95).

## Mood → weather codes

| Mood | Graphic | WMO Codes |
| --- | --- | --- |
| clear | `clear.webp` | 0, 1 |
| partly-cloudy | `partly-cloudy.webp` | 2 |
| cloudy | `cloudy.webp` | 3, 45, 48 |
| rainy | `rainy.webp` | 51, 53, 55, 61, 63, 80 |
| snowy | `snowy.webp` | 71, 73, 75, 77, 85, 86 |
| stormy | `stormy.webp` | 56, 57, 65, 66, 67, 81, 82, 95, 96, 99 |
