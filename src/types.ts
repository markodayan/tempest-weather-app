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
