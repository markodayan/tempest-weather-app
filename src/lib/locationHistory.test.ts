import { describe, expect, it } from 'vitest';
import { addToLocationHistory, locationHistoryKey, MAX_HISTORY_SIZE } from './locationHistory';
import type { Location } from '../api';

function buildLocation(overrides: Partial<Location> = {}): Location {
  return {
    id: 1,
    latitude: -33.92584,
    longitude: 18.42322,
    timezone: 'Africa/Johannesburg',
    location_title: 'Cape Town',
    location_area: 'Western Cape',
    location_country: 'South Africa',
    ...overrides,
  };
}

describe('locationHistoryKey', () => {
  it('rounds coordinates to 2 decimal places', () => {
    const location = buildLocation({ latitude: -33.92584, longitude: 18.42322 });
    expect(locationHistoryKey(location)).toBe('-33.93,18.42');
  });

  it('produces the same key for two locations whose coordinates only differ beyond 2 decimals', () => {
    const a = buildLocation({ latitude: -33.9258, longitude: 18.4232 });
    const b = buildLocation({ latitude: -33.9261, longitude: 18.4229, id: 2 });
    expect(locationHistoryKey(a)).toBe(locationHistoryKey(b));
  });

  it('produces different keys for meaningfully different coordinates', () => {
    const capeTown = buildLocation();
    const dubai = buildLocation({ latitude: 25.07725, longitude: 55.30927, id: -2 });
    expect(locationHistoryKey(capeTown)).not.toBe(locationHistoryKey(dubai));
  });
});

describe('addToLocationHistory', () => {
  it('prepends a new location to an empty history', () => {
    const capeTown = buildLocation();
    expect(addToLocationHistory([], capeTown)).toEqual([capeTown]);
  });

  it('prepends a new location ahead of existing entries', () => {
    const capeTown = buildLocation();
    const dubai = buildLocation({ latitude: 25.07725, longitude: 55.30927, id: -2 });
    expect(addToLocationHistory([capeTown], dubai)).toEqual([dubai, capeTown]);
  });

  it('does not add a duplicate - re-adding an existing location bumps it to the front instead', () => {
    const capeTown = buildLocation();
    const dubai = buildLocation({ latitude: 25.07725, longitude: 55.30927, id: -2 });
    const history = [dubai, capeTown];

    const result = addToLocationHistory(history, capeTown);

    expect(result).toEqual([capeTown, dubai]);
  });

  it('treats near-duplicate coordinates (within 2 decimal places) as the same location', () => {
    const original = buildLocation({ latitude: -33.9258, longitude: 18.4232 });
    const nearDuplicate = buildLocation({ latitude: -33.9261, longitude: 18.4229, id: 99 });

    const result = addToLocationHistory([original], nearDuplicate);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(nearDuplicate);
  });

  it('discards the oldest entry once history would exceed MAX_HISTORY_SIZE', () => {
    const history = Array.from({ length: MAX_HISTORY_SIZE }, (_, index) =>
      buildLocation({ latitude: index, longitude: index, id: index }),
    );
    const newLocation = buildLocation({ latitude: 99, longitude: 99, id: 99 });

    const result = addToLocationHistory(history, newLocation);

    expect(result).toHaveLength(MAX_HISTORY_SIZE);
    expect(result[0]).toEqual(newLocation);
    expect(result).not.toContainEqual(history[MAX_HISTORY_SIZE - 1]);
  });
});
