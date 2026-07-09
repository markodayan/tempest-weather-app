import { Thermometer, Droplets, Wind } from 'lucide-react';
import { getWeatherCondition } from '../api';
import type { WeatherReadings } from '../api';
import { TEMPERATURE_UNIT_LABELS, WIND_SPEED_UNIT_LABELS } from '../types';
import type { UnitPreferences } from '../types';
import { formatWeekdayLabel } from '../lib/dates';

type DayPreviewProps = {
  weather: WeatherReadings | null;
  preferences: UnitPreferences;
  loading: boolean;
  error: string | null;
  selectedDayIndex: number;
};

function InfoPill({ icon: Icon, children }: { icon: typeof Thermometer; children: React.ReactNode }) {
  return (
    <span className='flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700'>
      <Icon className='h-4 w-4' />
      {children}
    </span>
  );
}

export default function DayPreview({
  weather,
  preferences,
  loading,
  error,
  selectedDayIndex,
}: DayPreviewProps) {
  if (loading) {
    return <p className='mx-auto max-w-5xl px-6 py-3 text-slate-400'>Loading weather…</p>;
  }

  if (error) {
    return <p className='mx-auto max-w-5xl px-6 py-3 text-red-500'>{error}</p>;
  }

  if (weather === null) {
    return null;
  }

  const day = weather.days[selectedDayIndex];
  const condition = getWeatherCondition(Number(day.weather_code));
  const temperatureLabel = TEMPERATURE_UNIT_LABELS[preferences.temperatureUnit];
  const windSpeedLabel = WIND_SPEED_UNIT_LABELS[preferences.windSpeedUnit];

  // Today's data is fresher/live (current conditions), vs. a forecast/history day - the two
  // branches render identically for now, but exist so today-specific content (e.g. freshness,
  // day/night indication) has somewhere to go without reworking the non-today branch too.
  if (day.isToday) {
    return (
      <div className='mx-auto w-full max-w-5xl px-6 py-4'>
        {/* background to be styled later */}
        <div className='p-6'>
          <p className='text-sm font-bold uppercase tracking-wide text-slate-500'>
            {formatWeekdayLabel(day.date, day.isToday)}
          </p>
          <p className='text-7xl font-bold text-slate-800'>
            {Math.round(Number(day.temperature_2m_mean))}
            {temperatureLabel}
          </p>
          <p className='mt-1 text-2xl font-semibold text-slate-700'>{condition.label}</p>

          <div className='mt-4 flex flex-wrap gap-2'>
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
    );
  }

  return (
    <div className='mx-auto w-full max-w-5xl px-6 py-4'>
      {/* background to be styled later */}
      <div className='p-6'>
        <p className='text-sm font-bold uppercase tracking-wide text-slate-500'>
          {formatWeekdayLabel(day.date, day.isToday)}
        </p>
        <p className='text-7xl font-bold text-slate-800'>
          {Math.round(Number(day.temperature_2m_mean))}
          {temperatureLabel}
        </p>
        <p className='mt-1 text-2xl font-semibold text-slate-700'>{condition.label}</p>

        <div className='mt-4 flex flex-wrap gap-2'>
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
  );
}
