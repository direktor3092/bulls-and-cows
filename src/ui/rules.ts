import { el } from './dom';

export const showRulesModal = (): void => {
  // Затемнение фона
  const overlay = el('div', { class: 'modal-overlay' });

  // Само окно
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
    <p>The Dark Lord has hidden a secret sequence of unique runes (digits). Your task is to guess it.</p>
    <ul>
      <li>🐂 <strong>Bull:</strong> The digit is correct and stands in its rightful place.</li>
      <li>🐄 <strong>Cow:</strong> The digit is correct but stands in the wrong place.</li>
    </ul>
    <p>Enter your guess and use the clues to deduce the exact sequence before the time runs out. The fewer attempts you need, the higher your place in the Leaderboard.</p>
  `;

  modal.append(closeBtn, title, rulesText);
  overlay.append(modal);
  document.body.append(overlay);

  // Закрытие по клику вне окна
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
};
