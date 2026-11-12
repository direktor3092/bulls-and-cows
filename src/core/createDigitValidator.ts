const ALL_DIGITS = '0123456789abcdef';

export const createDigitValidator = (base: number) => {
  const validDigits = ALL_DIGITS.slice(0, base);

  return (char: string): boolean => {
    return validDigits.includes(char.toLowerCase());
  };
};
