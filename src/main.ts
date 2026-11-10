import './style.css';
import faviconUrl from './assets/favicon.png';
const faviconLink = document.createElement('link');
faviconLink.rel = 'icon';
faviconLink.type = 'image/png';
faviconLink.href = faviconUrl;
document.head.appendChild(faviconLink);
import { createInitialState, startGame, resetToSettings } from './state/state';
import { renderIntro } from './ui/intro';
import { renderSettings } from './ui/settings';
import { renderGame } from './ui/game';
import { renderWinScreen } from './ui/win';
import { generateSecret } from './core/generateSecret';
import { saveRecord } from './services/leaderboard';
import {
  playBackgroundMusic,
  pauseBackgroundMusic,
  playSFX,
  preloadSounds,
} from './services/sound';
import { initFireEffect } from './ui/fire-effect';
import bannerImg from './assets/header-banner.webp';

const preloadImages = (): void => {
  const imagesToPreload = [bannerImg];
  imagesToPreload.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};

const root = document.createElement('div');
root.id = 'root';
document.body.append(root);

let state = createInitialState();

const renderApp = (): void => {
  if (state.status === 'intro') {
    root.replaceChildren(
      renderIntro(() => {
        playSFX('start');
        playBackgroundMusic('tristram');
        state = { ...state, status: 'settings' };
        renderApp();
      }),
    );
  } else if (state.status === 'settings') {
    root.replaceChildren(
      renderSettings(state.settings, (settings) => {
        const secret = generateSecret(settings.length, settings.base);
        state = startGame(state, settings, secret);
        playSFX('start');
        playBackgroundMusic('game-music');
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
            pauseBackgroundMusic();
            playSFX('win');
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
          playSFX('click');
          playBackgroundMusic('tristram');
          renderApp();
        },
      ),
    );
  } else {
    root.replaceChildren(
      renderWinScreen(state, () => {
        state = resetToSettings(state);
        playSFX('click');
        playBackgroundMusic('tristram');
        renderApp();
      }),
    );
  }
};

preloadImages();
preloadSounds();
renderApp();
initFireEffect();
