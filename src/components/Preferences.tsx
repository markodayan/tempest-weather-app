import { useLayoutEffect, useRef, useState } from 'react';
import type { TemperatureUnit, WindSpeedUnit, PrecipitationUnit } from '../api';
import type { UnitPreferences } from '../types';
import {
  DEFAULT_PREFERENCES,
  TEMPERATURE_UNIT_LABELS,
  WIND_SPEED_UNIT_LABELS,
  PRECIPITATION_UNIT_LABELS,
} from '../types';

type RadioOption<T extends string> = {
  value: T;
  label: string;
};

function preferencesEqual(a: UnitPreferences, b: UnitPreferences): boolean {
  return (
    a.temperatureUnit === b.temperatureUnit &&
    a.windSpeedUnit === b.windSpeedUnit &&
    a.precipitationUnit === b.precipitationUnit
  );
}

// Builds an ordered RadioOption list from a unit -> label lookup, so the radio groups here
// and SelectedDayReport's unit suffixes share one source of truth for label text (src/types.ts).
function radioOptionsFromLabels<T extends string>(labels: Record<T, string>): RadioOption<T>[] {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
}

// [{ value: 'celsius', label: '°C' }, { value: 'fahrenheit', label: '°F' }]
const TEMPERATURE_OPTIONS = radioOptionsFromLabels(TEMPERATURE_UNIT_LABELS);

// [{ value: 'kmh', label: 'km/h' }, { value: 'ms', label: 'm/s' }, { value: 'mph', label: 'mph' }, { value: 'kn', label: 'kn' }]
const WIND_SPEED_OPTIONS = radioOptionsFromLabels(WIND_SPEED_UNIT_LABELS);

// [{ value: 'mm', label: 'mm' }, { value: 'inch', label: 'in' }]
const PRECIPITATION_OPTIONS = radioOptionsFromLabels(PRECIPITATION_UNIT_LABELS);

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

type PreferencesProps = {
  weatherLocationId: number | null;
  hasSearchSelection: boolean;
  committed: UnitPreferences;
  onCommit: (preferences: UnitPreferences) => void;
};

export default function Preferences({
  weatherLocationId,
  hasSearchSelection,
  committed,
  onCommit,
}: PreferencesProps) {
  // in-progress, editing window
  const [draft, setDraft] = useState<UnitPreferences>(DEFAULT_PREFERENCES);
  const previousWeatherLocationId = useRef<number | null>(null);

  // Whenever the displayed weather location changes to a new location, treat whatever
  // preferences are on-screen right now as already "applied" for that fetch, so the
  // Apply button doesn't appear immediately just because the user changed a preference
  // before searching.
  useLayoutEffect(() => {
    const isNewWeatherLocation =
      weatherLocationId !== null && weatherLocationId !== previousWeatherLocationId.current;

    if (isNewWeatherLocation) {
      onCommit(draft);
    }

    previousWeatherLocationId.current = weatherLocationId;
  }, [weatherLocationId, draft, onCommit]);

  // only worth prompting a refresh once there's an actual location's weather to refresh
  const showApplyButton = weatherLocationId !== null && !preferencesEqual(draft, committed);

  // reset was hit but old weather is still showing, vs. a search is actively locked in
  const applyButtonLabel = hasSearchSelection ? 'Apply and Refresh' : 'Apply for Current Location';

  function handleApply() {
    onCommit(draft);
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
        className={`min-w-52 text-center rounded-full bg-primary px-4 py-1 text-xs font-stretch-condensed font-semibold text-white transition-all ease-out ${
          showApplyButton
            ? 'duration-500 translate-y-0 opacity-100 hover:opacity-90'
            : 'duration-150 -translate-y-1.5 pointer-events-none opacity-0'
        }`}
      >
        {applyButtonLabel}
      </button>
    </div>
  );
}
