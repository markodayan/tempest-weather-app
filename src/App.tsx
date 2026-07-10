import { useCallback, useEffect, useState } from 'react';
import Branding from './components/Branding';
import Search from './components/Search';
import Preferences from './components/Preferences';
import Landing from './components/Landing';
import DayPreview from './components/DayPreview';
import WeatherDays from './components/WeatherDays';
import SelectedDayReport from './components/SelectedDayReport';
import { useWeather } from './hooks/useWeather';
import type { Location } from './api';
import { TODAY_INDEX } from './api';
import { DEFAULT_PREFERENCES } from './types';
import type { UnitPreferences } from './types';
import { formatLocationLabel } from './lib/location';

function App() {
  // drives Search components badge/disabled-input UI, it gets cleared on reset.
  const [searchSelection, setSearchSelection] = useState<Location | null>(null);
  // the location whose weather is currently displayed; only ever set forward (on select), never nulled by reset
  const [weatherLocation, setWeatherLocation] = useState<Location | null>(null);
  // canonical preferences used to fetch weather; only updated on a new search or an explicit Apply
  const [committed, setCommitted] = useState(DEFAULT_PREFERENCES);
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
      setSearchSelection(weatherLocation);
    },
    [weatherLocation],
  );

  function handleLocationSelect(location: Location) {
    setSearchSelection(location);
    setWeatherLocation(location);
  }

  function handleLocationReset() {
    setSearchSelection(null);
  }

  return (
    <div className='min-h-screen bg-page-background'>
      <main id='content' className=''>
        <div id='location-search' className='relative z-20 backdrop-blur-2xl'>
          <div className='container px-6 xl:px-2 mx-auto'>
            <section
              id='location-search'
              className='max-w-7xl mx-auto space-y-5 xl:space-y-2 pt-5 xl:pb-5'
            >
              <Branding />
              <Search
                searchSelection={searchSelection}
                onSelect={handleLocationSelect}
                onReset={handleLocationReset}
              />
              <Preferences
                weatherLocationId={weatherLocation?.id ?? null}
                hasSearchSelection={searchSelection !== null}
                committed={committed}
                onCommit={handleCommitPreferences}
              />
              <hr className='mx-auto h-px mt-3 xl:mt-6 mb-5 xl:mb-1 bg-gradient-to-r from-transparent via-gray-400/50 to-transparent border-0' />
            </section>
          </div>
        </div>
        {weatherLocation === null && (
          <>
            <Landing onSelectLocation={handleLocationSelect} />

            <hr className='mx-auto h-px mt-0 xl:mt-0 mb-0 xl:mb-1 bg-gradient-to-r from-transparent via-gray-400/50 to-transparent border-0' />
          </>
        )}
        <div id='daily-forecast'>
          <DayPreview
            weather={weather}
            weatherLocation={weatherLocation}
            preferences={committed}
            loading={loading}
            error={error}
            selectedDayIndex={selectedDayIndex}
          />
        </div>
        <div id='weekly-forecast'>
          <div>
            <WeatherDays
              weather={weather}
              loading={loading}
              error={error}
              selectedDayIndex={selectedDayIndex}
              onSelectDay={setSelectedDayIndex}
            />
          </div>
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
    </div>
  );
}

export default App;
