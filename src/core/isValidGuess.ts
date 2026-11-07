import { createDigitValidator } from './createDigitValidator';

export const isValidGuess = (
  guess: string,
  length: number,
  base: number,
): boolean => {
  if (guess.length !== length) return false;

  const isDigit = createDigitValidator(base);
  const allCharsValid = guess.split('').every(isDigit);
  if (!allCharsValid) return false;

  const uniqueChars = new Set(guess.toLowerCase().split(''));
  return uniqueChars.size === guess.length;
};
