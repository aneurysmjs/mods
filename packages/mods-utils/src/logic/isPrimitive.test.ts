import { describe, expect, it } from 'vitest';

import isPrimitive from './isPrimitive.js';

describe('isPrimitive', () => {
  it('should be true for boolean', () => {
    expect(isPrimitive(typeof false)).toBe(true);
  });

  it('should be true for string', () => {
    expect(isPrimitive(typeof '')).toBe(true);
  });

  it('should be true for number', () => {
    expect(isPrimitive(typeof 1)).toBe(true);
  });

  it('should be true for symbol', () => {
    expect(isPrimitive(typeof Symbol(`I'm symbol`))).toBe(true);
  });

  it('should be false for object', () => {
    expect(isPrimitive(typeof {})).toBe(true);
  });

  it('should be false for array', () => {
    expect(isPrimitive(typeof [])).toBe(true);
  });

  it('should be false for function', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(isPrimitive(typeof function () {})).toBe(true);
  });
});
