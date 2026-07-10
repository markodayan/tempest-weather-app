import type { Location } from '../api';

// Joins a location's title/area/country, skipping any empty parts - some geocoding
// results (e.g. country-level entries like "Greenland" itself) come back with no
// area/country data at all, so a naive join would otherwise leave stray ", ,"s.
export function formatLocationLabel(location: Location): string {
  return [location.location_title, location.location_area, location.location_country]
    .filter((part) => part.length > 0)
    .join(', ');
}
