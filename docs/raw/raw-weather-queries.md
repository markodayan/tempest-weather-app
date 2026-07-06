# Weather API Requests and Responses and Desired Tempest Normalisation

> These queries will fetch the past 3 days, current day, and next 3 days weather data for a given location (uses latitude, longitude, and timezone as main params). There are also params requesting daily time-series for the 7 days as well as fields to request for the current day.

### Example 1: Alaska

Request:

```
https://api.open-meteo.com/v1/forecast?latitude=61.21806&longitude=-149.90028&timezone=America/Anchorage&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,wind_speed_10m_max,wind_direction_10m_dominant,precipitation_probability_mean,precipitation_sum,precipitation_hours&past_days=3&forecast_days=4&precipitation_unit=inch&temperature_unit=fahrenheit&wind_speed_unit=mph
```

Response:

```json
{
  "latitude": 61.265377,
  "longitude": -149.92735,
  "generationtime_ms": 1.9736289978027344,
  "utc_offset_seconds": -28800,
  "timezone": "America/Anchorage",
  "timezone_abbreviation": "GMT-8",
  "elevation": 34.0,
  "current_units": {
    "time": "iso8601",
    "interval": "seconds",
    "temperature_2m": "°F",
    "relative_humidity_2m": "%",
    "apparent_temperature": "°F",
    "is_day": "",
    "precipitation": "inch",
    "weather_code": "wmo code",
    "wind_speed_10m": "mp/h",
    "wind_direction_10m": "°"
  },
  "current": {
    "time": "2026-07-06T03:00",
    "interval": 900,
    "temperature_2m": 51.2,
    "relative_humidity_2m": 92,
    "apparent_temperature": 50.7,
    "is_day": 0,
    "precipitation": 0.0,
    "weather_code": 1,
    "wind_speed_10m": 0.5,
    "wind_direction_10m": 76
  },
  "daily_units": {
    "time": "iso8601",
    "weather_code": "wmo code",
    "temperature_2m_max": "°F",
    "temperature_2m_min": "°F",
    "sunrise": "iso8601",
    "sunset": "iso8601",
    "wind_speed_10m_max": "mp/h",
    "wind_direction_10m_dominant": "°",
    "precipitation_probability_mean": "%",
    "precipitation_sum": "inch",
    "precipitation_hours": "h"
  },
  "daily": {
    "time": [
      "2026-07-03",
      "2026-07-04",
      "2026-07-05",
      "2026-07-06",
      "2026-07-07",
      "2026-07-08",
      "2026-07-09"
    ],
    "weather_code": [3, 53, 51, 3, 3, 51, 51],
    "temperature_2m_max": [64.5, 59.0, 64.4, 68.2, 71.7, 63.2, 66.3],
    "temperature_2m_min": [53.3, 50.6, 51.1, 48.7, 54.1, 55.4, 47.0],
    "sunrise": [
      "2026-07-03T04:30",
      "2026-07-04T04:31",
      "2026-07-05T04:33",
      "2026-07-06T04:34",
      "2026-07-07T04:36",
      "2026-07-08T04:38",
      "2026-07-09T04:40"
    ],
    "sunset": [
      "2026-07-03T23:37",
      "2026-07-04T23:36",
      "2026-07-05T23:35",
      "2026-07-06T23:34",
      "2026-07-07T23:32",
      "2026-07-08T23:31",
      "2026-07-09T23:29"
    ],
    "wind_speed_10m_max": [11.2, 11.1, 9.8, 7.3, 12.4, 8.4, 7.5],
    "wind_direction_10m_dominant": [216, 267, 228, 201, 183, 259, 206],
    "precipitation_probability_mean": [2, 70, 30, 4, 3, 17, 19],
    "precipitation_sum": [0.0, 0.291, 0.047, 0.0, 0.0, 0.071, 0.012],
    "precipitation_hours": [0.0, 20.0, 6.0, 0.0, 0.0, 8.0, 3.0]
  }
}
```

## Normalisation of Weather API Response
