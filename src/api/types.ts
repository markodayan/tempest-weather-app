export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'ms' | 'mph' | 'kn';
export type PrecipitationUnit = 'mm' | 'inch';

/* Normalised location object, used to drive search suggestions and as input to requestWeather */
export type Location = {
  id: number;
  latitude: number;
  longitude: number;
  timezone: string;
  location_title: string;
  location_area: string;
  location_country: string;
};

export type LocationResults = Location[];

export type WeatherApiValue = string | number | boolean | null;

/* One day in the 7-day window; current-day-only fields are prefixed `current_` */
export type WeatherDay = {
  date: string;
  isToday: boolean;
  [field: string]: WeatherApiValue | undefined;
};

export type WeatherReadings = {
  days: WeatherDay[];
};

export type RequestWeatherOptions = {
  latitude: number;
  longitude: number;
  timezone: string;

  currentFields: string[];
  dailyFields: string[];

  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  precipitationUnit: PrecipitationUnit;
};
