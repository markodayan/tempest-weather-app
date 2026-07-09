import { useState } from 'react';
import { MapPin, SearchIcon, X } from 'lucide-react';
import { useLocationSearch } from '../hooks/useLocationSearch';
import type { Location } from '../api';
import { formatLatitude, formatLongitude } from '../lib/coordinates';

type SearchProps = {
  searchSelection: Location | null;
  onSelect: (location: Location) => void;
  onReset: () => void;
};

export default function Search({ searchSelection, onSelect, onReset }: SearchProps) {
  const { searchTerm, setSearchTerm, suggestions, loading, error } = useLocationSearch();

  // will remove dropdown after selection to avoid searchTerm state value not to immediately reopen to do another search for locations matching the term
  const [justSelected, setJustSelected] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  // which suggestion the keyboard has moved to; -1 means none (focus stays on the input either way)
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const showDropdown = searchTerm.trim().length > 0 && !justSelected && isFocused;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setJustSelected(false);
    setHighlightedIndex(-1);
    setSearchTerm(e.target.value);
  }

  function handleSelect(location: Location) {
    setJustSelected(true);
    setHighlightedIndex(-1);
    onSelect(location);
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setHighlightedIndex(-1);
      e.currentTarget.blur();
    }
  }

  // Used to submit query to weather API (todo) as well as managing component-level action state (whether user has chosen a location or not)
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Return early if there were no suggestion results
    if (suggestions.length === 0) return;

    setJustSelected(true);
    onSelect(suggestions[0]);
  }

  // Reneables the searchbar input to allow the user to make a new search
  function resetSearch() {
    onReset();
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
            className={` ${searchSelection ? 'bg-search-locked-in-state' : 'bg-input-mode'} flex flex-1 justify-between border-2 border-search-field-border rounded-full px-3 `}
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
              onKeyDown={handleInputKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                setHighlightedIndex(-1);
              }}
              autoComplete='off'
              disabled={!!searchSelection}
              hidden={!!searchSelection}
              role='combobox'
              aria-autocomplete='list'
              aria-haspopup='listbox'
              aria-owns='suggested-search-results'
              aria-controls='suggested-search-results'
              aria-expanded={showDropdown}
              aria-activedescendant={
                highlightedIndex >= 0
                  ? `suggestion-option-${suggestions[highlightedIndex].id}`
                  : undefined
              }
            />
            {!!searchSelection && (
              <div className=' flex-1 text-base py-2 ml-3 flex justify-start  rounded-lg'>
                <span className='location-badge-bg px-2   rounded-lg'>{`${searchSelection.location_title}, ${searchSelection.location_area}, ${searchSelection.location_country}`}</span>
              </div>
            )}

            {!searchSelection && (
              <button
                type='submit'
                aria-label='Search new location'
                className='p-2 text-primary transition-colors'
                disabled={!!searchSelection}
              >
                <SearchIcon className='h-5 w-5' />
              </button>
            )}

            {!!searchSelection && (
              <button type='button' aria-label='Reset location search' onClick={resetSearch}>
                <X className='h-5 w-5 text-reset-search' strokeWidth={2} />
              </button>
            )}
          </label>
        </div>
      </form>

      {showDropdown && (
        <div
          id='suggested-search-results'
          role='listbox'
          className='absolute inset-x-0 top-full z-10 mt-2 overflow-hidden rounded-2xl bg-white shadow-lg'
        >
          {loading && <p className='px-4 py-3 text-slate-400'>Searching…</p>}

          {!loading && error && <p className='px-4 py-3 text-red-500'>{error}</p>}

          {!loading && !error && suggestions.length === 0 && (
            <p className='px-4 py-3 text-slate-400'>
              No matches found for &ldquo;{searchTerm}&rdquo;.
            </p>
          )}

          {!loading && !error && suggestions.length > 0 && (
            <ul>
              {suggestions.map((location, index) => (
                <li key={location.id} className='border-b border-slate-100 last:border-none'>
                  <button
                    type='button'
                    id={`suggestion-option-${location.id}`}
                    role='option'
                    aria-selected={index === highlightedIndex}
                    onClick={() => handleSelect(location)}
                    onMouseDown={(e) => e.preventDefault()} // keeps focus on the input, so blur never fires (important to override default mousedown behaviour of shifting focus since we are using it to control drop down)
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-100 ${
                      index === highlightedIndex ? 'bg-slate-100' : ''
                    }`}
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
