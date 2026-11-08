import { GameState } from '../state/state';
import { el } from './dom';

export const renderWinScreen = (
  state: GameState,
  onNewGame: () => void,
): HTMLElement => {
  const container = el('section', { class: 'win-screen' });
  const attempts = state.history.length;
  const timeMs = (state.endTime ?? 0) - (state.startTime ?? 0);
  const seconds = Math.round(timeMs / 1000);

  container.append(
    el('h1', { class: 'win-title', text: '🏆 You win!' }),
    el('p', { class: 'win-subtitle', text: 'The beast is slain' }),
    el('div', { class: 'win-stats-card' }),
  );

  const statsCard = container.querySelector('.win-stats-card')!;
  statsCard.append(el('div', { class: 'stat-row' }));
  statsCard.replaceChildren(
    createStatRow('Secret', state.secret ?? ''),
    createStatRow('Attempts', String(attempts)),
    createStatRow('Time', `${seconds}s`),
    createStatRow(
      'Settings',
      `length ${state.settings.length}, base ${state.settings.base}`,
    ),
  );

  container.append(
    el('button', {
      class: 'start-btn',
      type: 'button',
      text: 'New game',
      onclick: onNewGame,
    }),
  );

  return container;
};

const createStatRow = (label: string, value: string): HTMLElement => {
  const row = el('div', { class: 'stat-row' });
  row.append(
    el('span', { class: 'stat-label', text: label }),
    el('span', { class: 'stat-value', text: value }),
  );
  return row;
};
