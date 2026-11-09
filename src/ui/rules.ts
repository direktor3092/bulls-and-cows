import { el } from './dom';

export const showRulesModal = (): void => {
  const overlay = el('div', { class: 'modal-overlay' });
  const modal = el('div', { class: 'modal-content' });

  const closeBtn = el('button', {
    class: 'modal-close',
    type: 'button',
    text: '×',
    onclick: () => overlay.remove(),
  });

  const title = el('h2', { class: 'modal-title', text: 'How to Play' });
  const rulesText = el('div', { class: 'rules-text' });

  const introText = el('p', {
    text: 'A demonic beast has locked itself in the dungeon. Its weak points are marked with unique runes (digits). Your task is to find the correct sequence of runes to slay the beast.',
  });

  const list = el('ul');
  list.append(
    el('li', {
      text: '🐂 Bull: The digit is correct and stands in its rightful place (a critical hit).',
    }),
    el('li', {
      text: '🐄 Cow: The digit is correct but stands in the wrong place (a glancing blow).',
    }),
  );

  const outroText = el('p', {
    text: 'Enter your guesses and use the clues to deduce the exact sequence. The fewer attempts you need, the higher your place in the Leaderboard.',
  });

  rulesText.append(introText, list, outroText);
  modal.append(closeBtn, title, rulesText);
  overlay.append(modal);
  document.body.append(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
};
