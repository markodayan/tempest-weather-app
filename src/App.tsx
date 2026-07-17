import { useCallback, useEffect, useState } from 'react';
import Branding from './components/Branding';
import Search from './components/Search';
import Preferences from './components/Preferences';
import Landing from './components/Landing';
import DayPreview from './components/DayPreview';
import WeatherDays from './components/WeatherDays';
import SelectedDayReport from './components/SelectedDayReport';
import Footer from './components/Footer';
import { useWeather } from './hooks/useWeather';
import type { Location } from './api';
import { TODAY_INDEX } from './api';
import { DEFAULT_PREFERENCES } from './types';
import type { UnitPreferences } from './types';
import { formatLocationLabel } from './lib/location';
import { addToLocationHistory, removeFromLocationHistory } from './lib/locationHistory';

const UNIT_PREFERENCES_STORAGE_KEY = 'unitPreferences';
const LOCATION_HISTORY_STORAGE_KEY = 'locationHistory';

// Guards against a missing, corrupt, or (after some future schema change) incompatible cached
// value - localStorage is an external boundary, so unlike most internal state it can't be
// trusted to always hold well-formed JSON. Falling back to DEFAULT_PREFERENCES keeps a bad
// value from crashing the initial render (there's no error boundary in this app to catch it).
function loadCachedPreferences(): UnitPreferences {
  const cached = localStorage.getItem(UNIT_PREFERENCES_STORAGE_KEY);
  if (!cached) return DEFAULT_PREFERENCES;

  try {
    return JSON.parse(cached) as UnitPreferences;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

// Same rationale as loadCachedPreferences above - localStorage can hold anything, so a missing
// or malformed value falls back to an empty history rather than crashing the initial render.
function loadCachedLocationHistory(): Location[] {
  const cached = localStorage.getItem(LOCATION_HISTORY_STORAGE_KEY);
  if (!cached) return [];

  try {
    return JSON.parse(cached) as Location[];
  } catch {
    return [];
  }
}

function App() {
  // drives Search components badge/disabled-input UI, it gets cleared on reset.
  const [searchSelection, setSearchSelection] = useState<Location | null>(null);
  // the location whose weather is currently displayed; only ever set forward (on select), never nulled by reset
  const [weatherLocation, setWeatherLocation] = useState<Location | null>(null);
  // canonical preferences used to fetch weather; only updated on a new search or an explicit Apply
  const [committed, setCommitted] = useState(loadCachedPreferences);
  // up to MAX_HISTORY_SIZE most-recently-selected locations, most recent first
  const [locationHistory, setLocationHistory] = useState(loadCachedLocationHistory);
  // which of the 7 days in the window is selected; reset to today whenever a new location loads
  const [selectedDayIndex, setSelectedDayIndex] = useState(TODAY_INDEX);
  // tracks weatherLocation as of the last render, purely to detect the change below
  const [previousWeatherLocation, setPreviousWeatherLocation] = useState(weatherLocation);

  const { weather, loading, error } = useWeather(weatherLocation, committed);

  // Adjusts state during render rather than in an effect, per React's own recommended
  // pattern for "reset state when a prop/value changes" - safe because setting state while
  // rendering makes React immediately re-render with the new value before committing
  // anything to the screen, rather than committing the stale render first.
  if (weatherLocation !== previousWeatherLocation) {
    setPreviousWeatherLocation(weatherLocation);
    setSelectedDayIndex(TODAY_INDEX);
  }

  useEffect(() => {
    document.title = weatherLocation
      ? `${formatLocationLabel(weatherLocation)} Weather Forecast | Tempest`
      : 'Tempest';
  }, [weatherLocation]);

  // Restores the search bar's badge to weatherLocation when preferences are committed
  // while the search bar is in write-mode (e.g. "Apply for current location") - searchSelection
  // is the only one of the two that gets cleared, so weatherLocation is the only place left to
  // pull it back from.
  const handleCommitPreferences = useCallback(
    (preferences: UnitPreferences) => {
      setCommitted(preferences);
      localStorage.setItem(UNIT_PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
      setSearchSelection(weatherLocation);
    },
    [weatherLocation],
  );

  function handleLocationSelect(location: Location) {
    setSearchSelection(location);
    setWeatherLocation(location);

    const updatedHistory = addToLocationHistory(locationHistory, location);
    setLocationHistory(updatedHistory);
    localStorage.setItem(LOCATION_HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  }

  function handleLocationReset() {
    setSearchSelection(null);
  }

  function handleRemoveFromHistory(location: Location) {
    const updatedHistory = removeFromLocationHistory(locationHistory, location);
    setLocationHistory(updatedHistory);
    localStorage.setItem(LOCATION_HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  }

  return (
    <div className='min-h-screen flex flex-col bg-page-background'>
      <main id='content' className='flex-1'>
        <div id='location-search' className='relative z-20 backdrop-blur-2xl'>
          <div className='container px-2 md:px-2 mx-auto'>
            <section
              id='location-search'
              className='max-w-7xl mx-auto space-y-5 xl:space-y-2 pt-5 xl:pb-5'
            >
              <div className=''>
                <Branding />
              </div>
              <Search
                searchSelection={searchSelection}
                onSelect={handleLocationSelect}
                onReset={handleLocationReset}
                searchHistory={locationHistory}
                onRemoveFromHistory={handleRemoveFromHistory}
              />
              <Preferences
                weatherLocationId={weatherLocation?.id ?? null}
                hasSearchSelection={searchSelection !== null}
                committed={committed}
                onCommit={handleCommitPreferences}
              />

              <hr className='mx-auto h-px mt-1 xl:mt-3 mb-2 xl:mb-0 bg-gradient-to-r from-transparent via-gray-400/50 to-transparent border-0' />
            </section>
          </div>
        </div>
        {weatherLocation === null && (
          <div className='px-2 md:px-2 '>
            <Landing onSelectLocation={handleLocationSelect} />

            <hr className='mx-auto h-px mt-0 xl:mt-0 mb-0 xl:mb-1 bg-gradient-to-r from-transparent via-gray-400/50 to-transparent border-0' />
          </div>
        )}
        <div className='px-2 md:px-2' id='daily-forecast'>
          <DayPreview
            weather={weather}
            weatherLocation={weatherLocation}
            preferences={committed}
            loading={loading}
            error={error}
            selectedDayIndex={selectedDayIndex}
          />

          <div>
            <WeatherDays
              weather={weather}
              loading={loading}
              error={error}
              selectedDayIndex={selectedDayIndex}
              onSelectDay={setSelectedDayIndex}
            />
          </div>
        </div>
        <div className='px-2 md:px-2' id='weekly-forecast'>
          <div>
            <SelectedDayReport
              weather={weather}
              weatherLocation={weatherLocation}
              preferences={committed}
              loading={loading}
              error={error}
              selectedDayIndex={selectedDayIndex}
              onSelectDay={setSelectedDayIndex}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
