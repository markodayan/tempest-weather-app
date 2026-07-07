import { useState } from 'react';
import { MapPin, SearchIcon, X } from 'lucide-react';
import { useLocationSearch } from '../hooks/useLocationSearch';
import type { Location } from '../api';
import { formatLatitude, formatLongitude } from '../lib/coordinates';

export default function Search() {
  const { searchTerm, setSearchTerm, suggestions, loading, error } = useLocationSearch();

  // will remove dropdown after selection to avoid searchTerm state value not to immediately reopen to do another search for locations matching the term
  const [justSelected, setJustSelected] = useState(false);
  // The location data of the user's selected place (used to update component-scope state as well as will be used in setter for weather hook when implemented)
  const [chosenLocation, setChosenLocation] = useState<Location | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const showDropdown = searchTerm.trim().length > 0 && !justSelected && isFocused;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setJustSelected(false);
    setSearchTerm(e.target.value);
  }

  function handleSelect(location: Location) {
    setJustSelected(true);
    setChosenLocation(location);
  }

  // Used to submit query to weather API (todo) as well as managing component-level action state (whether user has chosen a location or not)
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Return early if there were no suggestion results
    if (suggestions.length === 0) return;

    setJustSelected(true);
    setChosenLocation(suggestions[0]);
  }

  // Reneables the searchbar input to allow the user to make a new search
  function resetSearch() {
    setChosenLocation(null);
    setSearchTerm('');
  }

  return (
    <div className='relative w-full max-w-5xl mx-auto'>
      <form onSubmit={handleSubmit}>
        <div className={`flex  items-center gap-3 rounded-full bg-white px-6 py-5 shadow-lg`}>
          <div className='flex items-center gap-2'>
            <img src='/tempest-logo-trans.svg' alt='Tempest logo' className='h-6.5 w-6.5' />
            <span className='text-xl font-bold text-tempest-title '>Tempest</span>
          </div>

          <input
            name='search-term'
            className='flex-1 bg-transparent px-2 py-1 text-lg text-slate-800 outline-none placeholder:text-slate-400'
            placeholder='Enter a city, town or suburb'
            type='text'
            value={searchTerm}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoComplete='off'
            disabled={!!chosenLocation}
            hidden={!!chosenLocation}
          />
          {!!chosenLocation && (
            <div className=' flex-1 text-lg text-slate-800 py-0 ml-3 flex justify-start  rounded-lg'>
              <span className='location-badge-bg text-white px-2 py-1 pr-10 rounded-lg'>{`${chosenLocation.location_title}, ${chosenLocation.location_area}, ${chosenLocation.location_country}`}</span>
            </div>
          )}

          {!chosenLocation && (
            <button
              type='submit'
              aria-label='Search'
              className='p-2 text-slate-400 transition-colors hover:text-primary'
              disabled={!!chosenLocation}
            >
              <SearchIcon className='h-5 w-5' />
            </button>
          )}

          {!!chosenLocation && (
            <button type='button' aria-label='Clear selected location' onClick={resetSearch}>
              <X className='h-5 w-5' />
            </button>
          )}
        </div>
      </form>

      {showDropdown && (
        <div className='absolute inset-x-0 top-full z-10 mt-2 overflow-hidden rounded-2xl bg-white shadow-lg'>
          {loading && <p className='px-4 py-3 text-slate-400'>Searching…</p>}

          {!loading && error && <p className='px-4 py-3 text-red-500'>{error}</p>}

          {!loading && !error && suggestions.length === 0 && (
            <p className='px-4 py-3 text-slate-400'>
              No matches found for &ldquo;{searchTerm}&rdquo;.
            </p>
          )}

          {!loading && !error && suggestions.length > 0 && (
            <ul>
              {suggestions.map((location) => (
                <li key={location.id} className='border-b border-slate-100 last:border-none'>
                  <button
                    type='button'
                    onClick={() => handleSelect(location)}
                    onMouseDown={(e) => e.preventDefault()} // keeps focus on the input, so blur never fires (important to override default mousedown behaviour of shifting focus since we are using it to control drop down)
                    className='flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50'
                  >
                    <MapPin className='mt-1 h-5 w-5 shrink-0 text-slate-400' />

                    <span>
                      <span className='block text-slate-800'>
                        <span className='font-semibold'>{location.location_title}</span>,{' '}
                        {location.location_country}
                      </span>
                      <span className='block text-sm text-slate-400'>
                        Lat.: {formatLatitude(location.latitude)} / Lon.:{' '}
                        {formatLongitude(location.longitude)} / {location.location_area}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
