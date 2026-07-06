import { useEffect, useState } from 'react';
import { geocodeLocation } from '../api';
import type { LocationResults } from '../api';
import { useDebounce } from './useDebounce';

const DEBOUNCE_MS = 300;

export function useLocationSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<LocationResults>([]);
  const [error, setError] = useState<string | null>(null);
  // the search term that suggestions/error currently reflect; while it lags
  // behind debouncedSearchTerm, a request for the new term is in flight
  const [resolvedTerm, setResolvedTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_MS);
  const hasQuery = debouncedSearchTerm.trim().length > 0;
  const loading = hasQuery && resolvedTerm !== debouncedSearchTerm;

  useEffect(() => {
    if (!hasQuery) {
      return;
    }

    const controller = new AbortController();

    geocodeLocation(debouncedSearchTerm, controller.signal)
      .then((results) => {
        if (controller.signal.aborted) return;
        setSuggestions(results);
        setError(null);
        setResolvedTerm(debouncedSearchTerm);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setSuggestions([]);
        setError(err instanceof Error ? err.message : 'Failed to search for locations.');
        setResolvedTerm(debouncedSearchTerm);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedSearchTerm, hasQuery]);

  return {
    searchTerm,
    setSearchTerm,
    suggestions: hasQuery ? suggestions : [],
    loading,
    error: hasQuery ? error : null,
  };
}
