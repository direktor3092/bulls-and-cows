import { describe, it, expect } from 'vitest';
import { generateSecret } from './generateSecret';

describe('generateSecret', () => {
  it('should generate a secret of the correct length', () => {
    const secret = generateSecret(4, 10);
    expect(secret.length).toBe(4);
  });

  it('should contain only unique digits', () => {
    const secret = generateSecret(4, 10);
    const uniqueDigits = new Set(secret.split(''));
    expect(uniqueDigits.size).toBe(4);
  });

  it('should contain only valid digits for the given base', () => {
    const secret = generateSecret(3, 8);
    expect(secret).toMatch(/^[0-7]{3}$/);
  });

  it('should be deterministic when a custom random function is provided', () => {
    const mockRandom = () => 0;
    const secret1 = generateSecret(4, 10, mockRandom);
    const secret2 = generateSecret(4, 10, mockRandom);
    expect(secret1).toBe(secret2);
  });

  it('should handle leading zeros correctly (return a string)', () => {
    const mockRandom = () => 0.99;
    const secret = generateSecret(2, 2, mockRandom);
    expect(typeof secret).toBe('string');
    expect(secret).toBe('01');
  });
});
