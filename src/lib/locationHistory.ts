import type { Location } from '../api';

export const MAX_HISTORY_SIZE = 5;

// A location's own `id` isn't a reliable dedup key across the app's two sources - geocodeLocation
// returns Open-Meteo's real (stable, globally unique) id, while reverseGeocodeCoordinates has none
// to draw from and synthesizes one. Deriving a key fresh from the coordinates themselves, rounded
// to 2 decimal places (~1km precision), gives one consistent rule regardless of where a Location
// came from.
export function locationHistoryKey(location: Location): string {
  return `${location.latitude.toFixed(2)},${location.longitude.toFixed(2)}`;
}

// Re-selecting an already-present location bumps it to the front (most-recently-used) rather
// than leaving it in place, matching how "recent" lists usually behave.
export function addToLocationHistory(history: Location[], location: Location): Location[] {
  const key = locationHistoryKey(location);
  const withoutExisting = history.filter((entry) => locationHistoryKey(entry) !== key);

  return [location, ...withoutExisting].slice(0, MAX_HISTORY_SIZE);
}
