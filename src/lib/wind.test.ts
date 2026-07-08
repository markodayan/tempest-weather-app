import { describe, expect, it } from 'vitest';
import { degreesToCompassDirection } from './wind';

describe('degreesToCompassDirection', () => {
  it('maps the four cardinal directions', () => {
    expect(degreesToCompassDirection(0)).toBe('N');
    expect(degreesToCompassDirection(90)).toBe('E');
    expect(degreesToCompassDirection(180)).toBe('S');
    expect(degreesToCompassDirection(270)).toBe('W');
  });

  it('maps an intercardinal-adjacent value', () => {
    expect(degreesToCompassDirection(202)).toBe('SSW');
  });

  it('wraps 360 back around to N', () => {
    expect(degreesToCompassDirection(360)).toBe('N');
  });

  it('rounds a value just under the wraparound boundary up to N, not NNW', () => {
    expect(degreesToCompassDirection(359)).toBe('N');
  });
});
