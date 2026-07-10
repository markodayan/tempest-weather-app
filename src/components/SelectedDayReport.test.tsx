import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SelectedDayReport from './SelectedDayReport';
import type { Location, WeatherDay, WeatherReadings } from '../api';
import { DEFAULT_PREFERENCES } from '../types';

const testLocation: Location = {
  id: 1,
  latitude: -29.7253,
  longitude: 31.0858,
  timezone: 'Africa/Johannesburg',
  location_title: 'Bantry Bay',
  location_area: 'Western Cape',
  location_country: 'South Africa',
};

function buildDay(overrides: Partial<WeatherDay> = {}): WeatherDay {
  return {
    date: '2026-07-08',
    isToday: false,
    sunrise: '2026-07-08T06:51',
    sunset: '2026-07-08T17:11',
    weather_code: 0,
    temperature_2m_max: 24.7,
    temperature_2m_min: 13.2,
    relative_humidity_2m_max: 94,
    relative_humidity_2m_min: 68,
    wind_speed_10m_max: 26.1,
    wind_direction_10m_dominant: 202,
    precipitation_probability_mean: 40,
    precipitation_sum: 2.4,
    precipitation_hours: 2,
    ...overrides,
  };
}

function buildWeather(selectedDayOverrides: Partial<WeatherDay> = {}): WeatherReadings {
  const days = [0, 1, 2, 3, 4, 5, 6].map((index) =>
    buildDay(index === 3 ? { date: '2026-07-08', isToday: false, ...selectedDayOverrides } : {}),
  );
  return { days };
}

describe('SelectedDayReport', () => {
  it('renders the header with the day label and 3-part location name', () => {
    render(
      <SelectedDayReport
        weather={buildWeather()}
        weatherLocation={testLocation}
        preferences={DEFAULT_PREFERENCES}
        loading={false}
        error={null}
        selectedDayIndex={3}
        onSelectDay={vi.fn()}
      />,
    );

    expect(screen.getByText('Wednesday 8 July')).toBeInTheDocument();
    expect(screen.getByText('Bantry Bay, Western Cape, South Africa')).toBeInTheDocument();
  });

  it('renders each panel with the correct unit suffix per preference', () => {
    render(
      <SelectedDayReport
        weather={buildWeather()}
        weatherLocation={testLocation}
        preferences={{ temperatureUnit: 'fahrenheit', windSpeedUnit: 'mph', precipitationUnit: 'inch' }}
        loading={false}
        error={null}
        selectedDayIndex={3}
        onSelectDay={vi.fn()}
      />,
    );

    expect(screen.getByText('25 °F')).toBeInTheDocument();
    expect(screen.getByText('13 °F')).toBeInTheDocument();
    expect(screen.getByText('06:51')).toBeInTheDocument();
    expect(screen.getByText('17:11')).toBeInTheDocument();
    expect(screen.getByText('94%')).toBeInTheDocument();
    expect(screen.getByText('68%')).toBeInTheDocument();
    expect(screen.getByText('26 mph')).toBeInTheDocument();
    expect(screen.getByText('SSW')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('2.4 in')).toBeInTheDocument();
  });

  it('renders "-" for fields missing from the API response instead of NaN/blank', () => {
    render(
      <SelectedDayReport
        weather={buildWeather({
          temperature_2m_max: null,
          sunrise: null,
          wind_direction_10m_dominant: null,
        })}
        weatherLocation={testLocation}
        preferences={DEFAULT_PREFERENCES}
        loading={false}
        error={null}
        selectedDayIndex={3}
        onSelectDay={vi.fn()}
      />,
    );

    expect(screen.getAllByText('-')).toHaveLength(3);
  });

  it('disables the previous-day button at the start of the window', () => {
    render(
      <SelectedDayReport
        weather={buildWeather()}
        weatherLocation={testLocation}
        preferences={DEFAULT_PREFERENCES}
        loading={false}
        error={null}
        selectedDayIndex={0}
        onSelectDay={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Previous day')).toBeDisabled();
    expect(screen.getByLabelText('Next day')).not.toBeDisabled();
  });

  it('disables the next-day button at the end of the window', () => {
    render(
      <SelectedDayReport
        weather={buildWeather()}
        weatherLocation={testLocation}
        preferences={DEFAULT_PREFERENCES}
        loading={false}
        error={null}
        selectedDayIndex={6}
        onSelectDay={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Next day')).toBeDisabled();
    expect(screen.getByLabelText('Previous day')).not.toBeDisabled();
  });

  it('calls onSelectDay with the adjacent index when an arrow is clicked', async () => {
    const user = userEvent.setup();
    const onSelectDay = vi.fn();

    render(
      <SelectedDayReport
        weather={buildWeather()}
        weatherLocation={testLocation}
        preferences={DEFAULT_PREFERENCES}
        loading={false}
        error={null}
        selectedDayIndex={3}
        onSelectDay={onSelectDay}
      />,
    );

    await user.click(screen.getByLabelText('Next day'));
    expect(onSelectDay).toHaveBeenCalledWith(4);

    await user.click(screen.getByLabelText('Previous day'));
    expect(onSelectDay).toHaveBeenCalledWith(2);
  });

  it('shows a loading message and no report while loading', () => {
    render(
      <SelectedDayReport
        weather={null}
        weatherLocation={testLocation}
        preferences={DEFAULT_PREFERENCES}
        loading={true}
        error={null}
        selectedDayIndex={3}
        onSelectDay={vi.fn()}
      />,
    );

    expect(screen.getByText('Loading weather…')).toBeInTheDocument();
    expect(screen.queryByLabelText('Next day')).not.toBeInTheDocument();
  });

  it('renders nothing on error, leaving the error state to DayPreview', () => {
    const { container } = render(
      <SelectedDayReport
        weather={null}
        weatherLocation={testLocation}
        preferences={DEFAULT_PREFERENCES}
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
      <SelectedDayReport
        weather={null}
        weatherLocation={null}
        preferences={DEFAULT_PREFERENCES}
        loading={false}
        error={null}
        selectedDayIndex={3}
        onSelectDay={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
