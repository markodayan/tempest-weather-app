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
            <Skeleton className='h-[clamp(2.5rem,2rem_+_2.5vw,4rem)] w-[clamp(2.5rem,2rem_+_2.5vw,4rem)] rounded-full xl:h-[clamp(3.5rem,3rem_+_2.5vw,5rem)] xl:w-[clamp(3.5rem,3rem_+_2.5vw,5rem)]' />
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
    <section className='grid grid-cols-2 gap-2 mx-auto max-w-5xl xl:max-w-7xl px-6 xl:px-0 xl:flex xl:justify-between xl:gap-x-2 mb-1'>
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
            className={`flex flex-col min-w-[84px] cursor-pointer rounded-lg shadow-lg  w-full items-center px-2 py-5 transition-colors duration-300 ${
              isUnpaired ? 'col-span-2' : ''
            } ${isSelected ? 'bg-bg-selected-day' : 'bg-bg-not-selected-day hover:bg-bg-selected-day'}`}
          >
            <span className='text-lg font-bold text-day-card-date xl:hidden'>
              {formatDayLabelCompact(day.date, day.isToday)}
            </span>
            <span className='hidden text-lg font-bold text-day-card-date xl:inline'>
              {formatDayLabelShort(day.date, day.isToday)}
            </span>
            <img
              src={condition.iconSrc}
              alt={condition.label}
              className='block h-[clamp(2.5rem,2rem_+_2.5vw,4rem)] w-[clamp(2.5rem,2rem_+_2.5vw,4rem)] xl:h-[clamp(3.5rem,3rem_+_2.5vw,5rem)] xl:w-[clamp(3.5rem,3rem_+_2.5vw,5rem)]'
            />
            <span className='flex flex-col items-center gap-0 text-lg xl:flex-row xl:gap-6'>
              <span className='font-bold text-day-card-temp-max'>
                {Math.round(Number(day.temperature_2m_max))}°
              </span>
              <span className='text-slate-400'>{Math.round(Number(day.temperature_2m_min))}°</span>
            </span>
          </button>
        );
      })}
    </section>
  );
}
