import { useState } from 'react';
import type { Location, TemperatureUnit, WindSpeedUnit, PrecipitationUnit } from '../api';

type RadioOption<T extends string> = {
  value: T;
  label: string;
};

type UnitPreferences = {
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  precipitationUnit: PrecipitationUnit;
};

const DEFAULT_PREFERENCES: UnitPreferences = {
  temperatureUnit: 'celsius',
  windSpeedUnit: 'kmh',
  precipitationUnit: 'mm',
};

function preferencesEqual(a: UnitPreferences, b: UnitPreferences): boolean {
  return (
    a.temperatureUnit === b.temperatureUnit &&
    a.windSpeedUnit === b.windSpeedUnit &&
    a.precipitationUnit === b.precipitationUnit
  );
}

const TEMPERATURE_OPTIONS: RadioOption<TemperatureUnit>[] = [
  { value: 'celsius', label: '°C' },
  { value: 'fahrenheit', label: '°F' },
];

const WIND_SPEED_OPTIONS: RadioOption<WindSpeedUnit>[] = [
  { value: 'kmh', label: 'km/h' },
  { value: 'ms', label: 'm/s' },
  { value: 'mph', label: 'mph' },
  { value: 'kn', label: 'kn' },
];

const PRECIPITATION_OPTIONS: RadioOption<PrecipitationUnit>[] = [
  { value: 'mm', label: 'mm' },
  { value: 'inch', label: 'in' },
];

function UnitRadioGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role='radiogroup' aria-label={legend} className='flex items-center gap-3'>
      <span className='text-xs font-medium text-slate-500'>{legend}</span>
      {options.map((option) => (
        <label
          key={option.value}
          htmlFor={`${name}-${option.value}`}
          className='flex items-center gap-1 text-sm text-slate-600'
        >
          <input
            type='radio'
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className='accent-primary'
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

type PreferencesRowProps = {
  chosenLocation: Location | null;
};

export default function PreferencesRow({ chosenLocation }: PreferencesRowProps) {
  const [draft, setDraft] = useState<UnitPreferences>(DEFAULT_PREFERENCES);
  const [committed, setCommitted] = useState<UnitPreferences>(DEFAULT_PREFERENCES);

  // only worth prompting a refresh once there's an actual location's weather to refresh
  const showApplyButton = chosenLocation !== null && !preferencesEqual(draft, committed);

  function handleApply() {
    setCommitted(draft);
    // TODO: trigger a weather refetch with chosenLocation + committed once useWeather exists
  }

  function handleTemperatureUnitChange(newUnit: TemperatureUnit) {
    setDraft((prev) => ({ ...prev, temperatureUnit: newUnit }));
  }

  function handleWindSpeedUnitChange(newUnit: WindSpeedUnit) {
    setDraft((prev) => ({ ...prev, windSpeedUnit: newUnit }));
  }

  function handlePrecipitationUnitChange(newUnit: PrecipitationUnit) {
    setDraft((prev) => ({ ...prev, precipitationUnit: newUnit }));
  }

  return (
    <div className='mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-8 gap-y-2 px-6 py-3'>
      <UnitRadioGroup
        legend='Temperature'
        name='temperature-unit'
        options={TEMPERATURE_OPTIONS}
        value={draft.temperatureUnit}
        onChange={handleTemperatureUnitChange}
      />
      <UnitRadioGroup
        legend='Wind speed'
        name='wind-speed-unit'
        options={WIND_SPEED_OPTIONS}
        value={draft.windSpeedUnit}
        onChange={handleWindSpeedUnitChange}
      />
      <UnitRadioGroup
        legend='Precipitation'
        name='precipitation-unit'
        options={PRECIPITATION_OPTIONS}
        value={draft.precipitationUnit}
        onChange={handlePrecipitationUnitChange}
      />

      <button
        type='button'
        onClick={handleApply}
        disabled={!showApplyButton}
        aria-hidden={!showApplyButton}
        className={`rounded-full bg-primary px-4 py-1 text-xs font-stretch-condensed font-semibold text-white transition-all ease-out hover:opacity-90 ${
          showApplyButton
            ? 'duration-500 translate-y-0 opacity-100'
            : 'duration-150 -translate-y-1.5 pointer-events-none opacity-0'
        }`}
      >
        Apply and refresh
      </button>
    </div>
  );
}
