import { useState } from 'react';
import { MapPin, SearchIcon, X } from 'lucide-react';
import { useLocationSearch } from '../hooks/useLocationSearch';
import type { Location } from '../api';
import { formatLatitude, formatLongitude } from '../lib/coordinates';

type SearchProps = {
  chosenLocation: Location | null;
  onLocationChange: (location: Location | null) => void;
};

export default function Search({ chosenLocation, onLocationChange }: SearchProps) {
  const { searchTerm, setSearchTerm, suggestions, loading, error } = useLocationSearch();

  // will remove dropdown after selection to avoid searchTerm state value not to immediately reopen to do another search for locations matching the term
  const [justSelected, setJustSelected] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const showDropdown = searchTerm.trim().length > 0 && !justSelected && isFocused;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setJustSelected(false);
    setSearchTerm(e.target.value);
  }

  function handleSelect(location: Location) {
    setJustSelected(true);
    onLocationChange(location);
  }

  // Used to submit query to weather API (todo) as well as managing component-level action state (whether user has chosen a location or not)
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Return early if there were no suggestion results
    if (suggestions.length === 0) return;

    setJustSelected(true);
    onLocationChange(suggestions[0]);
  }

  // Reneables the searchbar input to allow the user to make a new search
  function resetSearch() {
    onLocationChange(null);
    setSearchTerm('');
  }

  return (
    <div className='relative w-full max-w-5xl mx-auto'>
      <form onSubmit={handleSubmit}>
        <div className={`flex  items-center gap-3 rounded-full bg-white px-6 py-5 shadow-lg`}>
          <div className='flex items-center gap-2'>
            <img src='/tempest-logo-trans.svg' alt='Tempest logo' className='h-6.5 w-6.5' />
            <h2 className='text-[26px] font-stretch-extra-condensed  font-extrabold text-search-title-suffix'>
              <span className=' text-tempest-title '>Tempest</span>
            </h2>
          </div>

          <label
            className={` ${chosenLocation ? 'bg-search-locked-in-state' : 'bg-input-mode'} flex flex-1 justify-between border-2 border-search-field-border rounded-full px-3 `}
            htmlFor='search-input'
          >
            <input
              name='search-term'
              id='search-input'
              className=' bg-transparent px-2 py-2 text-base text-slate-800 outline-none placeholder:text-slate-400 flex-1'
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
              <div className=' flex-1 text-base py-2 ml-3 flex justify-start  rounded-lg'>
                <span className='location-badge-bg px-2   rounded-lg'>{`${chosenLocation.location_title}, ${chosenLocation.location_area}, ${chosenLocation.location_country}`}</span>
              </div>
            )}

            {!chosenLocation && (
              <button
                type='submit'
                aria-label='Search'
                className='p-2 text-primary transition-colors'
                disabled={!!chosenLocation}
              >
                <SearchIcon className='h-5 w-5' />
              </button>
            )}

            {!!chosenLocation && (
              <button type='button' aria-label='Clear selected location' onClick={resetSearch}>
                <X className='h-5 w-5 text-reset-search' strokeWidth={2} />
              </button>
            )}
          </label>
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
