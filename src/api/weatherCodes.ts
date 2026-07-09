export type WeatherCondition = {
  label: string;
  iconSrc: string;
};

function iconSrc(code: number): string {
  return `/weather/${code}.svg`;
}

const WMO_CODES: Record<number, WeatherCondition> = {
  0: { label: 'Clear sky', iconSrc: iconSrc(0) },
  1: { label: 'Mainly clear', iconSrc: iconSrc(1) },
  2: { label: 'Partly cloudy', iconSrc: iconSrc(2) },
  3: { label: 'Overcast', iconSrc: iconSrc(3) },
  45: { label: 'Fog', iconSrc: iconSrc(45) },
  48: { label: 'Depositing rime fog', iconSrc: iconSrc(48) },
  51: { label: 'Light drizzle', iconSrc: iconSrc(51) },
  53: { label: 'Moderate drizzle', iconSrc: iconSrc(53) },
  55: { label: 'Dense drizzle', iconSrc: iconSrc(55) },
  56: { label: 'Light freezing drizzle', iconSrc: iconSrc(56) },
  57: { label: 'Dense freezing drizzle', iconSrc: iconSrc(57) },
  61: { label: 'Slight rain', iconSrc: iconSrc(61) },
  63: { label: 'Moderate rain', iconSrc: iconSrc(63) },
  65: { label: 'Heavy rain', iconSrc: iconSrc(65) },
  66: { label: 'Light freezing rain', iconSrc: iconSrc(66) },
  67: { label: 'Heavy freezing rain', iconSrc: iconSrc(67) },
  71: { label: 'Slight snow fall', iconSrc: iconSrc(71) },
  73: { label: 'Moderate snow fall', iconSrc: iconSrc(73) },
  75: { label: 'Heavy snow fall', iconSrc: iconSrc(75) },
  77: { label: 'Snow grains', iconSrc: iconSrc(77) },
  80: { label: 'Slight rain showers', iconSrc: iconSrc(80) },
  81: { label: 'Moderate rain showers', iconSrc: iconSrc(81) },
  82: { label: 'Violent rain showers', iconSrc: iconSrc(82) },
  // no dedicated icon downloaded for these - fall back to the closest available icon
  85: { label: 'Slight snow showers', iconSrc: iconSrc(71) },
  86: { label: 'Heavy snow showers', iconSrc: iconSrc(75) },
  95: { label: 'Thunderstorm', iconSrc: iconSrc(95) },
  96: { label: 'Thunderstorm, slight hail', iconSrc: iconSrc(95) },
  99: { label: 'Thunderstorm, heavy hail', iconSrc: iconSrc(95) },
};

export function getWeatherCondition(code: number): WeatherCondition {
  return WMO_CODES[code] ?? { label: 'Unknown', iconSrc: iconSrc(3) };
}
