import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import WeatherDays from './WeatherDays';
import type { WeatherDay, WeatherReadings } from '../api';

const DAY_DATES = [
  '2026-07-06',
  '2026-07-07',
  '2026-07-08',
  '2026-07-09',
  '2026-07-10',
  '2026-07-11',
  '2026-07-12',
];

function buildWeather(): WeatherReadings {
  const days: WeatherDay[] = DAY_DATES.map((date, index) => ({
    date,
    isToday: index === 3,
    weather_code: 0,
    temperature_2m_max: 24 - index,
    temperature_2m_min: 15 - index,
  }));

  return { days };
}

describe('WeatherDays', () => {
  it('renders a tile per day with its label and rounded high/low temperatures', () => {
    render(
      <WeatherDays
        weather={buildWeather()}
        loading={false}
        error={null}
        selectedDayIndex={3}
        onSelectDay={vi.fn()}
      />,
    );

    expect(screen.getAllByRole('button')).toHaveLength(7);
    // Both the mobile-compact and desktop-full labels render at once (toggled via CSS
    // breakpoints, not conditional rendering), so "Today" matches both of that tile's spans.
    expect(screen.getAllByText('Today')).toHaveLength(2);
    expect(screen.getByText('Fri 10')).toBeInTheDocument();
    expect(screen.getByText('Fri 10 Jul')).toBeInTheDocument();
    expect(screen.getByText('24°')).toBeInTheDocument();
    expect(screen.getByText('15°')).toBeInTheDocument();
  });

  it('marks only the tile matching selectedDayIndex as current', () => {
    render(
      <WeatherDays
        weather={buildWeather()}
        loading={false}
        error={null}
        selectedDayIndex={3}
        onSelectDay={vi.fn()}
      />,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons[3]).toHaveAttribute('aria-current', 'true');
    expect(buttons[0]).toHaveAttribute('aria-current', 'false');
  });

  it('calls onSelectDay with the clicked day index', async () => {
    const user = userEvent.setup();
    const onSelectDay = vi.fn();

    render(
      <WeatherDays
        weather={buildWeather()}
        loading={false}
        error={null}
        selectedDayIndex={3}
        onSelectDay={onSelectDay}
      />,
    );

    await user.click(screen.getAllByRole('button')[5]);

    expect(onSelectDay).toHaveBeenCalledWith(5);
  });

  it('shows a loading message and no tiles while loading', () => {
    render(
      <WeatherDays weather={null} loading={true} error={null} selectedDayIndex={3} onSelectDay={vi.fn()} />,
    );

    expect(screen.getByText('Loading weather…')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders nothing on error, leaving the error state to DayPreview', () => {
    const { container } = render(
      <WeatherDays
        weather={null}
        loading={false}
        error='Forecast API request failed with status 500.'
        selectedDayIndex={3}
        onSelectDay={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when there is no weather yet and nothing is loading or errored', () => {
    const { container } = render(
      <WeatherDays weather={null} loading={false} error={null} selectedDayIndex={3} onSelectDay={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
