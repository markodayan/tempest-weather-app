const MISSING_VALUE_PLACEHOLDER = '-';

// Open-Meteo's daily fields aren't guaranteed present for every location/date (WeatherDay
// types every field as possibly null/undefined) - this renders a consistent "-" instead of
// letting a missing value leak into the UI as "NaN" or a blank string.
export function formatReading(
  value: string | number | boolean | null | undefined,
  format: (value: number) => string,
): string {
  if (value === null || value === undefined) {
    return MISSING_VALUE_PLACEHOLDER;
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return MISSING_VALUE_PLACEHOLDER;
  }

  return format(numericValue);
}
