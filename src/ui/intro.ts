import { el } from './dom';

export const renderIntro = (onEnter: () => void): HTMLElement => {
  const container = el('section', { class: 'intro-screen' });

  const textBlock = el('div', { class: 'intro-text-block' });
  textBlock.append(
    el('h1', { class: 'intro-title', text: 'direktor3092' }),
    el('p', { class: 'intro-subtitle', text: 'presents' }),
  );

  const btn = el('button', {
    class: 'start-btn intro-btn',
    type: 'button',
    text: 'Enter the Dungeon',
    onclick: onEnter,
  });

  container.append(textBlock, btn);
  return container;
};
