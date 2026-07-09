import { ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import { TOTAL_DAYS } from '../api';
import type { Location, WeatherReadings } from '../api';
import {
  TEMPERATURE_UNIT_LABELS,
  WIND_SPEED_UNIT_LABELS,
  PRECIPITATION_UNIT_LABELS,
} from '../types';
import type { UnitPreferences } from '../types';
import { formatDayLabelLong, formatTimeOfDay } from '../lib/dates';
import { degreesToCompassDirection } from '../lib/wind';

type SelectedDayReportProps = {
  weather: WeatherReadings | null;
  weatherLocation: Location | null;
  preferences: UnitPreferences;
  loading: boolean;
  error: string | null;
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
};

function ReportPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className='p-8'>
      <h3 className='mb-4 text-lg font-bold text-slate-700'>{title}</h3>
      <div className='flex gap-10'>{children}</div>
    </div>
  );
}

function Reading({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className='text-xs font-medium uppercase tracking-wide text-slate-400'>{label}</p>
      <p className='text-4xl font-bold text-slate-800'>{value}</p>
    </div>
  );
}

export default function SelectedDayReport({
  weather,
  weatherLocation,
  preferences,
  loading,
  error,
  selectedDayIndex,
  onSelectDay,
}: SelectedDayReportProps) {
  if (loading) {
    return <p className='mx-auto max-w-5xl px-6 py-3 text-slate-400'>Loading weather…</p>;
  }

  if (error) {
    return <p className='mx-auto max-w-5xl px-6 py-3 text-red-500'>{error}</p>;
  }

  if (weather === null || weatherLocation === null) {
    return null;
  }

  const day = weather.days[selectedDayIndex];
  const temperatureLabel = TEMPERATURE_UNIT_LABELS[preferences.temperatureUnit];
  const windSpeedLabel = WIND_SPEED_UNIT_LABELS[preferences.windSpeedUnit];
  const precipitationLabel = PRECIPITATION_UNIT_LABELS[preferences.precipitationUnit];
  const windDirectionDegrees = Number(day.wind_direction_10m_dominant);

  return (
    <div className='mx-auto w-full max-w-5xl px-6 py-4'>
      <div className='overflow-hidden  bg-white shadow-sm'>
        <div className='flex items-center gap-4 border-t-4 border-primary px-6 py-4'>
          <button
            type='button'
            aria-label='Previous day'
            disabled={selectedDayIndex === 0}
            onClick={() => onSelectDay(selectedDayIndex - 1)}
            className='text-slate-500 disabled:opacity-30'
          >
            <ChevronLeft className='h-6 w-6' />
          </button>
          <button
            type='button'
            aria-label='Next day'
            disabled={selectedDayIndex === TOTAL_DAYS - 1}
            onClick={() => onSelectDay(selectedDayIndex + 1)}
            className='text-slate-500 disabled:opacity-30'
          >
            <ChevronRight className='h-6 w-6' />
          </button>
          <span className='text-lg font-semibold text-slate-800'>
            {formatDayLabelLong(day.date, day.isToday)}
          </span>
          <span className='text-slate-300'>|</span>
          <span className='text-lg text-slate-600'>
            {weatherLocation.location_title}, {weatherLocation.location_area},{' '}
            {weatherLocation.location_country}
          </span>
        </div>

        <div className='grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0'>
          <ReportPanel title='Temperature'>
            <Reading
              label='Daily high'
              value={`${Math.round(Number(day.temperature_2m_max))}${temperatureLabel}`}
            />
            <Reading
              label='Daily low'
              value={`${Math.round(Number(day.temperature_2m_min))}${temperatureLabel}`}
            />
          </ReportPanel>

          <ReportPanel title='Sunrise and sunset'>
            <Reading label='Sunrise' value={formatTimeOfDay(String(day.sunrise))} />
            <Reading label='Sunset' value={formatTimeOfDay(String(day.sunset))} />
          </ReportPanel>

          <ReportPanel title='Humidity'>
            <Reading
              label='Daily high'
              value={`${Math.round(Number(day.relative_humidity_2m_max))}%`}
            />
            <Reading
              label='Daily low'
              value={`${Math.round(Number(day.relative_humidity_2m_min))}%`}
            />
          </ReportPanel>

          <ReportPanel title='Wind'>
            <Reading
              label='Daily highest speed'
              value={`${Math.round(Number(day.wind_speed_10m_max))}${windSpeedLabel}`}
            />
            <div>
              <p className='text-xs font-medium uppercase tracking-wide text-slate-400'>
                Dominant direction
              </p>
              <p className='flex items-center gap-2 text-4xl font-bold text-slate-800'>
                <ArrowUp
                  className='h-7 w-7'
                  style={{ transform: `rotate(${windDirectionDegrees}deg)` }}
                  aria-hidden='true'
                />
                {degreesToCompassDirection(windDirectionDegrees)}
              </p>
            </div>
          </ReportPanel>

          <ReportPanel title='Rain probability'>
            <Reading
              label='Chance of rain'
              value={`${Math.round(Number(day.precipitation_probability_mean))}%`}
            />
          </ReportPanel>

          <ReportPanel title='Rain information'>
            <Reading label='Rain hours' value={String(Number(day.precipitation_hours))} />
            <Reading
              label='Rain sum'
              value={`${Number(day.precipitation_sum).toFixed(1)}${precipitationLabel}`}
            />
          </ReportPanel>
        </div>
      </div>
    </div>
  );
}
