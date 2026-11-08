import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  startGame,
  addGuessToHistory,
  endGame,
  resetToSettings,
} from './state';

describe('state', () => {
  it('should create initial state in "settings" status', () => {
    const state = createInitialState();
    expect(state.status).toBe('settings');
    expect(state.history).toEqual([]);
    expect(state.secret).toBeNull();
  });

  it('should start game with given settings and secret', () => {
    const state = createInitialState();
    const next = startGame(state, { length: 4, base: 10 }, '1234');
    expect(next.status).toBe('playing');
    expect(next.secret).toBe('1234');
    expect(next.settings).toEqual({ length: 4, base: 10 });
    expect(next.startTime).toBeTypeOf('number');
    expect(next.history).toEqual([]);
  });

  it('should not mutate original state when starting game', () => {
    const state = createInitialState();
    startGame(state, { length: 4, base: 10 }, '1234');
    expect(state.status).toBe('settings');
    expect(state.secret).toBeNull();
  });

  it('should append entry to history immutably', () => {
    const state = startGame(
      createInitialState(),
      { length: 4, base: 10 },
      '1234',
    );
    const next = addGuessToHistory(state, '5678', { bulls: 0, cows: 0 });
    expect(next.history).toHaveLength(1);
    expect(next.history[0]).toMatchObject({ guess: '5678', bulls: 0, cows: 0 });
    expect(state.history).toHaveLength(0);
  });

  it('should not add duplicate guesses to history', () => {
    let state = startGame(
      createInitialState(),
      { length: 4, base: 10 },
      '1234',
    );
    state = addGuessToHistory(state, '5678', { bulls: 0, cows: 0 });
    state = addGuessToHistory(state, '5678', { bulls: 0, cows: 0 });
    expect(state.history).toHaveLength(1);
  });

  it('should end game with "won" status when bulls === length', () => {
    let state = startGame(
      createInitialState(),
      { length: 4, base: 10 },
      '1234',
    );
    state = addGuessToHistory(state, '1234', { bulls: 4, cows: 0 });
    state = endGame(state);
    expect(state.status).toBe('won');
    expect(state.endTime).toBeTypeOf('number');
  });

  it('should reset to settings without mutating original', () => {
    let state = startGame(
      createInitialState(),
      { length: 4, base: 10 },
      '1234',
    );
    state = addGuessToHistory(state, '5678', { bulls: 0, cows: 0 });
    const reset = resetToSettings(state);
    expect(reset.status).toBe('settings');
    expect(reset.secret).toBeNull();
    expect(reset.history).toEqual([]);
    expect(state.status).toBe('playing');
  });
});
