import iconBull from '../assets/icon-bull.webp';
import iconCow from '../assets/icon-cow.webp';
import { createDigitValidator } from '../core/createDigitValidator';
import { evaluateGuess } from '../core/evaluateGuess';
import { isValidGuess } from '../core/isValidGuess';
import { GameState, addGuessToHistory, endGame } from '../state/state';
import { el } from './dom';
import { playSFX } from '../services/sound';

const showConfirmNewGame = (onConfirm: () => void): void => {
  document.body.style.overflow = 'hidden';
  const overlay = el('div', { class: 'modal-overlay' });
  const modal = el('div', { class: 'modal-content confirm-modal' });

  const closeModal = (): void => {
    document.body.style.overflow = '';
    overlay.remove();
  };

  const closeBtn = el('button', {
    class: 'modal-close',
    type: 'button',
    text: '×',
    onclick: closeModal,
  });

  const title = el('h2', { class: 'modal-title', text: 'Give up?' });

  const text = el('p', {
    class: 'rules-text',
    text: 'Your current progress will be lost. Are you sure you want to start a new game?',
  });

  const btnRow = el('div', { class: 'confirm-btn-row' });
  btnRow.append(
    el('button', {
      class: 'new-game-btn',
      type: 'button',
      text: 'Cancel',
      onclick: closeModal,
    }),
    el('button', {
      class: 'start-btn',
      type: 'button',
      text: 'Yes',
      onclick: () => {
        document.body.style.overflow = '';
        overlay.remove();
        onConfirm();
      },
    }),
  );

  modal.append(closeBtn, title, text, btnRow);
  overlay.append(modal);
  document.body.append(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
};

const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(minutes)}:${pad(seconds)}`;
};

export const renderGame = (
  state: GameState,
  onStateUpdate: (newState: GameState, isWin: boolean) => void,
  onNewGame: () => void,
): HTMLElement => {
  const container = el('section', { class: 'game-screen' });

  const timerEl = el('div', { class: 'badge timer', text: '00:00' });
  const header = el('div', { class: 'game-header' });
  header.append(
    el('div', { class: 'badge', text: `Length: ${state.settings.length}` }),
    el('div', { class: 'badge', text: `Base: ${state.settings.base}` }),
    timerEl,
  );
  container.append(header);

  const updateTimer = (): void => {
    const start = state.startTime ?? Date.now();
    timerEl.textContent = formatTime(Date.now() - start);
  };
  updateTimer();
  const timerInterval = window.setInterval(() => {
    if (!timerEl.isConnected) {
      window.clearInterval(timerInterval);
      return;
    }
    updateTimer();
  }, 500);

  let activeBullRow: number | null = null;

  const clearHighlights = (): void => {
    container
      .querySelectorAll('.guess-cell.highlight')
      .forEach((c) => c.classList.remove('highlight'));
    container
      .querySelectorAll('.history-bulls.active')
      .forEach((b) => b.classList.remove('active'));
  };

  const toggleBullHighlight = (targetRowIndex: number): void => {
    if (activeBullRow === targetRowIndex) {
      clearHighlights();
      activeBullRow = null;
      return;
    }

    clearHighlights();
    activeBullRow = targetRowIndex;

    const targetEntry = state.history[targetRowIndex];
    if (!targetEntry) return;

    state.history.forEach((prevEntry, prevIndex) => {
      if (prevIndex >= targetRowIndex) return;
      const prevRow = container.querySelector<HTMLElement>(
        `[data-row-index="${prevIndex}"]`,
      );
      if (!prevRow) return;
      const cells = prevRow.querySelectorAll<HTMLElement>('.guess-cell');
      for (let i = 0; i < targetEntry.guess.length; i += 1) {
        if (prevEntry.guess[i] === targetEntry.guess[i]) {
          cells[i]?.classList.add('highlight');
        }
      }
    });

    const badge = container.querySelector<HTMLElement>(
      `[data-row-index="${targetRowIndex}"] .history-bulls`,
    );
    badge?.classList.add('active');
  };

  const historyList = el('div', { class: 'history-list' });

  if (state.history.length === 0) {
    historyList.append(
      el('p', {
        class: 'history-empty',
        text: 'No attempts yet. Make your first guess!',
      }),
    );
  } else {
    state.history.forEach((entry, index) => {
      const row = el('div', { class: 'history-row' });
      row.dataset.rowIndex = String(index);

      const guessCells = el('span', { class: 'history-guess' });
      [...entry.guess].forEach((char) => {
        guessCells.append(el('span', { class: 'guess-cell', text: char }));
      });

      const bullBadge = el('button', {
        class: 'history-bulls',
        type: 'button',
        disabled: index === 0,
        onclick: () => toggleBullHighlight(index),
      });
      bullBadge.append(
        el('img', { src: iconBull, class: 'bulls-icon', alt: 'Bull' }),
        el('span', { text: ` ${entry.bulls}` }),
      );

      const cowBadge = el('span', {
        class: 'history-cows',
      });
      cowBadge.append(
        el('img', { src: iconCow, class: 'cows-icon', alt: 'Cow' }),
        el('span', { text: ` ${entry.cows}` }),
      );

      row.append(
        el('span', { class: 'history-index', text: `${index + 1}.` }),
        guessCells,
        bullBadge,
        cowBadge,
      );
      historyList.append(row);
    });
  }
  container.append(historyList);

  const message = el('p', { class: 'game-message' });
  const inputRow = el('div', { class: 'input-row' });
  const input = el('input', {
    class: 'guess-input',
    type: 'text',
    maxlength: state.settings.length,
    placeholder: `Enter ${state.settings.length} digits...`,
    autocomplete: 'off',
  }) as HTMLInputElement;

  const isDigit = createDigitValidator(state.settings.base);
  input.addEventListener('input', () => {
    const filtered = input.value
      .split('')
      .filter(isDigit)
      .join('')
      .toLowerCase();
    if (input.value !== filtered) input.value = filtered;
  });

  const showMessage = (text: string, isError = false): void => {
    message.textContent = text;
    message.classList.toggle('error', isError);
    window.setTimeout(() => {
      if (message.textContent === text) {
        message.textContent = '';
        message.classList.remove('error');
      }
    }, 1500);
  };

  const submitGuess = (): void => {
    const guess = input.value.toLowerCase();
    playSFX('click');

    if (!isValidGuess(guess, state.settings.length, state.settings.base)) {
      playSFX('error');
      input.classList.add('shake-error');
      window.setTimeout(() => input.classList.remove('shake-error'), 500);
      showMessage(`Enter ${state.settings.length} unique valid digits`, true);
      return;
    }

    const isDuplicate = state.history.some((e) => e.guess === guess);
    if (isDuplicate) {
      playSFX('error');
      input.classList.add('shake-error');
      window.setTimeout(() => input.classList.remove('shake-error'), 500);
      showMessage('Already tried this guess', true);
      input.value = '';
      input.focus();
      return;
    }

    const result = evaluateGuess(state.secret!, guess);
    const newState = addGuessToHistory(state, guess, result);
    input.value = '';

    if (result.bulls === state.settings.length) {
      onStateUpdate(endGame(newState), true);
    } else {
      onStateUpdate(newState, false);
    }
  };

  const submitBtn = el('button', {
    class: 'submit-btn',
    type: 'button',
    text: 'Check',
    onclick: submitGuess,
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitGuess();
  });

  inputRow.append(input, submitBtn);
  container.append(inputRow, message);

  const newGameBtn = el('button', {
    class: 'new-game-btn',
    type: 'button',
    text: 'New game',
    onclick: () => {
      if (state.history.length === 0) {
        onNewGame();
        return;
      }
      showConfirmNewGame(onNewGame);
    },
  });
  const footer = el('div', { class: 'game-footer' });
  footer.append(newGameBtn);
  container.append(footer);

  requestAnimationFrame(() => {
    historyList.scrollTop = historyList.scrollHeight;
    input.focus();
  });

  return container;
};
