import { getWeatherCondition } from '../api';
import type { WeatherReadings } from '../api';
import { formatDayLabelShort, formatDayLabelCompact, formatDayLabelMini } from '../lib/dates';
import { formatReading } from '../lib/formatReading';
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
  if (loading) {
    return (
      <section
        role='status'
        aria-label='Loading weather'
        className='grid grid-cols-2 gap-2 mx-auto max-w-5xl xl:max-w-7xl px-6 xl:px-0 xl:flex xl:justify-between xl:gap-x-2 mb-1'
      >
        {Array.from({ length: SKELETON_TILE_COUNT }).map((_, index) => (
          <div
            key={index}
            className={`flex flex-col min-w-[84px] rounded-lg shadow-lg w-full items-center gap-2 px-2 py-5 bg-bg-not-selected-day ${
              index === SKELETON_TILE_COUNT - 1 ? 'col-span-2' : ''
            }`}
          >
            <Skeleton className='h-5 w-12' />
            <Skeleton className='size-day-card-icon-min rounded-full sm:size-day-card-icon-sm xl:size-day-card-icon-xl' />
            <Skeleton className='h-5 w-16' />
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
    <div className='mx-auto max-w-5xl xl:max-w-7xl px-6 xl:px-0 mb-1'>
      <section className='grid grid-cols-7 overflow-clip xl:flex xl:justify-between xl:gap-x-0'>
        {weather.days.map((day, index) => {
          const isSelected = index === selectedDayIndex;
          const condition = getWeatherCondition(Number(day.weather_code));
          // 7 days doesn't split evenly into pairs - the odd one out spans both mobile
          // columns instead of sitting alone next to an empty cell. col-span-2 is inert
          // once xl:flex switches the container off grid, so no need to gate it further.
          const isUnpaired = index === weather.days.length - 1;

          return (
            <button
              key={day.date}
              type='button'
              onClick={() => onSelectDay(index)}
              aria-current={isSelected}
              className={`flex flex-col w-[30px] cursor-pointer w-full items-center px-0 py-2 sm:py-5 transition-colors duration-300 rounded-lg ${
                isUnpaired ? '' : ''
              } ${isSelected ? 'bg-bg-selected-day' : ' hover:bg-bg-selected-day'}`}
            >
              {/* Min Width View  */}
              <span
                className={`block text-[9px] font-bold ${isSelected ? 'text-slate-600' : 'text-slate-400'} sm:hidden`}
              >
                {formatDayLabelMini(day.date, day.isToday)}
              </span>
              {/* Medium Width View  */}
              <span
                className={`hidden text-[12px] font-bold ${isSelected ? 'text-slate-600' : 'text-slate-400'} sm:block xl:hidden`}
              >
                {formatDayLabelCompact(day.date, day.isToday)}
              </span>
              {/* Large Width View  */}
              <span
                className={`hidden text-sm font-bold ${isSelected ? 'text-slate-600' : 'text-slate-400'} xl:inline`}
              >
                {formatDayLabelShort(day.date, day.isToday)}
              </span>
              <img
                src={condition.iconSrc}
                alt={condition.label}
                className='block size-day-card-icon-min sm:size-day-card-icon-sm xl:size-day-card-icon-xl'
              />
              <span className='text-[9px] font-bold text-day-card-temp-max/70 sm:hidden'>
                {formatReading(day.temperature_2m_mean, (n) => `${Math.round(n)}°`)}
              </span>
              <span className='hidden items-center gap-0 sm:flex sm:flex-col sm:text-sm xl:flex-row xl:gap-4 xl:text-sm'>
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
