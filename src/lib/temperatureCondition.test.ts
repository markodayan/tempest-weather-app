import { describe, expect, it } from 'vitest';
import { getTemperatureCondition } from './temperatureCondition';

describe('getTemperatureCondition', () => {
  it('labels each Celsius bucket at its boundary and mid-range', () => {
    expect(getTemperatureCondition(0, 'celsius')).toBe('Freezing');
    expect(getTemperatureCondition(-5, 'celsius')).toBe('Freezing');
    expect(getTemperatureCondition(8, 'celsius')).toBe('Cold');
    expect(getTemperatureCondition(4, 'celsius')).toBe('Cold');
    expect(getTemperatureCondition(11, 'celsius')).toBe('Chilly');
    expect(getTemperatureCondition(19, 'celsius')).toBe('Mild');
    expect(getTemperatureCondition(25, 'celsius')).toBe('Warm');
    expect(getTemperatureCondition(31, 'celsius')).toBe('Hot');
    expect(getTemperatureCondition(32, 'celsius')).toBe('Scorching');
    expect(getTemperatureCondition(40, 'celsius')).toBe('Scorching');
  });

  it('converts Fahrenheit back to Celsius before bucketing, so the label matches the physical temperature regardless of display unit', () => {
    // 11°C == ~51.8°F
    expect(getTemperatureCondition(51.8, 'fahrenheit')).toBe('Chilly');
    // 0°C == 32°F
    expect(getTemperatureCondition(32, 'fahrenheit')).toBe('Freezing');
    // 100°F == ~37.8°C
    expect(getTemperatureCondition(100, 'fahrenheit')).toBe('Scorching');
  });
});
