import { useCallback, useEffect, useState } from 'react';
import Search from './components/Search';
import Preferences from './components/Preferences';
import WeatherDays from './components/WeatherDays';
import SelectedDayReport from './components/SelectedDayReport';
import { useWeather } from './hooks/useWeather';
import type { Location } from './api';
import { TODAY_INDEX } from './api';
import { DEFAULT_PREFERENCES } from './types';
import type { UnitPreferences } from './types';

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
      ? `${weatherLocation.location_title}, ${weatherLocation.location_area}, ${weatherLocation.location_country} Weather Forecast | Tempest`
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
      <main>
        <div className='flex flex-col'>
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
          <WeatherDays
            weather={weather}
            loading={loading}
            error={error}
            selectedDayIndex={selectedDayIndex}
            onSelectDay={setSelectedDayIndex}
          />
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
      </main>
    </div>
  );
}

export default App;
