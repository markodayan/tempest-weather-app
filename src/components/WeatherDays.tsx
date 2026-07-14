import { useEffect, useRef } from 'react';
import { getWeatherCondition } from '../api';
import type { WeatherReadings } from '../api';
import { formatDayLabelShort, formatDayLabelCompact } from '../lib/dates';
import Skeleton from './Skeleton';

const SKELETON_TILE_COUNT = 7;

type WeatherDaysProps = {
  weather: WeatherReadings | null;
  loading: boolean;
  error: string | null;
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
};

export default function WeatherDays({
  weather,
  loading,
  error,
  selectedDayIndex,
  onSelectDay,
}: WeatherDaysProps) {
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // First centering (initial load/location switch) snaps instantly; every subsequent
  // one (a tile click) animates, since the user can see the row move that time.
  const hasCenteredOnceRef = useRef(false);

  useEffect(() => {
    const tile = tileRefs.current[selectedDayIndex];
    if (!tile) return;

    tile.scrollIntoView({
      behavior: hasCenteredOnceRef.current ? 'smooth' : 'auto',
      inline: 'center',
      block: 'nearest',
    });
    hasCenteredOnceRef.current = true;
  }, [selectedDayIndex, weather]);

  if (loading) {
    return (
      <section
        role='status'
        aria-label='Loading weather'
        className='flex gap-2 mx-auto max-w-5xl xl:max-w-7xl px-6 xl:px-0 mb-1'
      >
        {Array.from({ length: SKELETON_TILE_COUNT }).map((_, index) => (
          <div
            key={index}
            className='flex flex-1 min-w-0 flex-col items-center gap-2 py-day-card-py rounded-lg shadow-xl bg-bg-not-selected-day'
          >
            <Skeleton className='h-5 w-12 max-w-full' />
            <Skeleton className='size-day-card-icon max-w-full rounded-full' />
            <Skeleton className='h-5 w-16 max-w-full' />
          </div>
        ))}
      </section>
    );
  }

  // DayPreview shows the friendly error state for a failed fetch; avoid repeating it here.
  if (error) {
    return null;
  }

  if (weather === null) {
    return null;
  }

  return (
    <div className='mx-auto max-w-5xl xl:max-w-7xl px-6 xl:px-0 pb-2'>
      <section className='flex gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mb-2 md:mb-0'>
        {weather.days.map((day, index) => {
          const isSelected = index === selectedDayIndex;
          const condition = getWeatherCondition(Number(day.weather_code));

          return (
            <button
              key={day.date}
              ref={(el) => {
                tileRefs.current[index] = el;
              }}
              type='button'
              onClick={() => onSelectDay(index)}
              aria-current={isSelected}
              className={`flex shrink-0 w-day-card-frozen-width md:w-auto md:flex-1 flex-col cursor-pointer items-center py-day-card-py transition-colors duration-300 rounded-lg shadow-xl ${
                isSelected ? 'bg-[#e0e0f1]' : 'bg-bg-selected-day hover:bg-bg-selected-day'
              }`}
            >
              {/* Full date from md up ("Fri 10 Jul"); below md the row is frozen/scrollable
                  so the compact form ("Fri 10") is swapped in instead - a content change,
                  not a size change, so it toggles at the md breakpoint rather than scaling. */}
              <span
                className={`hidden md:block text-day-card-label font-light ${isSelected ? 'text-selected-date' : 'text-slate-400'}`}
              >
                {formatDayLabelShort(day.date, day.isToday)}
              </span>
              <span
                className={`block md:hidden text-day-card-label font-light ${isSelected ? 'text-selected-date' : 'text-slate-400'}`}
              >
                {formatDayLabelCompact(day.date, day.isToday)}
              </span>
              <img
                src={condition.iconSrc}
                alt={condition.label}
                className='block size-day-card-icon'
              />
              <span className='flex items-center gap-2 text-sm'>
                <span className='font-bold text-day-card-temp-max'>
                  {Math.round(Number(day.temperature_2m_max))}°
                </span>
                <span className='text-slate-400'>
                  {Math.round(Number(day.temperature_2m_min))}°
                </span>
              </span>
            </button>
          );
        })}
      </section>
    </div>
  );
}
