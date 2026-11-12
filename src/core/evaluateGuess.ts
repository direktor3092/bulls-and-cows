export const evaluateGuess = (
  secret: string,
  guess: string,
): { bulls: number; cows: number } => {
  const secretLower = secret.toLowerCase();
  const guessLower = guess.toLowerCase();

  const bulls = guessLower
    .split('')
    .filter((char, index) => char === secretLower[index]).length;

  const secretSet = new Set(secretLower.split(''));
  const guessSet = new Set(guessLower.split(''));

  const totalMatches = [...guessSet].filter((char) =>
    secretSet.has(char),
  ).length;

  const cows = totalMatches - bulls;

  return { bulls, cows };
};
