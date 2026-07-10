import { getWeatherCondition } from '../api';
import type { WeatherReadings } from '../api';
import { formatDayLabelShort } from '../lib/dates';

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
    return <p className='mx-auto max-w-5xl px-6 py-3 text-slate-400'>Loading weather…</p>;
  }

  // DayPreview shows the friendly error state for a failed fetch; avoid repeating it here.
  if (error) {
    return null;
  }

  if (weather === null) {
    return null;
  }

  return (
    <div className='mx-auto grid w-full max-w-5xl grid-cols-7 gap-2 px-6 py-3'>
      {weather.days.map((day, index) => {
        const isSelected = index === selectedDayIndex;
        const condition = getWeatherCondition(Number(day.weather_code));

        return (
          <button
            key={day.date}
            type='button'
            onClick={() => onSelectDay(index)}
            aria-current={isSelected}
            className={`flex flex-col items-center gap-1  border-t-4 bg-white px-2 py-3 shadow-sm transition-colors ${
              isSelected ? 'border-primary' : 'border-transparent'
            }`}
          >
            <span className='text-xs font-semibold text-slate-600'>
              {formatDayLabelShort(day.date, day.isToday)}
            </span>
            <img src={condition.iconSrc} alt={condition.label} className='h-6 w-6' />
            <span className='text-sm'>
              <span className='font-semibold text-slate-800'>
                {Math.round(Number(day.temperature_2m_max))}°
              </span>{' '}
              <span className='text-slate-400'>{Math.round(Number(day.temperature_2m_min))}°</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
