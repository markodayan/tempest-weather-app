import { useState } from 'react';
import Search from './components/Search';
import PreferencesRow from './components/PreferencesRow';
import type { Location } from './api';

function App() {
  const [chosenLocation, setChosenLocation] = useState<Location | null>(null);

  return (
    <div className='min-h-screen bg-page-background'>
      <main>
        <div className='flex flex-col'>
          <Search chosenLocation={chosenLocation} onLocationChange={setChosenLocation} />
          <PreferencesRow chosenLocation={chosenLocation} />
        </div>
      </main>
    </div>
  );
}

export default App;
