import { describe, it, expect } from 'vitest';
import { createDigitValidator } from './createDigitValidator';

describe('createDigitValidator', () => {
  it('should return true for valid digits in given base', () => {
    const isHex = createDigitValidator(16);
    expect(isHex('0')).toBe(true);
    expect(isHex('9')).toBe(true);
    expect(isHex('a')).toBe(true);
    expect(isHex('f')).toBe(true);
  });

  it('should return false for digits outside the given base', () => {
    const isBinary = createDigitValidator(2);
    expect(isBinary('0')).toBe(true);
    expect(isBinary('1')).toBe(true);
    expect(isBinary('2')).toBe(false);
    expect(isBinary('a')).toBe(false);
  });

  it('should handle uppercase hex digits (case-insensitive)', () => {
    const isHex = createDigitValidator(16);
    expect(isHex('A')).toBe(true);
    expect(isHex('F')).toBe(true);
  });

  it('should return false for non-digit characters', () => {
    const isDecimal = createDigitValidator(10);
    expect(isDecimal('z')).toBe(false);
    expect(isDecimal('!')).toBe(false);
    expect(isDecimal(' ')).toBe(false);
  });
});
