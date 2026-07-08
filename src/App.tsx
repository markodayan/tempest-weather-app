import { useCallback, useEffect, useState } from 'react';
import Search from './components/Search';
import Preferences from './components/Preferences';
import { useWeather } from './hooks/useWeather';
import type { Location } from './api';
import { DEFAULT_PREFERENCES } from './types';
import type { UnitPreferences } from './types';

function App() {
  // drives Search components badge/disabled-input UI, it gets cleared on reset.
  const [searchSelection, setSearchSelection] = useState<Location | null>(null);
  // the location whose weather is currently displayed; only ever set forward (on select), never nulled by reset
  const [weatherLocation, setWeatherLocation] = useState<Location | null>(null);
  // canonical preferences used to fetch weather; only updated on a new search or an explicit Apply
  const [committed, setCommitted] = useState(DEFAULT_PREFERENCES);

  useWeather(weatherLocation, committed);

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
        </div>
      </main>
    </div>
  );
}

export default App;
