import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TOTAL_DAYS } from '../api';
import type { Location, WeatherReadings } from '../api';
import {
  TEMPERATURE_UNIT_LABELS,
  WIND_SPEED_UNIT_LABELS,
  PRECIPITATION_UNIT_LABELS,
} from '../types';
import type { UnitPreferences } from '../types';
import { formatDayLabelLong, formatDayLabelCompact, formatTimeOfDay } from '../lib/dates';
import { degreesToCompassDirection } from '../lib/wind';
import { formatLocationLabel } from '../lib/location';
import { formatReading } from '../lib/formatReading';
import Skeleton from './Skeleton';

const SKELETON_PANEL_COUNT = 6;

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
    <div className='p-8 w-full xl:w-[calc(50%-4px)] flex flex-col items-center xl:items-start gap-6 rounded-lg bg-bg-selected-day shadow-xl'>
      <h3 className='mb-4 text-2xl text-report-heading/90 font-light xl:ml-3'>{title}</h3>
      <div className='flex gap-10 xl:ml-3'>{children}</div>
    </div>
  );
}

function Reading({ label, value }: { label: string; value: string }) {
  return (
    <div className='text-center space-y-1 xl:space-y-0'>
      <p className='text-sm font-medium uppercase tracking-widest text-report-label/80 xl:pb-2'>
        {label}
      </p>
      <p className='text-2xl xl:text-3xl tracking-tight text-report-reading font-bold'>{value}</p>
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
    return (
      <section
        role='status'
        aria-label='Loading weather'
        className='mx-auto w-full max-w-5xl xl:max-w-7xl px-6 xl:px-0 pb-4 mt-4'
      >
        <div className='flex flex-col gap-y-4 overflow-hidden'>
          <div className='flex items-center gap-4 px-6 py-4 bg-bg-selected-day rounded-lg shadow-xl'>
            <Skeleton className='h-6 w-6 rounded-full' />
            <Skeleton className='h-6 w-6 rounded-full' />
            <Skeleton className='h-5 w-32' />
            <span className='text-slate-300'>|</span>
            <Skeleton className='h-5 w-40' />
          </div>

          <div className='flex flex-wrap gap-2'>
            {Array.from({ length: SKELETON_PANEL_COUNT }).map((_, index) => (
              <div
                key={index}
                className='p-8 w-full xl:w-[calc(50%-4px)] flex flex-col items-center xl:items-start gap-6 rounded-lg bg-bg-selected-day shadow-xl'
              >
                <Skeleton className='h-6 w-36' />
                <div className='flex gap-10'>
                  <div className='space-y-2'>
                    <Skeleton className='h-3 w-16' />
                    <Skeleton className='h-8 w-14' />
                  </div>
                  <div className='space-y-2'>
                    <Skeleton className='h-3 w-16' />
                    <Skeleton className='h-8 w-14' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // DayPreview shows the friendly error state for a failed fetch; avoid repeating it here.
  if (error) {
    return null;
  }

  if (weather === null || weatherLocation === null) {
    return null;
  }

  const day = weather.days[selectedDayIndex];
  const temperatureLabel = TEMPERATURE_UNIT_LABELS[preferences.temperatureUnit];
  const windSpeedLabel = WIND_SPEED_UNIT_LABELS[preferences.windSpeedUnit];
  const precipitationLabel = PRECIPITATION_UNIT_LABELS[preferences.precipitationUnit];

  return (
    <section className='mx-auto w-full max-w-5xl xl:max-w-7xl px-6 xl:px-0 pb-4 mt-4'>
      <div className='flex flex-col gap-y-4 overflow-hidden '>
        <div className='flex items-center gap-4 px-6 py-4 bg-bg-selected-day rounded-lg shadow-xl '>
          <button
            type='button'
            aria-label='Previous day'
            disabled={selectedDayIndex === 0}
            onClick={() => onSelectDay(selectedDayIndex - 1)}
            className='cursor-pointer text-slate-500 transition-colors duration-300 hover:text-primary disabled:pointer-events-none disabled:opacity-30'
          >
            <ChevronLeft className='h-6 w-6' />
          </button>
          <button
            type='button'
            aria-label='Next day'
            disabled={selectedDayIndex === TOTAL_DAYS - 1}
            onClick={() => onSelectDay(selectedDayIndex + 1)}
            className='cursor-pointer text-slate-500 transition-colors duration-300 hover:text-primary disabled:pointer-events-none disabled:opacity-30'
          >
            <ChevronRight className='h-6 w-6' />
          </button>
          <span className='text-lg font-semibold text-slate-800 xl:hidden'>
            {formatDayLabelCompact(day.date, day.isToday)}
          </span>
          <span className='hidden text-lg font-semibold text-slate-800 xl:inline'>
            {formatDayLabelLong(day.date, day.isToday)}
          </span>
          <span className='text-slate-300'>|</span>
          <span className='text-lg text-slate-600 xl:hidden'>{weatherLocation.location_title}</span>
          <span className='hidden text-lg text-slate-600 xl:inline'>
            {formatLocationLabel(weatherLocation)}
          </span>
        </div>

        <div className='flex flex-wrap gap-2'>
          <ReportPanel title='Temperature'>
            <Reading
              label='Daily high'
              value={formatReading(
                day.temperature_2m_max,
                (n) => `${Math.round(n)} ${temperatureLabel}`,
              )}
            />
            <Reading
              label='Daily low'
              value={formatReading(
                day.temperature_2m_min,
                (n) => `${Math.round(n)} ${temperatureLabel}`,
              )}
            />
          </ReportPanel>

          <ReportPanel title='Sunrise and sunset'>
            <Reading
              label='Sunrise'
              value={day.sunrise == null ? '-' : formatTimeOfDay(String(day.sunrise))}
            />
            <Reading
              label='Sunset'
              value={day.sunset == null ? '-' : formatTimeOfDay(String(day.sunset))}
            />
          </ReportPanel>

          <ReportPanel title='Humidity'>
            <Reading
              label='Daily high'
              value={formatReading(day.relative_humidity_2m_max, (n) => `${Math.round(n)}%`)}
            />
            <Reading
              label='Daily low'
              value={formatReading(day.relative_humidity_2m_min, (n) => `${Math.round(n)}%`)}
            />
          </ReportPanel>

          <ReportPanel title='Wind'>
            <Reading
              label='Daily high speed'
              value={formatReading(
                day.wind_speed_10m_max,
                (n) => `${Math.round(n)} ${windSpeedLabel}`,
              )}
            />
            <Reading
              label='Dominant direction'
              value={formatReading(day.wind_direction_10m_dominant, degreesToCompassDirection)}
            />
          </ReportPanel>

          <ReportPanel title='Rain probability'>
            <Reading
              label='Chance of rain'
              value={formatReading(day.precipitation_probability_mean, (n) => `${Math.round(n)}%`)}
            />
          </ReportPanel>

          <ReportPanel title='Rain information'>
            <Reading
              label='Rain hours'
              value={formatReading(day.precipitation_hours, (n) => String(n))}
            />
            <Reading
              label='Rain sum'
              value={formatReading(
                day.precipitation_sum,
                (n) => `${n.toFixed(1)} ${precipitationLabel}`,
              )}
            />
          </ReportPanel>
        </div>
      </div>
    </section>
  );
}
