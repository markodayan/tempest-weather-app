import { describe, expect, it } from 'vitest';
import { formatLatitude, formatLongitude } from './coordinates';

describe('formatLatitude', () => {
  it('formats a positive latitude as degrees/minutes North', () => {
    expect(formatLatitude(33.9167)).toBe("33°55'N");
  });

  it('formats a negative latitude as degrees/minutes South', () => {
    expect(formatLatitude(-33.9167)).toBe("33°55'S");
  });

  it('carries a minute rounding up to 60 into the next degree', () => {
    expect(formatLatitude(45.9999)).toBe("46°0'N");
  });

  it('treats the equator as North', () => {
    expect(formatLatitude(0)).toBe("0°0'N");
  });
});

describe('formatLongitude', () => {
  it('formats a positive longitude as degrees/minutes East', () => {
    expect(formatLongitude(18.4)).toBe("18°24'E");
  });

  it('formats a negative longitude as degrees/minutes West', () => {
    expect(formatLongitude(-18.4)).toBe("18°24'W");
  });

  it('carries a minute rounding up to 60 into the next degree', () => {
    expect(formatLongitude(-45.9999)).toBe("46°0'W");
  });

  it('treats the prime meridian as East', () => {
    expect(formatLongitude(0)).toBe("0°0'E");
  });
});
