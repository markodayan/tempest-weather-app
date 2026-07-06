import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useLocationSearch } from './useLocationSearch';
import { geocodeLocation } from '../api';
import type { Location, LocationResults } from '../api';

vi.mock('../api', () => ({
  geocodeLocation: vi.fn(),
}));

const mockedGeocodeLocation = vi.mocked(geocodeLocation);

const testLocation: Location = {
  id: 1,
  latitude: -29.85,
  longitude: 30.98,
  timezone: 'Africa/Johannesburg',
  location_title: 'Glenwood',
  location_area: 'KwaZulu-Natal',
  location_country: 'South Africa',
};

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('useLocationSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockedGeocodeLocation.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts empty and does not call geocodeLocation', () => {
    const { result } = renderHook(() => useLocationSearch());

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockedGeocodeLocation).not.toHaveBeenCalled();
  });

  it('does not call geocodeLocation before the debounce delay elapses', async () => {
    const { result } = renderHook(() => useLocationSearch());

    act(() => {
      result.current.setSearchTerm('Glenwood');
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(299);
    });

    expect(mockedGeocodeLocation).not.toHaveBeenCalled();
  });

  it('fetches suggestions once the debounce delay elapses', async () => {
    mockedGeocodeLocation.mockResolvedValue([testLocation]);
    const { result } = renderHook(() => useLocationSearch());

    act(() => {
      result.current.setSearchTerm('Glenwood');
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(mockedGeocodeLocation).toHaveBeenCalledWith('Glenwood', expect.any(AbortSignal));
    expect(result.current.suggestions).toEqual([testLocation]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('is loading while the request is in flight', async () => {
    const deferred = createDeferred<LocationResults>();
    mockedGeocodeLocation.mockReturnValue(deferred.promise);

    const { result } = renderHook(() => useLocationSearch());

    act(() => {
      result.current.setSearchTerm('Glenwood');
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      deferred.resolve([testLocation]);
      await deferred.promise;
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.suggestions).toEqual([testLocation]);
  });

  it('sets an error message and clears suggestions when the request fails', async () => {
    mockedGeocodeLocation.mockRejectedValue(
      new Error('Geocoding request failed with status 500.'),
    );
    const { result } = renderHook(() => useLocationSearch());

    act(() => {
      result.current.setSearchTerm('Glenwood');
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(result.current.error).toBe('Geocoding request failed with status 500.');
    expect(result.current.suggestions).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('aborts a superseded request when the search term changes again before it resolves', async () => {
    const first = createDeferred<LocationResults>();
    const second = createDeferred<LocationResults>();
    let firstSignal: AbortSignal | undefined;
    let secondSignal: AbortSignal | undefined;

    mockedGeocodeLocation
      .mockImplementationOnce((_query, signal) => {
        firstSignal = signal;
        return first.promise;
      })
      .mockImplementationOnce((_query, signal) => {
        secondSignal = signal;
        return second.promise;
      });

    const { result } = renderHook(() => useLocationSearch());

    act(() => {
      result.current.setSearchTerm('Glen');
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    act(() => {
      result.current.setSearchTerm('Glenwood');
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(firstSignal?.aborted).toBe(true);
    expect(secondSignal?.aborted).toBe(false);

    await act(async () => {
      second.resolve([testLocation]);
      await second.promise;
    });

    expect(result.current.suggestions).toEqual([testLocation]);

    // a stale/aborted request resolving late (a real fetch never does this,
    // but nothing stops a mock or edge case from doing so) must not override
    // the newer, already-applied result
    const staleLocation: Location = { ...testLocation, location_title: 'Stale' };
    await act(async () => {
      first.resolve([staleLocation]);
      await first.promise;
    });

    expect(result.current.suggestions).toEqual([testLocation]);
  });

  it('keeps reflecting the previous term until the debounce for the cleared value elapses', async () => {
    mockedGeocodeLocation.mockResolvedValue([testLocation]);
    const { result } = renderHook(() => useLocationSearch());

    act(() => {
      result.current.setSearchTerm('Glenwood');
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(result.current.suggestions).toEqual([testLocation]);

    act(() => {
      result.current.setSearchTerm('');
    });

    // debouncedSearchTerm hasn't caught up to the clear yet, so hasQuery is
    // still true and suggestions/error still reflect the previous term
    expect(result.current.suggestions).toEqual([testLocation]);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
