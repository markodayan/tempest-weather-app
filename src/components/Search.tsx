import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, SearchIcon, X, ArrowRight, Locate, Clock4 } from 'lucide-react';
import { useLocationSearch } from '../hooks/useLocationSearch';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import type { Location } from '../api';
import { formatLatitude, formatLongitude } from '../lib/coordinates';
import { formatLocationLabel } from '../lib/location';

type SearchProps = {
  searchSelection: Location | null;
  onSelect: (location: Location) => void;
  onReset: () => void;
  searchHistory: Location[];
  onRemoveFromHistory: (location: Location) => void;
};

export default function Search({
  searchSelection,
  onSelect,
  onReset,
  searchHistory,
  onRemoveFromHistory,
}: SearchProps) {
  const { searchTerm, setSearchTerm, suggestions, loading, error } = useLocationSearch();
  const {
    locate,
    loading: locating,
    error: locationError,
    clearError: clearLocationError,
  } = useCurrentLocation();

  // will remove dropdown after selection to avoid searchTerm state value not to immediately reopen to do another search for locations matching the term
  const [justSelected, setJustSelected] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  // which suggestion the keyboard has moved to; -1 means none (focus stays on the input either way)
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  // tracks searchTerm as of the last render, purely to detect the change below
  const [previousSearchTerm, setPreviousSearchTerm] = useState(searchTerm);

  const inputRef = useRef<HTMLInputElement>(null);
  // tracks searchSelection as of the last render, purely to detect the "badge just removed"
  // transition below - doesn't need to be state since nothing renders off it directly
  const previousSearchSelectionRef = useRef(searchSelection);

  const hasQuery = searchTerm.trim().length > 0;
  // open on focus alone (not gated on hasQuery) so "Use current location" is reachable
  // before the user types anything
  const showDropdown = !justSelected && isFocused;

  const showSearchHistory = !hasQuery && searchHistory.length > 0;

  // The dropdown's virtual-focus order: "Use current location" is always index 0 (it's always
  // rendered), followed by whichever list is actually showing beneath it - search history when
  // there's no query, suggestions once there is one. Keeping this in one array is what lets arrow
  // keys/Enter reach "Use current location" and search history, not just typed-query suggestions.
  const navigableItems = hasQuery ? suggestions : searchHistory;
  const totalNavigableCount = 1 + navigableItems.length;

  // Adjusts state during render rather than in an effect, per React's own recommended pattern
  // for "reset state when a prop/value changes" (mirrors App.tsx's previousWeatherLocation reset)
  // - a "Use current location" failure is stale the moment the user types again, since they're
  // now looking at (or about to see) a different set of search suggestions.
  if (searchTerm !== previousSearchTerm) {
    setPreviousSearchTerm(searchTerm);
    clearLocationError();
  }

  // Refocusing the input has to wait until after the badge-removal re-render actually commits
  // (the input is still disabled/hidden at the moment the X button's onClick runs), so this is
  // an effect rather than the render-time adjustment used above - focusing re-triggers onFocus,
  // which is what makes the dropdown (with "Use current location") reopen immediately, the same
  // as it would from any other focus.
  useEffect(() => {
    if (previousSearchSelectionRef.current !== null && searchSelection === null) {
      inputRef.current?.focus();
    }
    previousSearchSelectionRef.current = searchSelection;
  }, [searchSelection]);

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

  async function handleUseCurrentLocation() {
    const location = await locate();
    if (location) {
      handleSelect(location);
    }
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, totalNavigableCount - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      if (highlightedIndex === 0) {
        handleUseCurrentLocation();
      } else {
        handleSelect(navigableItems[highlightedIndex - 1]);
      }
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
    setJustSelected(false);
  }

  return (
    <div id='search-bar-container' className='relative xl:py-2.5 '>
      <form
        id='location-search-form'
        className='relative z-20 flex flex-col h-12 xl:h-14 '
        onSubmit={handleSubmit}
      >
        <label htmlFor='location-search-input' className='sr-only'>
          Search for a city, town, or suburb
        </label>
        <div className='flex items-center bg-input-mode border border-search-field-border rounded-sm'>
          <SearchIcon className='h-5 xl:h-6 w-5 xl:w-6 ml-5 shrink-0 text-black/25' />
          <input
            ref={inputRef}
            name='search-term'
            id='location-search-input'
            className=' bg-white px-4 py-3 xl:px-4 xl:py-3.5 text-1 xl:text-lg min-h-12 xl:min-h-14 text-search-input-text outline-none placeholder:text-slate-400 flex-1 min-w-0'
            placeholder='Enter a city, town or suburb'
            type='text'
            value={searchTerm}
            onChange={handleChange}
            onKeyDown={handleInputKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              setHighlightedIndex(-1);
              clearLocationError();
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
              highlightedIndex === 0
                ? 'current-location-option'
                : highlightedIndex > 0
                  ? `suggestion-option-${navigableItems[highlightedIndex - 1].id}`
                  : undefined
            }
            required
          />
          {!!searchSelection && (
            <div className='flex-1 min-w-0 text-1 xl:text-lg py-3 ml-3 flex justify-start rounded-lg'>
              <span
                title={formatLocationLabel(searchSelection)}
                className='location-badge-colours max-w-full truncate border px-3 py-0.5 rounded-lg'
              >
                {formatLocationLabel(searchSelection)}
              </span>
            </div>
          )}

          {!searchSelection && (
            <button
              type='submit'
              id='location-search-submit'
              aria-label='Search new location'
              className='px-4 py-2 cursor-pointer transition-colors'
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
        <>
          {/* Portaled to document.body rather than rendered in place - #location-search (an
              ancestor) has backdrop-blur-2xl, and any ancestor with a filter/backdrop-filter
              becomes the containing block for `position: fixed` descendants, so a fixed div left
              in place here would size itself to that ancestor's box instead of the real viewport.
              Dims the rest of the page so the open dropdown doesn't look like it's floating over/
              breaking the layout beneath it, and doubles as a click-outside-to-close target. Still
              paints beneath the header/dropdown themselves via normal stacking-context rules. */}
          {createPortal(
            <div
              className='fixed inset-0 bg-black/20'
              onClick={() => inputRef.current?.blur()}
            />,
            document.body,
          )}
          <div className='absolute inset-x-1 flex flex-col mt-2 z-10 gap-y-1 '>
            {locationError && (
              <div
                role='alert'
                className='flex flex-col px-6 pt-4 pb-4 gap-y-2 bg-white rounded-sm shadow-2xl'
              >
                <h3 className='text-lg font-bold tracking-wide  text-[#595959]'>
                  Geolocation Error
                </h3>
                <p className='text-sm   text-black/40'>{locationError}</p>
              </div>
            )}

            <div
              id='suggested-search-results'
              role='listbox'
              className='overflow-hidden rounded-sm bg-white shadow-2xl'
            >
              <div role='group' aria-labelledby='current-location-heading'>
                <p
                  id='current-location-heading'
                  className='px-4 py-2 text-sm font-semibold tracking-tighter text-slate-600'
                >
                  Current Location
                </p>

                <button
                  type='button'
                  id='current-location-option'
                  role='option'
                  aria-selected={highlightedIndex === 0}
                  onClick={handleUseCurrentLocation}
                  onMouseDown={(e) => e.preventDefault()} // keeps focus on the input while locating, so blur doesn't hide this panel mid-lookup
                  disabled={locating}
                  className={`flex w-full cursor-pointer items-center gap-x-3  px-4 py-2 text-base  transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-70 bg-[#f2f2f2] hover:bg-slate-100 ${
                    highlightedIndex === 0 ? 'bg-slate-100' : ''
                  }`}
                >
                  <div className='p-2 rounded-lg bg-black/6'>
                    <Locate strokeWidth={2} className='h-5 w-5 shrink-0 text-black/80' />
                  </div>

                  <span className='font-normal'>
                    {locating ? 'Locating…' : 'Use my current location'}
                  </span>
                </button>
              </div>

              {showSearchHistory && (
                <div role='group' aria-labelledby='search-history-heading'>
                  <p
                    id='search-history-heading'
                    className='px-4 py-2 text-sm font-semibold tracking-tighter text-slate-600'
                  >
                    Search History
                  </p>
                  <div className='py-0' />
                  <ul className='max-h-[21.5rem] overflow-y-auto'>
                    {searchHistory.map((location, index) => (
                      <li
                        key={location.id}
                        className='flex items-center border-b border-slate-100 first:border last:border-none group has-[.remove-history-item:hover]:bg-red-500/4 has-[button:hover]:bg-slate-100'
                      >
                        <button
                          type='button'
                          id={`suggestion-option-${location.id}`}
                          role='option'
                          aria-selected={index + 1 === highlightedIndex}
                          onClick={() => handleSelect(location)}
                          onMouseDown={(e) => e.preventDefault()} // keeps focus on the input, so blur never fires (important to override default mousedown behaviour of shifting focus since we are using it to control drop down)
                          className={`flex flex-1 items-center gap-3 px-4 py-2 text-left cursor-pointer ${
                            index + 1 === highlightedIndex ? 'bg-slate-100' : ''
                          }`}
                        >
                          <Clock4 className=' h-4 w-4 shrink-0 text-black/10' />

                          <span>
                            <span className='block text-[15px] text-[#636363]'>
                              <span className=''>{location.location_title}</span>
                              {location.location_country && `, ${location.location_country}`}
                            </span>
                          </span>
                        </button>
                        <button
                          type='button'
                          id={`clear-search-history-item-${location.id}`}
                          aria-label={`Remove ${location.location_title} from search history`}
                          onClick={() => onRemoveFromHistory(location)}
                          onMouseDown={(e) => e.preventDefault()} // keeps focus on the input, so blur doesn't hide this panel
                          className='remove-history-item mr-4 shrink-0 cursor-pointer'
                        >
                          <X
                            className='h-4 w-4 text-black/85 hover:text-red-500/60'
                            strokeWidth={3}
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className='py-0 bg-[#f6f6f6]'></div>
                </div>
              )}

              {hasQuery && (
                <div role='group' aria-label='Search results'>
                  {loading && (
                    <p className='bg-[#f9f9f9] px-4 py-3 text-slate-400'>Searching…</p>
                  )}

                  {!loading && error && (
                    <p className='bg-[#f9f9f9] px-4 py-3 text-red-500'>{error}</p>
                  )}

                  {!loading && !error && suggestions.length === 0 && (
                    <p className='px-4 py-3 text-slate-400'>
                      No matches found for &ldquo;{searchTerm}&rdquo;.
                    </p>
                  )}

                  {!loading && !error && suggestions.length > 0 && (
                    <>
                      <p className='px-4 py-2 text-sm font-semibold tracking-tighter text-slate-600'>
                        Search Results ({suggestions.length})
                      </p>
                      <div className='py-0' />
                      <ul className='max-h-[21.5rem] overflow-y-auto'>
                        {suggestions.map((location, index) => (
                          <li
                            key={location.id}
                            className='border-b border-slate-100 first:border last:border-none'
                          >
                            <button
                              type='button'
                              id={`suggestion-option-${location.id}`}
                              role='option'
                              aria-selected={index + 1 === highlightedIndex}
                              onClick={() => handleSelect(location)}
                              onMouseDown={(e) => e.preventDefault()} // keeps focus on the input, so blur never fires (important to override default mousedown behaviour of shifting focus since we are using it to control drop down)
                              className={`flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-100 cursor-pointer ${
                                index + 1 === highlightedIndex ? 'bg-slate-100' : ''
                              }`}
                            >
                              <div className='p-2 rounded-lg bg-black/6'>
                                <MapPin className=' h-5 w-5 shrink-0 text-black/60' />
                              </div>

                              <span>
                                <span className='block text-base text-slate-800'>
                                  <span className='font-semibold'>
                                    {location.location_title}
                                  </span>
                                  {location.location_country && `, ${location.location_country}`}
                                </span>
                                <span className='block text-sm text-slate-400'>
                                  Lat.: {formatLatitude(location.latitude)} / Lon.:{' '}
                                  {formatLongitude(location.longitude)}
                                  {location.location_area && ` / ${location.location_area}`}
                                </span>
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className='py-0 bg-[#f6f6f6]'></div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
