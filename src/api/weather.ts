import type {
  WeatherApiValue,
  WeatherDay,
  RequestWeatherOptions,
  WeatherReadings,
} from './types';

const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

// components rely on these too (e.g. to index/highlight the default tile)
export const PAST_DAYS = 3;
export const FORECAST_DAYS = 4;
export const TODAY_INDEX = 3;
export const TOTAL_DAYS = 7;

type OpenMeteoTimeSeries = {
  time: string[];
  [field: string]: WeatherApiValue[];
};

type OpenMeteoCurrentWeather = {
  time: string;
  interval?: number;
  [field: string]: WeatherApiValue | undefined;
};

type OpenMeteoForecastResponse = {
  current: OpenMeteoCurrentWeather;
  daily: OpenMeteoTimeSeries;
};

function zipDailyWeather(daily: OpenMeteoTimeSeries): WeatherDay[] {
  const { time, ...dailyFields } = daily;

  const rowCount = time.length;

  for (const [field, values] of Object.entries(dailyFields)) {
    if (!Array.isArray(values) || values.length !== rowCount) {
      throw new Error(`Invalid daily weather data: "${field}" does not match time array length.`);
    }
  }

  return time.map((date, index) => {
    const day: WeatherDay = {
      date,
      isToday: index === TODAY_INDEX,
    };

    for (const [field, values] of Object.entries(dailyFields)) {
      day[field] = values[index];
    }

    return day;
  });
}

function validateSevenDayWindow(days: WeatherDay[]): void {
  if (days.length !== TOTAL_DAYS) {
    throw new Error(`Expected ${TOTAL_DAYS} weather days, but received ${days.length}.`);
  }
}

function getCurrentWeatherFields(
  current: OpenMeteoCurrentWeather,
): Record<string, WeatherApiValue> {
  return Object.fromEntries(
    Object.entries(current)
      .filter((entry): entry is [string, WeatherApiValue] => {
        const [, value] = entry;
        return value !== undefined;
      })
      .map(([field, value]) => [`current_${field}`, value]),
  );
}

function attachCurrentWeatherToToday(
  days: WeatherDay[],
  current: OpenMeteoCurrentWeather,
): WeatherDay[] {
  const currentFields = getCurrentWeatherFields(current);

  return days.map((day, index) => {
    if (index !== TODAY_INDEX) {
      return day;
    }

    return {
      ...day,
      ...currentFields,
    };
  });
}

export async function requestWeather({
  latitude,
  longitude,
  timezone,
  currentFields,
  dailyFields,
  temperatureUnit,
  windSpeedUnit,
  precipitationUnit,
}: RequestWeatherOptions): Promise<WeatherReadings> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    timezone,
    past_days: String(PAST_DAYS),
    forecast_days: String(FORECAST_DAYS),
    current: currentFields.join(','),
    daily: dailyFields.join(','),
    temperature_unit: temperatureUnit,
    wind_speed_unit: windSpeedUnit,
    precipitation_unit: precipitationUnit,
  });

  let res: Response;

  try {
    res = await fetch(`${FORECAST_BASE_URL}?${params.toString()}`);
  } catch (err) {
    throw new Error('Network error while requesting weather forecast.', {
      cause: err,
    });
  }

  if (!res.ok) {
    throw new Error(`Forecast API request failed with status ${res.status}.`);
  }

  const data = (await res.json()) as OpenMeteoForecastResponse;

  const dailyDays = zipDailyWeather(data.daily);

  validateSevenDayWindow(dailyDays);

  const days = attachCurrentWeatherToToday(dailyDays, data.current);

  return {
    days,
  };
}
