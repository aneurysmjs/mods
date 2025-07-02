import { describe, expect, it } from 'vitest';
import looksLike from './looksLike.js';

describe('looksLike', () => {
  it('should return true for matching primitive values', () => {
    const a = { name: 'John', age: 30 };
    const b = { name: 'John', age: 30 };
    expect(looksLike(a, b)).toBe(true);
  });

  it('should return false for non-matching primitive values', () => {
    const a = { name: 'John', age: 30 };
    const b = { name: 'Doe', age: 30 };
    expect(looksLike(a, b)).toBe(false);
  });

  it('should return true for matching nested objects', () => {
    const a = { user: { name: 'John', age: 30 } };
    const b = { user: { name: 'John', age: 30 } };
    expect(looksLike(a, b)).toBe(true);
  });

  it('should return false for non-matching nested objects', () => {
    const a = { user: { name: 'John', age: 30 } };
    const b = { user: { name: 'Doe', age: 30 } };
    expect(looksLike(a, b)).toBe(false);
  });

  it('should return true when b contains functions that match a values', () => {
    const a = { age: 30 };
    const b = { age: (val) => val === 30 };
    expect(looksLike(a, b)).toBe(true);
  });

  it('should return false when b contains functions that do not match a values', () => {
    const a = { age: 30 };
    const b = { age: (val) => val === 25 };
    expect(looksLike(a, b)).toBe(false);
  });

  it('should return false if either a or b is undefined', () => {
    const a = { name: 'John' };
    expect(looksLike(a, undefined)).toBe(false);
    expect(looksLike(undefined, { name: 'John' })).toBe(false);
  });

  it('should return true for empty objects', () => {
    expect(looksLike({}, {})).toBe(true);
  });

  it('should return false for non-matching empty and non-empty objects', () => {
    const a = { name: 'John' };
    const b = {};
    expect(looksLike(a, b)).toBe(false);
  });
});
