import { useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
    <div className='flex w-full flex-col items-start gap-1.5 xl:w-auto xl:flex-row xl:items-center xl:gap-3'>
      <span className='text-sm tracking-tighter xl:tracking-normal font-medium text-slate-500'>
        {legend}
      </span>
      <div
        role='radiogroup'
        aria-label={legend}
        className='flex w-full rounded-sm bg-non-active-pref-bg xl:w-auto xl:p-0.5'
      >
        {options.map((option) => {
          const isActive = value === option.value;

          return (
            <label
              key={option.value}
              htmlFor={`${name}-${option.value}`}
              className={`flex-1 cursor-pointer rounded-sm px-3 py-0.5 text-center text-xs font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary xl:flex-none xl:px-4 xl:py-1 xl:text-sm ${
                isActive ? 'bg-active-pref-bg text-active-pref-text' : 'text-non-active-pref-text'
              }`}
            >
              <input
                type='radio'
                id={`${name}-${option.value}`}
                name={name}
                value={option.value}
                checked={isActive}
                onChange={() => onChange(option.value)}
                className='sr-only'
              />
              {option.label}
            </label>
          );
        })}
      </div>
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
  // collapsed by default below the xl breakpoint, expanded by default at/above it - matches
  // Tailwind's xl: breakpoint (1280px), checked once on mount rather than kept in sync with
  // resizing, since this only needs to set the initial state, not track the viewport live.
  const [isExpanded, setIsExpanded] = useState(
    () => window.matchMedia('(min-width: 1280px)').matches,
  );
  // true once the user has actually clicked the toggle - keeps the open-pulse quiet on
  // desktop's default-expanded initial render, which isn't a user-triggered "open". Real
  // state (not a ref) since it's read during render to compute the pulse className.
  const [hasToggled, setHasToggled] = useState(false);

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
    setIsExpanded(false);
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
    <div>
      <button
        type='button'
        onClick={() => {
          setHasToggled(true);
          setIsExpanded((prev) => !prev);
        }}
        aria-expanded={isExpanded}
        aria-controls='preferences-content'
        className={`flex w-full items-center justify-between gap-2 py-2 pr-4 transition-colors duration-[300ms] hover:text-active-pref-bg ${
          isExpanded ? 'text-active-pref-bg' : 'text-slate-500'
        }`}
      >
        <span
          className={`text-sm font-medium ${isExpanded && hasToggled ? 'animate-pref-text-pulse' : ''}`}
        >
          Manage Unit Preferences
        </span>
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-[300ms] ${isExpanded ? 'rotate-180' : ''} ${isExpanded && hasToggled ? 'animate-pref-text-pulse' : ''}`}
        />
      </button>

      <div
        id='preferences-content'
        className={`grid transition-[grid-template-rows] duration-[300ms] ease-out ${
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className='flex w-full flex-col items-start gap-y-5 overflow-hidden xl:flex-row xl:justify-evenly'>
          <div className='flex-1 flex flex-wrap xl:flex-nowrap gap-x-5 justify-center  items-start xl:items-center xl:justify-between xl:pr-30 gap-y-2 xl:gap-y-0'>
            <UnitRadioGroup
              legend='Temperature'
              name='temperature-unit'
              options={TEMPERATURE_OPTIONS}
              value={draft.temperatureUnit}
              onChange={handleTemperatureUnitChange}
            />

            <UnitRadioGroup
              legend='Rainfall/Snowfall'
              name='precipitation-unit'
              options={PRECIPITATION_OPTIONS}
              value={draft.precipitationUnit}
              onChange={handlePrecipitationUnitChange}
            />

            <UnitRadioGroup
              legend='Wind speed'
              name='wind-speed-unit'
              options={WIND_SPEED_OPTIONS}
              value={draft.windSpeedUnit}
              onChange={handleWindSpeedUnitChange}
            />
          </div>

          <button
            type='button'
            onClick={handleApply}
            disabled={!showApplyButton}
            aria-hidden={!showApplyButton}
            className={`w-full xl:w-auto xl:min-w-56 text-center rounded-sm bg-active-pref-bg px-5 py-2 text-sm font-stretch-condensed font-semibold text-white transition-all ease-out ${
              showApplyButton
                ? 'duration-500 translate-y-0 opacity-100 hover:opacity-90'
                : 'duration-150 -translate-y-1.5 pointer-events-none opacity-0'
            }`}
          >
            {applyButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
