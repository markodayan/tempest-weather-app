# Weather Code Map

How Open-Meteo's WMO weather codes (`src/api/weatherCodes.ts`) map to the
`DayPreview` mood buckets and background graphics (`src/lib/weatherBackground.ts`).

## Weather code → mood → graphic

| WMO Code | Condition Label | Mood | Day-Preview Graphic |
| --- | --- | --- | --- |
| 0 | Clear sky | clear | `clear.webp` |
| 1 | Mainly clear | clear | `clear.webp` |
| 2 | Partly cloudy | cloudy | `cloudy.webp` |
| 3 | Overcast | cloudy | `cloudy.webp` |
| 45 | Fog | cloudy | `cloudy.webp` |
| 48 | Depositing rime fog | cloudy | `cloudy.webp` |
| 51 | Light drizzle | rainy | `rainy.webp` |
| 53 | Moderate drizzle | rainy | `rainy.webp` |
| 55 | Dense drizzle | rainy | `rainy.webp` |
| 56 | Light freezing drizzle | stormy | `stormy.webp` |
| 57 | Dense freezing drizzle | stormy | `stormy.webp` |
| 61 | Slight rain | rainy | `rainy.webp` |
| 63 | Moderate rain | rainy | `rainy.webp` |
| 65 | Heavy rain | stormy | `stormy.webp` |
| 66 | Light freezing rain | stormy | `stormy.webp` |
| 67 | Heavy freezing rain | stormy | `stormy.webp` |
| 71 | Slight snow fall | snowy | `snowy.webp` |
| 73 | Moderate snow fall | snowy | `snowy.webp` |
| 75 | Heavy snow fall | snowy | `snowy.webp` |
| 77 | Snow grains | snowy | `snowy.webp` |
| 80 | Slight rain showers | rainy | `rainy.webp` |
| 81 | Moderate rain showers | stormy | `stormy.webp` |
| 82 | Violent rain showers | stormy | `stormy.webp` |
| 85 | Slight snow showers | snowy | `snowy.webp` |
| 86 | Heavy snow showers | snowy | `snowy.webp` |
| 95 | Thunderstorm | stormy | `stormy.webp` |
| 96 | Thunderstorm, slight hail | stormy | `stormy.webp` |
| 99 | Thunderstorm, heavy hail | stormy | `stormy.webp` |

## Mood → weather codes

| Mood | Graphic | WMO Codes |
| --- | --- | --- |
| clear | `clear.webp` | 0, 1 |
| cloudy | `cloudy.webp` | 2, 3, 45, 48 |
| rainy | `rainy.webp` | 51, 53, 55, 61, 63, 80 |
| snowy | `snowy.webp` | 71, 73, 75, 77, 85, 86 |
| stormy | `stormy.webp` | 56, 57, 65, 66, 67, 81, 82, 95, 96, 99 |
