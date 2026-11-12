import { describe, it, expect } from 'vitest';
import { countPossibleSecrets } from './countPossibleSecrets';

describe('countPossibleSecrets', () => {
  it('should return 1 when length is 0', () => {
    expect(countPossibleSecrets(0, 10)).toBe(1);
  });

  it('should return base when length is 1', () => {
    expect(countPossibleSecrets(1, 10)).toBe(10);
    expect(countPossibleSecrets(1, 16)).toBe(16);
  });

  it('should calculate P(base, length) correctly for small values', () => {
    expect(countPossibleSecrets(2, 2)).toBe(2);
    expect(countPossibleSecrets(3, 4)).toBe(24);
    expect(countPossibleSecrets(2, 16)).toBe(240);
  });

  it('should calculate P(10, 4) = 5040', () => {
    expect(countPossibleSecrets(4, 10)).toBe(5040);
  });

  it('should return 0 when length exceeds base', () => {
    expect(countPossibleSecrets(5, 2)).toBe(0);
    expect(countPossibleSecrets(10, 8)).toBe(0);
  });

  it('should return consistent results on repeated calls (memoization)', () => {
    const first = countPossibleSecrets(6, 10);
    const second = countPossibleSecrets(6, 10);
    expect(first).toBe(second);
    expect(first).toBe(151200);
  });
});
