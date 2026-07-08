import { useEffect, useState } from 'react';
import { requestWeather } from '../api';
import type { CurrentParamOption, DailyParamOption, Location, WeatherReadings } from '../api';
import type { UnitPreferences } from '../types';

const CURRENT_FIELDS: CurrentParamOption[] = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'precipitation',
  'weather_code',
  'wind_speed_10m',
  'wind_direction_10m',
];

const DAILY_FIELDS: DailyParamOption[] = [
  'sunrise',
  'sunset',
  'weather_code',
  'temperature_2m_min',
  'temperature_2m_max',
  'wind_speed_10m_max',
  'wind_direction_10m_dominant',
  'precipitation_probability_mean',
  'precipitation_sum',
  'precipitation_hours',
  // newly added to work on weather UI
  'apparent_temperature_min',
  'apparent_temperature_max',
  'apparent_temperature_mean',
  'temperature_2m_mean',
  'relative_humidity_2m_min',
  'relative_humidity_2m_max',
];

type UseWeatherResult = {
  weather: WeatherReadings | null;
  loading: boolean;
  error: string | null;
};

function toRequestKey(location: Location, preferences: UnitPreferences): string {
  return [
    location.id,
    preferences.temperatureUnit,
    preferences.windSpeedUnit,
    preferences.precipitationUnit,
  ].join('|');
}

export function useWeather(
  location: Location | null,
  preferences: UnitPreferences,
): UseWeatherResult {
  const [weather, setWeather] = useState<WeatherReadings | null>(null);
  const [error, setError] = useState<string | null>(null);
  // the request key that weather/error currently reflect; while it lags behind the
  // current inputs' key, a request for the new inputs is in flight
  const [resolvedRequestKey, setResolvedRequestKey] = useState<string | null>(null);

  const requestKey = location === null ? null : toRequestKey(location, preferences);
  const loading = requestKey !== null && requestKey !== resolvedRequestKey;

  useEffect(() => {
    if (location === null) {
      return;
    }

    const activeLocation = location;
    const activeRequestKey = toRequestKey(activeLocation, preferences);
    const controller = new AbortController();

    requestWeather(
      {
        latitude: activeLocation.latitude,
        longitude: activeLocation.longitude,
        timezone: activeLocation.timezone,
        currentFields: CURRENT_FIELDS,
        dailyFields: DAILY_FIELDS,
        temperatureUnit: preferences.temperatureUnit,
        windSpeedUnit: preferences.windSpeedUnit,
        precipitationUnit: preferences.precipitationUnit,
      },
      controller.signal,
    )
      .then((result) => {
        if (controller.signal.aborted) return;
        setWeather(result);
        setError(null);
        setResolvedRequestKey(activeRequestKey);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Failed to load weather.');
        setResolvedRequestKey(activeRequestKey);
      });

    return () => {
      controller.abort();
    };
  }, [location, preferences]);

  return { weather, loading, error };
}
