import './style.css';
import { GameState, createInitialState, startGame } from './state/state';
import { renderSettings } from './ui/settings';
import { renderGame } from './ui/game';

const root = document.createElement('div');
root.id = 'root';
document.body.append(root);

let state: GameState = createInitialState();

const renderApp = (): void => {
  if (state.status === 'settings') {
    root.replaceChildren(
      renderSettings(state.settings, (settings) => {
        import('./core/generateSecret').then(({ generateSecret }) => {
          const secret = generateSecret(settings.length, settings.base);
          state = startGame(state, settings, secret);
          renderApp();
        });
      }),
    );
  } else {
    root.replaceChildren(
      renderGame(
        state,
        (newState, isWin) => {
          state = newState;
          if (isWin) {
            alert(`You won in ${state.history.length} attempts!`);
          }
          renderApp();
        },
        () => {
          state = { ...state, status: 'settings', history: [], secret: null };
          renderApp();
        },
      ),
    );
  }
};

renderApp();
