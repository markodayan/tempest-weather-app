import { useState } from 'react';
import { MapPin, SearchIcon, X, ArrowRight } from 'lucide-react';
import { useLocationSearch } from '../hooks/useLocationSearch';
import type { Location } from '../api';
import { formatLatitude, formatLongitude } from '../lib/coordinates';

type SearchProps = {
  searchSelection: Location | null;
  onSelect: (location: Location) => void;
  onReset: () => void;
};

// Approximate cutoff, not a pixel-measured one - past this many characters the full
// "title, area, country" label is likely to wrap/overflow the badge, so just the title
// (which is always what the user actually typed/recognised) is shown instead.
const MAX_BADGE_LABEL_LENGTH = 30;

function formatLocationBadgeLabel(location: Location): string {
  const fullLabel = `${location.location_title}, ${location.location_area}, ${location.location_country}`;
  return fullLabel.length > MAX_BADGE_LABEL_LENGTH ? location.location_title : fullLabel;
}

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
    <div id='search-bar-container' className='relative xl:py-2.5 '>
      <form
        id='location-search-form'
        className='flex flex-col h-12 xl:h-14 '
        onSubmit={handleSubmit}
      >
        <label htmlFor='location-search-input'></label>
        <div className='flex items-center bg-input-mode border border-search-field-border rounded-sm'>
          <SearchIcon className='h-5 xl:h-6 w-5 xl:w-6 ml-5  text-black/25' />
          <input
            name='search-term'
            id='location-search-input'
            className=' bg-white px-4 py-3 xl:px-4 xl:py-3.5 text-1 xl:text-lg min-h-12 xl:min-h-14 text-search-input-text outline-none placeholder:text-slate-400 flex-1'
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
            required
          />
          {!!searchSelection && (
            <div className=' flex-1 text-1 xl:text-lg py-3 ml-3 flex justify-start  rounded-lg'>
              <span className='location-badge-colours border px-3 py-0.5  rounded-lg '>{formatLocationBadgeLabel(searchSelection)}</span>
            </div>
          )}

          {!searchSelection && (
            <button
              type='submit'
              id='location-search-submit'
              aria-label='Search new location'
              className='px-4 py-2 transition-colors'
              disabled={!!searchSelection}
            >
              <ArrowRight className='h-5 xl:h-6 w-5 xl:w-6 text-black/85' />
            </button>
          )}

          {!!searchSelection && (
            <button
              type='button'
              className='px-4 py-2'
              aria-label='Reset location search'
              onClick={resetSearch}
            >
              <X className='h-5 xl:h-6 w-5 xl:w-6 text-black/85' strokeWidth={2} />
            </button>
          )}
        </div>
      </form>

      {showDropdown && (
        <div
          id='suggested-search-results'
          role='listbox'
          className='absolute inset-x-2 xl:inset-x-6  z-10 mt-2 overflow-hidden rounded-2xl bg-white shadow-lg'
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
                      <span className='block text-base text-slate-800'>
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
