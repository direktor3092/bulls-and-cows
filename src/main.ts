import './style.css';
import { createInitialState, startGame, resetToSettings } from './state/state';
import { renderSettings } from './ui/settings';
import { renderGame } from './ui/game';
import { renderWinScreen } from './ui/win';
import { generateSecret } from './core/generateSecret';
import { saveRecord } from './services/leaderboard';
import { initFireEffect } from './ui/fire-effect';

const root = document.createElement('div');
root.id = 'root';
document.body.append(root);

let state = createInitialState();

const renderApp = (): void => {
  if (state.status === 'settings') {
    root.replaceChildren(
      renderSettings(state.settings, (settings) => {
        const secret = generateSecret(settings.length, settings.base);
        state = startGame(state, settings, secret);
        renderApp();
      }),
    );
  } else if (state.status === 'playing') {
    root.replaceChildren(
      renderGame(
        state,
        (newState, isWin) => {
          state = newState;
          if (isWin) {
            saveRecord({
              attempts: state.history.length,
              timeMs: (state.endTime ?? 0) - (state.startTime ?? 0),
              length: state.settings.length,
              base: state.settings.base,
              timestamp: Date.now(),
            });
          }
          renderApp();
        },
        () => {
          state = resetToSettings(state);
          renderApp();
        },
      ),
    );
  } else {
    root.replaceChildren(
      renderWinScreen(state, () => {
        state = resetToSettings(state);
        renderApp();
      }),
    );
  }
};

renderApp();
initFireEffect();
