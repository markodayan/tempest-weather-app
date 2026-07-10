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
import { formatLocationLabel } from '../lib/location';

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
    <div className='p-8 w-full xl:w-[calc(50%-2px)] flex flex-col gap-6 bg-bg-selected-day '>
      <h3 className='mb-4 text-2xl text-report-heading/90 font-bold'>{title}</h3>
      <div className='flex gap-10'>{children}</div>
    </div>
  );
}

function Reading({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className='text-sm font-bold uppercase tracking-widest text-slate-400'>{label}</p>
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
  const windDirectionDegrees = Number(day.wind_direction_10m_dominant);

  return (
    <section className='mx-auto w-full max-w-5xl xl:max-w-7xl px-6 xl:px-0 pb-4 mt-4'>
      <div className='flex flex-col gap-y-4 overflow-hidden '>
        <div className='flex items-center gap-4 px-6 py-4 bg-bg-selected-day rounded-lg shadow-xl '>
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
          <span className='text-lg text-slate-600'>{formatLocationLabel(weatherLocation)}</span>
        </div>

        <div className='flex flex-wrap gap-1'>
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
              label='Daily high speed'
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
    </section>
  );
}
