import { describe, it, expect } from 'vitest';
import { evaluateGuess } from './evaluateGuess';

describe('evaluateGuess', () => {
  it('should return all bulls when guess equals secret', () => {
    expect(evaluateGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 });
  });

  it('should return all cows when digits are in wrong positions', () => {
    expect(evaluateGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 });
  });

  it('should return mixed bulls and cows correctly', () => {
    expect(evaluateGuess('1234', '1243')).toEqual({ bulls: 2, cows: 2 });
  });

  it('should return zeros when no digits match', () => {
    expect(evaluateGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 });
  });

  it('should handle hex digits case-insensitively', () => {
    expect(evaluateGuess('abc1', 'ABC1')).toEqual({ bulls: 4, cows: 0 });
    expect(evaluateGuess('abc1', 'cba1')).toEqual({ bulls: 2, cows: 2 });
  });

  it('should handle leading zeros', () => {
    expect(evaluateGuess('0123', '3210')).toEqual({ bulls: 0, cows: 4 });
  });

  it('should count duplicate digits in guess only once', () => {
    expect(evaluateGuess('1234', '1123')).toEqual({ bulls: 1, cows: 2 });
  });

  it('should handle duplicate bulls without counting extra cows', () => {
    expect(evaluateGuess('1234', '2233')).toEqual({ bulls: 2, cows: 0 });
  });
});
