import { describe, expect, it } from 'vitest';
import { formatReading } from './formatReading';

describe('formatReading', () => {
  it('applies the formatter to a present numeric value', () => {
    expect(formatReading(24.4, (n) => `${Math.round(n)}°C`)).toBe('24°C');
  });

  it('coerces a numeric string before formatting', () => {
    expect(formatReading('24.4', (n) => `${Math.round(n)}°C`)).toBe('24°C');
  });

  it('returns "-" for null', () => {
    expect(formatReading(null, (n) => `${n}°C`)).toBe('-');
  });

  it('returns "-" for undefined', () => {
    expect(formatReading(undefined, (n) => `${n}°C`)).toBe('-');
  });

  it('returns "-" for a non-numeric string', () => {
    expect(formatReading('n/a', (n) => `${n}°C`)).toBe('-');
  });

  it('does not treat 0 as missing', () => {
    expect(formatReading(0, (n) => `${n}°C`)).toBe('0°C');
  });
});
