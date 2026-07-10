import type { Location, LocationResults } from './types';
import { extractCountryHint } from './countryCodes';

const GEOCODER_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

const GEOCODING_RESULT_COUNT = 10;
const MIN_QUERY_LENGTH = 2;

// Open-Meteo's `count` limits the raw name-matched pool *before* `countryCode`
// filtering is applied, not the final filtered result count — so a small `count`
// can filter down to zero even when matches exist. When a country hint is given,
// request the API's max pool size and slice down to GEOCODING_RESULT_COUNT ourselves.
const MAX_API_RESULT_COUNT = 100;

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
  timezone?: string;
  postcodes?: string[];
  population: number;
  country_id?: number;
  country?: string;
  admin1?: string;
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
    timezone: item.timezone ?? '',
    location_title: item.name,
    location_area: item.admin1 ?? '',
    location_country: item.country ?? '',
  };
}

export async function geocodeLocation(
  query: string,
  signal?: AbortSignal,
): Promise<LocationResults> {
  // supports an optional trailing country name/code (e.g. "Glenwood South Africa" or
  // "Glenwood, South Africa") to disambiguate common place names — Open-Meteo ranks by
  // population/feature type, so small suburbs sharing a name with larger, more populous
  // places elsewhere can be buried far past the requested result count.
  const { name: namePart, countryCode } = extractCountryHint(query);

  const trimmedQuery = namePart.trim();

  // only start debounce search if more than 1 char typed
  if (trimmedQuery.length < MIN_QUERY_LENGTH) {
    return [];
  }

  const params = new URLSearchParams({
    name: trimmedQuery,
    count: String(countryCode ? MAX_API_RESULT_COUNT : GEOCODING_RESULT_COUNT),
  });

  if (countryCode) {
    params.set('countryCode', countryCode);
  }

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

  return (data.results?.map(normaliseLocation) ?? []).slice(0, GEOCODING_RESULT_COUNT);
}
