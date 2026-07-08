export { geocodeLocation } from './geocode';
export { requestWeather, PAST_DAYS, FORECAST_DAYS, TODAY_INDEX, TOTAL_DAYS } from './weather';
export { getWeatherCondition } from './weatherCodes';

export type {
  Location,
  LocationResults,
  WeatherApiValue,
  WeatherDay,
  WeatherReadings,
  RequestWeatherOptions,
  CurrentParamOption,
  DailyParamOption,
  TemperatureUnit,
  WindSpeedUnit,
  PrecipitationUnit,
} from './types';
export type { WeatherCondition } from './weatherCodes';
