import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DayPreview from './DayPreview';
import type { WeatherDay, WeatherReadings } from '../api';
import { DEFAULT_PREFERENCES } from '../types';

function buildWeather(dayOverrides: Partial<WeatherDay> = {}): WeatherReadings {
  const selectedDay: WeatherDay = {
    date: '2026-07-10',
    isToday: false,
    weather_code: 2,
    temperature_2m_mean: 21.3,
    apparent_temperature_mean: 19.6,
    precipitation_probability_mean: 50,
    wind_speed_10m_max: 15.4,
    ...dayOverrides,
  };

  return { days: [selectedDay, selectedDay, selectedDay, selectedDay, selectedDay, selectedDay, selectedDay] };
}

describe('DayPreview', () => {
  it('renders the weekday, big temperature, condition label, and info pills', () => {
    render(
      <DayPreview
        weather={buildWeather()}
        preferences={DEFAULT_PREFERENCES}
        loading={false}
        error={null}
        selectedDayIndex={0}
      />,
    );

    expect(screen.getByText('Friday')).toBeInTheDocument();
    expect(screen.getByText('21°C')).toBeInTheDocument();
    expect(screen.getByText('Partly cloudy')).toBeInTheDocument();
    expect(screen.getByText('Feels like 20°')).toBeInTheDocument();
    expect(screen.getByText('Rain 50%')).toBeInTheDocument();
    expect(screen.getByText('Max wind speed 15km/h')).toBeInTheDocument();
  });

  it('shows "Today" instead of the weekday when the selected day is today', () => {
    render(
      <DayPreview
        weather={buildWeather({ isToday: true })}
        preferences={DEFAULT_PREFERENCES}
        loading={false}
        error={null}
        selectedDayIndex={0}
      />,
    );

    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('shows a loading message while loading', () => {
    render(
      <DayPreview weather={null} preferences={DEFAULT_PREFERENCES} loading={true} error={null} selectedDayIndex={0} />,
    );

    expect(screen.getByText('Loading weather…')).toBeInTheDocument();
  });

  it('shows the error message on error', () => {
    render(
      <DayPreview
        weather={null}
        preferences={DEFAULT_PREFERENCES}
        loading={false}
        error='Forecast API request failed with status 500.'
        selectedDayIndex={0}
      />,
    );

    expect(screen.getByText('Forecast API request failed with status 500.')).toBeInTheDocument();
  });

  it('renders nothing when there is no weather yet and nothing is loading or errored', () => {
    const { container } = render(
      <DayPreview weather={null} preferences={DEFAULT_PREFERENCES} loading={false} error={null} selectedDayIndex={0} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
