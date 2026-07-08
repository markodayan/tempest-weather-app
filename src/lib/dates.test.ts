import { describe, expect, it } from 'vitest';
import { formatDayLabelShort, formatDayLabelLong, formatTimeOfDay } from './dates';

describe('formatDayLabelShort', () => {
  it('returns "Today" when isToday is true, regardless of the date', () => {
    expect(formatDayLabelShort('2026-07-09', true)).toBe('Today');
  });

  it('formats a non-today date as weekday, day, short month', () => {
    expect(formatDayLabelShort('2026-07-09', false)).toBe('Thu 9 Jul');
  });

  it('does not shift the date across a UTC-negative local timezone boundary', () => {
    // 2026-01-01 00:00 UTC is still 2025-12-31 in negative-offset timezones (e.g. US) -
    // parsing/formatting must stay pinned to the date string, not the local clock.
    expect(formatDayLabelShort('2026-01-01', false)).toBe('Thu 1 Jan');
  });
});

describe('formatDayLabelLong', () => {
  it('returns "Today" when isToday is true, regardless of the date', () => {
    expect(formatDayLabelLong('2026-07-09', true)).toBe('Today');
  });

  it('formats a non-today date as full weekday, day, full month', () => {
    expect(formatDayLabelLong('2026-07-09', false)).toBe('Thursday 9 July');
  });
});

describe('formatTimeOfDay', () => {
  it('extracts the HH:mm portion of an ISO datetime string', () => {
    expect(formatTimeOfDay('2026-07-08T06:51')).toBe('06:51');
  });
});
