export type GameStatus = 'settings' | 'playing' | 'won';

export interface GameSettings {
  length: number;
  base: number;
}

export interface HistoryEntry {
  guess: string;
  bulls: number;
  cows: number;
}

export interface GameState {
  status: GameStatus;
  settings: GameSettings;
  secret: string | null;
  history: HistoryEntry[];
  startTime: number | null;
  endTime: number | null;
}

export const createInitialState = (): GameState => ({
  status: 'settings',
  settings: { length: 4, base: 10 },
  secret: null,
  history: [],
  startTime: null,
  endTime: null,
});

export const startGame = (
  state: GameState,
  settings: GameSettings,
  secret: string,
): GameState => ({
  ...state,
  status: 'playing',
  settings,
  secret,
  history: [],
  startTime: Date.now(),
  endTime: null,
});

export const addGuessToHistory = (
  state: GameState,
  guess: string,
  result: { bulls: number; cows: number },
): GameState => {
  const normalizedGuess = guess.toLowerCase();
  const isDuplicate = state.history.some(
    (entry) => entry.guess.toLowerCase() === normalizedGuess,
  );
  if (isDuplicate) return state;

  const entry: HistoryEntry = {
    guess: normalizedGuess,
    bulls: result.bulls,
    cows: result.cows,
  };

  return { ...state, history: [...state.history, entry] };
};

export const endGame = (state: GameState): GameState => ({
  ...state,
  status: 'won',
  endTime: Date.now(),
});

export const resetToSettings = (state: GameState): GameState => ({
  ...createInitialState(),
  settings: state.settings,
});
