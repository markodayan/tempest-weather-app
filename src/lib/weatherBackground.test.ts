import { describe, expect, it } from 'vitest';
import { getWeatherMood, getWeatherBackgroundSrc } from './weatherBackground';

describe('getWeatherMood', () => {
  it('maps clear-sky codes to clear', () => {
    expect(getWeatherMood(0)).toBe('clear');
    expect(getWeatherMood(1)).toBe('clear');
  });

  it('maps partly cloudy (code 2) to its own bucket, distinct from fully overcast', () => {
    expect(getWeatherMood(2)).toBe('partly-cloudy');
  });

  it('maps cloud/fog codes (dry, fully overcast) to cloudy', () => {
    expect(getWeatherMood(3)).toBe('cloudy');
    expect(getWeatherMood(45)).toBe('cloudy');
  });

  it('maps drizzle/rain codes to rainy', () => {
    expect(getWeatherMood(51)).toBe('rainy');
    expect(getWeatherMood(61)).toBe('rainy');
    expect(getWeatherMood(80)).toBe('rainy');
  });

  it('maps snow codes to snowy regardless of severity', () => {
    expect(getWeatherMood(71)).toBe('snowy');
    expect(getWeatherMood(75)).toBe('snowy');
  });

  it('maps snow shower codes to snowy', () => {
    expect(getWeatherMood(85)).toBe('snowy');
    expect(getWeatherMood(86)).toBe('snowy');
  });

  it('maps heavy/violent/icy/thunderstorm codes to stormy', () => {
    expect(getWeatherMood(56)).toBe('stormy');
    expect(getWeatherMood(65)).toBe('stormy');
    expect(getWeatherMood(66)).toBe('stormy');
    expect(getWeatherMood(95)).toBe('stormy');
    expect(getWeatherMood(99)).toBe('stormy');
  });

  it('falls back to the neutral cloudy bucket for an unrecognised code', () => {
    expect(getWeatherMood(-1)).toBe('cloudy');
  });
});

describe('getWeatherBackgroundSrc', () => {
  it('builds the /day-preview/<mood>.webp path', () => {
    expect(getWeatherBackgroundSrc(0)).toBe('/day-preview/clear.webp');
    expect(getWeatherBackgroundSrc(2)).toBe('/day-preview/partly-cloudy.webp');
    expect(getWeatherBackgroundSrc(71)).toBe('/day-preview/snowy.webp');
    expect(getWeatherBackgroundSrc(95)).toBe('/day-preview/stormy.webp');
  });
});
