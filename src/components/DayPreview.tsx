import { Thermometer, Droplets, Wind, CloudOff } from 'lucide-react';
import { getWeatherCondition } from '../api';
import type { Location, WeatherReadings } from '../api';
import { TEMPERATURE_UNIT_LABELS, WIND_SPEED_UNIT_LABELS } from '../types';
import type { UnitPreferences } from '../types';
import { formatWeekdayLabel } from '../lib/dates';
import { getWeatherBackgroundSrc } from '../lib/weatherBackground';

type DayPreviewProps = {
  weather: WeatherReadings | null;
  weatherLocation: Location | null;
  preferences: UnitPreferences;
  loading: boolean;
  error: string | null;
  selectedDayIndex: number;
};

function InfoPill({
  icon: Icon,
  children,
}: {
  icon: typeof Thermometer;
  children: React.ReactNode;
}) {
  return (
    <span className='flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs xl:text-sm text-white backdrop-blur-sm'>
      <Icon className='h-4 w-4' />
      {children}
    </span>
  );
}

export default function DayPreview({
  weather,
  weatherLocation,
  preferences,
  loading,
  error,
  selectedDayIndex,
}: DayPreviewProps) {
  if (loading) {
    return (
      <p className='mx-auto max-w-5xl xl:max-w-7xl px-6 xl:px-0 py-3 text-slate-400'>
        Loading weather…
      </p>
    );
  }

  if (error) {
    return (
      <div className='mx-auto w-full max-w-5xl xl:max-w-7xl px-6 xl:px-0 py-4'>
        <div className='flex flex-col items-center justify-center gap-2 rounded-md bg-slate-100 py-10 text-center'>
          <CloudOff className='h-8 w-8 text-slate-400' />
          <p className='font-semibold text-slate-600'>Couldn&rsquo;t load the weather for this location.</p>
          <p className='text-sm text-slate-400'>Try searching for it again, or pick a different location.</p>
        </div>
      </div>
    );
  }

  if (weather === null || weatherLocation === null) {
    return null;
  }

  const day = weather.days[selectedDayIndex];
  const condition = getWeatherCondition(Number(day.weather_code));
  const backgroundSrc = getWeatherBackgroundSrc(Number(day.weather_code));
  const temperatureLabel = TEMPERATURE_UNIT_LABELS[preferences.temperatureUnit];
  const windSpeedLabel = WIND_SPEED_UNIT_LABELS[preferences.windSpeedUnit];

  // Today's data is fresher/live (current conditions), vs. a forecast/history day - the two
  // branches render identically for now, but exist so today-specific content (e.g. freshness,
  // day/night indication) has somewhere to go without reworking the non-today branch too.
  if (day.isToday) {
    return (
      <div className='mx-auto w-full max-w-5xl xl:max-w-7xl px-6 xl:px-0 py-4'>
        <div className='group relative xl:aspect-5/1 overflow-hidden rounded-md'>
          <img
            src={backgroundSrc}
            alt=''
            className='absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent' />

          <div className='relative flex h-full flex-col justify-between p-6'>
            <div className='flex items-center justify-between relative'>
              <div>
                <p className='text-sm font-bold uppercase tracking-wide text-white/80'>
                  {formatWeekdayLabel(day.date, day.isToday)}
                </p>
                <p className='text-5xl xl:text-7xl font-bold text-white'>
                  {Math.round(Number(day.temperature_2m_mean))}
                  {temperatureLabel}
                </p>
                <p className='mt-1 xl:text-2xl font-semibold text-white/90'>{condition.label}</p>
              </div>

              <div className='text-right relative top-[-20px] right-[4px]'>
                <p className='text-2xl xl:text-7xl font-bold text-white'>
                  {weatherLocation.location_title}
                </p>
                <p className='text-sm xl:text-2xl text-white/80'>
                  {weatherLocation.location_country}
                </p>
              </div>
            </div>

            <div className='flex flex-wrap gap-2'>
              <InfoPill icon={Thermometer}>
                Feels like {Math.round(Number(day.apparent_temperature_mean))}°
              </InfoPill>
              <InfoPill icon={Droplets}>
                Rain {Math.round(Number(day.precipitation_probability_mean))}%
              </InfoPill>
              <InfoPill icon={Wind}>
                Max wind speed {Math.round(Number(day.wind_speed_10m_max))}
                {windSpeedLabel}
              </InfoPill>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto w-full max-w-5xl xl:max-w-7xl px-6 xl:px-0 py-4'>
      <div className='group relative xl:aspect-5/1 overflow-hidden rounded-md'>
        <img
          src={backgroundSrc}
          alt=''
          className='absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent' />

        <div className='relative flex h-full flex-col justify-between p-6'>
          <div className='flex items-center justify-between relative'>
            <div>
              <p className='text-sm font-bold uppercase tracking-wide text-white/80'>
                {formatWeekdayLabel(day.date, day.isToday)}
              </p>
              <p className='text-5xl xl:text-7xl font-bold text-white'>
                {Math.round(Number(day.temperature_2m_mean))}
                {temperatureLabel}
              </p>
              <p className='mt-1 xl:text-2xl font-semibold text-white/90'>{condition.label}</p>
            </div>

            <div className='text-right relative top-[-20px] right-[4px]'>
              <p className='text-2xl xl:text-7xl font-bold text-white'>
                {weatherLocation.location_title}
              </p>
              <p className='text-sm xl:text-2xl text-white/80'>
                {weatherLocation.location_country}
              </p>
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            <InfoPill icon={Thermometer}>
              Feels like {Math.round(Number(day.apparent_temperature_mean))}°
            </InfoPill>
            <InfoPill icon={Droplets}>
              Rain {Math.round(Number(day.precipitation_probability_mean))}%
            </InfoPill>
            <InfoPill icon={Wind}>
              Max wind speed {Math.round(Number(day.wind_speed_10m_max))}
              {windSpeedLabel}
            </InfoPill>
          </div>
        </div>
      </div>
    </div>
  );
}
