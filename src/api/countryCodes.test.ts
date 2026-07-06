import { describe, expect, it } from 'vitest';
import { extractCountryHint, resolveCountryCode } from './countryCodes';

describe('resolveCountryCode', () => {
  it('resolves a known country name', () => {
    expect(resolveCountryCode('South Africa')).toBe('ZA');
  });

  it('is case-insensitive for country names', () => {
    expect(resolveCountryCode('south africa')).toBe('ZA');
  });

  it('passes through a raw ISO alpha-2 code, uppercased', () => {
    expect(resolveCountryCode('za')).toBe('ZA');
    expect(resolveCountryCode('ZA')).toBe('ZA');
  });

  it('resolves a known alias', () => {
    expect(resolveCountryCode('usa')).toBe('US');
  });

  it('returns undefined for an unrecognised name', () => {
    expect(resolveCountryCode('Nowhereland')).toBeUndefined();
  });
});

describe('extractCountryHint', () => {
  it('splits on an explicit comma', () => {
    expect(extractCountryHint('Glenwood, South Africa')).toEqual({
      name: 'Glenwood',
      countryCode: 'ZA',
    });
  });

  it('splits on an explicit comma with a raw ISO code', () => {
    expect(extractCountryHint('Glenwood, ZA')).toEqual({
      name: 'Glenwood',
      countryCode: 'ZA',
    });
  });

  it('detects a trailing country name with no comma', () => {
    expect(extractCountryHint('Glenwood South Africa')).toEqual({
      name: 'Glenwood',
      countryCode: 'ZA',
    });
  });

  it('leaves the query untouched when there is no country hint', () => {
    expect(extractCountryHint('Glenwood')).toEqual({ name: 'Glenwood', countryCode: undefined });
  });

  it('does not misinterpret an ordinary multi-word place name as a country hint', () => {
    expect(extractCountryHint('New York')).toEqual({ name: 'New York', countryCode: undefined });
  });

  it('does not treat a single short word as a country code', () => {
    expect(extractCountryHint('Bo')).toEqual({ name: 'Bo', countryCode: undefined });
  });

  it('still strips the comma-separated name when the country hint is unrecognised', () => {
    expect(extractCountryHint('Glenwood, Nowhereland')).toEqual({
      name: 'Glenwood',
      countryCode: undefined,
    });
  });
});
