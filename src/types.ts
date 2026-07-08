import type { TemperatureUnit, WindSpeedUnit, PrecipitationUnit } from './api';

/* Shared app-level types used by both API-adjacent code (hooks) and components -
   as opposed to src/api/types.ts, which is scoped to Open-Meteo request/response shapes. */
export type UnitPreferences = {
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  precipitationUnit: PrecipitationUnit;
};

export const DEFAULT_PREFERENCES: UnitPreferences = {
  temperatureUnit: 'celsius',
  windSpeedUnit: 'kmh',
  precipitationUnit: 'mm',
};

// Display suffixes for each unit value, e.g. for SelectedDayReport's readings.
export const TEMPERATURE_UNIT_LABELS: Record<TemperatureUnit, string> = {
  celsius: '°C',
  fahrenheit: '°F',
};

export const WIND_SPEED_UNIT_LABELS: Record<WindSpeedUnit, string> = {
  kmh: 'km/h',
  ms: 'm/s',
  mph: 'mph',
  kn: 'kn',
};

export const PRECIPITATION_UNIT_LABELS: Record<PrecipitationUnit, string> = {
  mm: 'mm',
  inch: 'in',
};
