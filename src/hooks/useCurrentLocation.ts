import { useState } from 'react';
import { reverseGeocodeCoordinates } from '../api';
import type { Location } from '../api';

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// GeolocationPositionError isn't reliably usable as an `instanceof` target across browsers,
// so detect it structurally instead - every implementation gives the rejected error a
// numeric `code` (1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT).
function isGeolocationError(err: unknown): err is { code: number } {
  return typeof err === 'object' && err !== null && typeof (err as { code?: unknown }).code === 'number';
}

function describeGeolocationError(err: { code: number }): string {
  switch (err.code) {
    case 1:
      return 'Location permission was denied.';
    case 2:
      return 'Your location could not be determined.';
    case 3:
      return 'Locating you took too long.';
    default:
      return 'Failed to determine your location.';
  }
}

export function useCurrentLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function locate(): Promise<Location | null> {
    setLoading(true);
    setError(null);

    try {
      const position = await getCurrentPosition();
      const location = await reverseGeocodeCoordinates(
        position.coords.latitude,
        position.coords.longitude,
      );
      setLoading(false);
      return location;
    } catch (err) {
      setLoading(false);
      setError(
        isGeolocationError(err)
          ? describeGeolocationError(err)
          : err instanceof Error
            ? err.message
            : 'Failed to determine your location.',
      );
      return null;
    }
  }

  function clearError() {
    setError(null);
  }

  return { locate, loading, error, clearError };
}
