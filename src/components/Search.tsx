import { useState } from 'react';
import { MapPin, SearchIcon } from 'lucide-react';
import { useLocationSearch } from '../hooks/useLocationSearch';
import type { Location } from '../api';
import { formatLatitude, formatLongitude } from '../lib/coordinates';

export default function Search() {
  const { searchTerm, setSearchTerm, suggestions, loading, error } = useLocationSearch();
  // suppresses the dropdown right after a selection, so setting searchTerm to the
  // chosen location's title doesn't immediately reopen it with a fresh search
  const [justSelected, setJustSelected] = useState(false);

  const showDropdown = searchTerm.trim().length > 0 && !justSelected;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setJustSelected(false);
    setSearchTerm(e.target.value);
  }

  function handleSelect(location: Location) {
    setJustSelected(true);
    setSearchTerm(`${location.location_title}, ${location.location_country}`);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div className='relative w-full max-w-xl mx-auto'>
      <form onSubmit={handleSubmit}>
        <div className='flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-lg'>
          <div className='flex items-center gap-2'>
            <img src='/tempest-logo-trans.svg' alt='Tempest logo' className='h-7 w-7' />
            <span className='text-xl font-bold text-slate-800'>Tempest</span>
          </div>

          <input
            name='search-term'
            className='flex-1 bg-transparent px-2 py-1 text-lg text-slate-800 outline-none placeholder:text-slate-400'
            placeholder='Enter a city, town or suburb'
            type='text'
            value={searchTerm}
            onChange={handleChange}
            autoComplete='off'
          />

          <button
            type='submit'
            aria-label='Search'
            className='p-2 text-slate-400 transition-colors hover:text-sky-600'
          >
            <SearchIcon className='h-5 w-5' />
          </button>
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
