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
  rulesText.innerHTML = `
    <p>A demonic beast has locked itself in the dungeon. Its weak points are marked with unique runes (digits). Your task is to find the correct sequence of runes to slay the beast.</p>
    <ul>
      <li>🐂 <strong>Bull:</strong> The rune is correct and in its rightful place (a critical hit).</li>
      <li>🐄 <strong>Cow:</strong> The rune is correct but in the wrong place (a glancing blow).</li>
    </ul>
    <p>Enter your guesses and use the clues to deduce the exact sequence. The fewer attempts you need, the higher your place in the Leaderboard.</p>
  `;

  modal.append(closeBtn, title, rulesText);
  overlay.append(modal);
  document.body.append(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
};
