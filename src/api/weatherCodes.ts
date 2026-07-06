import {
  Sun,
  CloudSun,
  Cloudy,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
  CloudHail,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';

export type WeatherCondition = {
  label: string;
  icon: LucideIcon;
};

const WMO_CODES: Record<number, WeatherCondition> = {
  0: { label: 'Clear sky', icon: Sun },
  1: { label: 'Mainly clear', icon: CloudSun },
  2: { label: 'Partly cloudy', icon: CloudSun },
  3: { label: 'Overcast', icon: Cloudy },
  45: { label: 'Fog', icon: CloudFog },
  48: { label: 'Depositing rime fog', icon: CloudFog },
  51: { label: 'Light drizzle', icon: CloudDrizzle },
  53: { label: 'Moderate drizzle', icon: CloudDrizzle },
  55: { label: 'Dense drizzle', icon: CloudDrizzle },
  56: { label: 'Light freezing drizzle', icon: CloudDrizzle },
  57: { label: 'Dense freezing drizzle', icon: CloudDrizzle },
  61: { label: 'Slight rain', icon: CloudRain },
  63: { label: 'Moderate rain', icon: CloudRain },
  65: { label: 'Heavy rain', icon: CloudRainWind },
  66: { label: 'Light freezing rain', icon: CloudRain },
  67: { label: 'Heavy freezing rain', icon: CloudRainWind },
  71: { label: 'Slight snow fall', icon: CloudSnow },
  73: { label: 'Moderate snow fall', icon: CloudSnow },
  75: { label: 'Heavy snow fall', icon: Snowflake },
  77: { label: 'Snow grains', icon: Snowflake },
  80: { label: 'Slight rain showers', icon: CloudRain },
  81: { label: 'Moderate rain showers', icon: CloudRainWind },
  82: { label: 'Violent rain showers', icon: CloudRainWind },
  85: { label: 'Slight snow showers', icon: CloudSnow },
  86: { label: 'Heavy snow showers', icon: Snowflake },
  95: { label: 'Thunderstorm', icon: CloudLightning },
  96: { label: 'Thunderstorm, slight hail', icon: CloudHail },
  99: { label: 'Thunderstorm, heavy hail', icon: CloudHail },
};

export function getWeatherCondition(code: number): WeatherCondition {
  return WMO_CODES[code] ?? { label: 'Unknown', icon: HelpCircle };
}
