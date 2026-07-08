import { useState } from 'react';
import Search from './components/Search';
import PreferencesRow from './components/PreferencesRow';
import type { Location } from './api';

function App() {
  // drives Search components badge/disabled-input UI, it gets cleared on reset.
  const [searchSelection, setSearchSelection] = useState<Location | null>(null);
  // the location whose weather is currently displayed; only ever set forward (on select), never nulled by reset
  const [weatherLocation, setWeatherLocation] = useState<Location | null>(null);

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
          <PreferencesRow
            weatherLocationId={weatherLocation?.id ?? null}
            hasSearchSelection={searchSelection !== null}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
