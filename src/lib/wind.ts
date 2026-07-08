const COMPASS_POINTS = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
];

// Open-Meteo's *_direction_dominant fields are degrees (0-360, meteorological
// convention - the direction the wind is blowing FROM). Converts to a 16-point
// compass abbreviation, e.g. 202 -> 'SSW'.
export function degreesToCompassDirection(degrees: number): string {
  const normalizedDegrees = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalizedDegrees / 22.5) % 16;
  return COMPASS_POINTS[index];
}
