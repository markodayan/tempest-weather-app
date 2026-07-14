import type { TemperatureUnit } from '../api';

const FAHRENHEIT_FREEZING_POINT = 32;
const FAHRENHEIT_DEGREES_PER_CELSIUS_DEGREE = 9 / 5;

// Bucket boundaries are Celsius regardless of display unit - a "chilly" day shouldn't
// flip to "mild" just because the user's preference is set to Fahrenheit, so a
// Fahrenheit reading is converted back to Celsius before bucketing.
const CELSIUS_UPPER_BOUNDS: [number, string][] = [
  [0, 'Freezing'],
  [8, 'Cold'],
  [13, 'Chilly'],
  [19, 'Temperate'],
  [25, 'Warm'],
  [31, 'Hot'],
];
const HOTTEST_CONDITION = 'Scorching Hot';

export function getTemperatureCondition(value: number, unit: TemperatureUnit): string {
  const celsius =
    unit === 'fahrenheit'
      ? (value - FAHRENHEIT_FREEZING_POINT) / FAHRENHEIT_DEGREES_PER_CELSIUS_DEGREE
      : value;

  const match = CELSIUS_UPPER_BOUNDS.find(([upperBound]) => celsius <= upperBound);
  return match ? match[1] : HOTTEST_CONDITION;
}
