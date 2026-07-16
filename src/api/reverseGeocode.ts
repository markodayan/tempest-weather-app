import type { Location } from './types';

const REVERSE_GEOCODER_BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

type RawReverseGeocodingResponse = {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  countryName?: string;
};

// No natural numeric id from this API (unlike Open-Meteo's geocoder in geocode.ts) - derive
// a stable one from the coordinates themselves, since Location.id is only ever used as a
// React key / equality check (see Preferences' weatherLocationId), never sent to an API.
// Negative, mirroring Landing.tsx's suggested-location ids, to stay visibly distinct from
// Open-Meteo's real (always positive) geocoding ids.
function deriveLocationId(latitude: number, longitude: number): number {
  return -Math.round((Math.abs(latitude) + Math.abs(longitude)) * 1e6);
}

export async function reverseGeocodeCoordinates(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<Location> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    localityLanguage: 'en',
  });

  let res: Response;

  try {
    res = await fetch(`${REVERSE_GEOCODER_BASE_URL}?${params.toString()}`, { signal });
  } catch (err) {
    throw new Error('Network error while resolving your location.', { cause: err });
  }

  if (!res.ok) {
    throw new Error(`Reverse geocoding request failed with status ${res.status}.`);
  }

  const data = (await res.json()) as RawReverseGeocodingResponse;

  return {
    id: deriveLocationId(latitude, longitude),
    latitude,
    longitude,
    // Left blank like geocode.ts's own fallback - the weather fetch always uses
    // timezone=auto regardless (see CLAUDE.md), so this is never relied on.
    timezone: '',
    location_title: data.locality || data.city || 'Current location',
    location_area: data.principalSubdivision ?? '',
    location_country: data.countryName ?? '',
  };
}
