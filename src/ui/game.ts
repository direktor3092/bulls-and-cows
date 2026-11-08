import { createDigitValidator } from '../core/createDigitValidator';
import { evaluateGuess } from '../core/evaluateGuess';
import { isValidGuess } from '../core/isValidGuess';
import { GameState, addGuessToHistory, endGame } from '../state/state';
import { el } from './dom';

export const renderGame = (
  state: GameState,
  onStateUpdate: (newState: GameState, isWin: boolean) => void,
  onNewGame: () => void,
): HTMLElement => {
  const container = el('section', { class: 'game-screen' });

  const header = el('div', { class: 'game-header' });
  header.append(
    el('div', { class: 'badge', text: `Length: ${state.settings.length}` }),
    el('div', { class: 'badge', text: `Base: ${state.settings.base}` }),
  );
  container.append(header);

  const historyList = el('div', { class: 'history-list' });
  state.history.forEach((entry, index) => {
    const row = el('div', { class: 'history-row' });
    row.append(
      el('span', { class: 'history-index', text: `${index + 1}.` }),
      el('span', { class: 'history-guess', text: entry.guess }),
      el('span', { class: 'history-bulls', text: `🐂 ${entry.bulls}` }),
      el('span', { class: 'history-cows', text: `🐄 ${entry.cows}` }),
    );
    historyList.append(row);
  });
  container.append(historyList);

  const inputRow = el('div', { class: 'input-row' });
  const input = el('input', {
    class: 'guess-input',
    type: 'text',
    maxlength: state.settings.length,
    placeholder: `Enter ${state.settings.length} digits...`,
  }) as HTMLInputElement;

  const isDigit = createDigitValidator(state.settings.base);

  input.addEventListener('input', () => {
    const filtered = input.value.split('').filter(isDigit).join('');
    if (input.value !== filtered) {
      input.value = filtered;
    }
  });

  const submitBtn = el('button', {
    class: 'submit-btn',
    type: 'button',
    text: 'Check',
    onclick: () => {
      const guess = input.value.toLowerCase();

      if (!isValidGuess(guess, state.settings.length, state.settings.base)) {
        input.classList.add('shake-error');
        setTimeout(() => input.classList.remove('shake-error'), 500);
        return;
      }

      const result = evaluateGuess(state.secret!, guess);
      const newState = addGuessToHistory(state, guess, result);

      input.value = '';

      if (result.bulls === state.settings.length) {
        const wonState = endGame(newState);
        onStateUpdate(wonState, true);
      } else {
        onStateUpdate(newState, false);
      }
    },
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitBtn.click();
  });

  inputRow.append(input, submitBtn);
  container.append(inputRow);

  const newGameBtn = el('button', {
    class: 'new-game-btn',
    type: 'button',
    text: 'New game',
    onclick: onNewGame,
  });

  const footer = el('div', { class: 'game-footer' });
  footer.append(newGameBtn);
  container.append(footer);

  return container;
};
