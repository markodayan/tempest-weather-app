import type { Location, LocationResults } from './types';

const GEOCODER_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

const GEOCODING_RESULT_COUNT = 5;
const MIN_QUERY_LENGTH = 2;

type RawGeocodingItem = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id: number;
  admin2_id?: number;
  admin3_id?: number;
  timezone: string;
  postcodes?: string[];
  population: number;
  country_id: number;
  country: string;
  admin1: string;
  admin2?: string;
  admin3?: string;
};

type GeocodingRawResponse = {
  results?: RawGeocodingItem[];
  generationtime_ms: number;
};

function normaliseLocation(item: RawGeocodingItem): Location {
  return {
    id: item.id,
    latitude: item.latitude,
    longitude: item.longitude,
    timezone: item.timezone,
    location_title: item.name,
    location_area: item.admin1 ?? '',
    location_country: item.country,
  };
}

export async function geocodeLocation(query: string, signal?: AbortSignal): Promise<LocationResults> {
  const trimmedQuery = query.trim();

  // only start debounce search if more than 1 char typed
  if (trimmedQuery.length < MIN_QUERY_LENGTH) {
    return [];
  }

  const params = new URLSearchParams({
    name: trimmedQuery,
    count: String(GEOCODING_RESULT_COUNT),
  });

  let res: Response;

  try {
    res = await fetch(`${GEOCODER_BASE_URL}?${params.toString()}`, { signal });
  } catch (err) {
    throw new Error('Network error while geocoding location.', {
      cause: err,
    });
  }

  if (!res.ok) {
    throw new Error(`Geocoding request failed with status ${res.status}.`);
  }

  const data = (await res.json()) as GeocodingRawResponse;

  return data.results?.map(normaliseLocation) ?? [];
}
