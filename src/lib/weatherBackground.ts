export type WeatherMood = 'clear' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';

// Deliberately coarse - lots of WMO codes collapse onto just 6 mood buckets (see
// docs/image-guidelines.md for the image conventions). clear/partly-cloudy/cloudy split dry
// conditions by how grey it is (code 2, "partly cloudy", gets its own bucket rather than folding
// into the fully-overcast "cloudy" image); rainy/snowy are their own buckets since snow reads as
// a genuinely different visual mood from rain, not just "more/less severe"; stormy covers
// anything violent, icy, or a thunderstorm regardless of precipitation type.
const MOOD_BY_CODE: Record<number, WeatherMood> = {
  0: 'clear',
  1: 'clear',
  2: 'partly-cloudy',
  3: 'cloudy',
  45: 'cloudy',
  48: 'cloudy',
  51: 'rainy',
  53: 'rainy',
  55: 'rainy',
  61: 'rainy',
  63: 'rainy',
  80: 'rainy',
  71: 'snowy',
  73: 'snowy',
  75: 'snowy',
  77: 'snowy',
  85: 'snowy',
  86: 'snowy',
  56: 'stormy',
  57: 'stormy',
  65: 'stormy',
  66: 'stormy',
  67: 'stormy',
  81: 'stormy',
  82: 'stormy',
  95: 'stormy',
  96: 'stormy',
  99: 'stormy',
};

// cloudy is the neutral middle bucket, so an unrecognised code defaults there rather than
// to clear (which would misleadingly suggest good weather) or stormy (which would overstate it).
export function getWeatherMood(code: number): WeatherMood {
  return MOOD_BY_CODE[code] ?? 'cloudy';
}

export function getWeatherBackgroundSrc(code: number): string {
  return `/day-preview/${getWeatherMood(code)}.webp`;
}
