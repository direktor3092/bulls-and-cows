import { describe, it, expect } from 'vitest';
import { isValidGuess } from './isValidGuess';

describe('isValidGuess', () => {
  it('should accept a valid guess', () => {
    expect(isValidGuess('1234', 4, 10)).toBe(true);
  });

  it('should reject guesses with wrong length', () => {
    expect(isValidGuess('123', 4, 10)).toBe(false);
    expect(isValidGuess('12345', 4, 10)).toBe(false);
  });

  it('should reject digits that are not valid for the base', () => {
    expect(isValidGuess('1290', 4, 10)).toBe(true);
    expect(isValidGuess('12a0', 4, 10)).toBe(false);
    expect(isValidGuess('1203', 4, 2)).toBe(false);
  });

  it('should reject guesses with duplicate digits', () => {
    expect(isValidGuess('1123', 4, 10)).toBe(false);
    expect(isValidGuess('1111', 4, 10)).toBe(false);
  });

  it('should handle hex digits case-insensitively', () => {
    expect(isValidGuess('ABCD', 4, 16)).toBe(true);
    expect(isValidGuess('abcd', 4, 16)).toBe(true);
    expect(isValidGuess('AbCd', 4, 16)).toBe(true);
  });

  it('should accept guesses with leading zeros', () => {
    expect(isValidGuess('0123', 4, 10)).toBe(true);
  });

  it('should reject non-digit characters', () => {
    expect(isValidGuess('12!4', 4, 10)).toBe(false);
    expect(isValidGuess('12 4', 4, 10)).toBe(false);
  });
});
