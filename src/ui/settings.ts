import { countPossibleSecrets } from '../core/countPossibleSecrets';
import { el } from './dom';

export interface GameSettings {
  length: number;
  base: number;
}

const LENGTHS = [2, 3, 4, 5, 6];
const BASES: { value: number; label: string }[] = [
  { value: 2, label: 'bin (2)' },
  { value: 8, label: 'oct (8)' },
  { value: 10, label: 'dec (10)' },
  { value: 16, label: 'hex (16)' },
];

export const renderSettings = (
  initial: GameSettings,
  onStart: (settings: GameSettings) => void,
): HTMLElement => {
  let selectedLength = initial.length;
  let selectedBase = initial.base;

  const container = el('section', { class: 'settings-screen' });
  container.append(el('h1', { text: 'Bulls and Cows' }));

  const lengthSection = el('div', { class: 'settings-section' });
  lengthSection.append(el('h3', { text: 'Secret number length' }));
  const lengthRow = el('div', { class: 'button-row' });
  const lengthButtons: HTMLButtonElement[] = [];

  for (const len of LENGTHS) {
    const btn = el('button', {
      class: 'option-btn',
      type: 'button',
      text: String(len),
      onclick: () => {
        if (btn.disabled) return;
        selectedLength = len;
        updateUI();
      },
    });
    lengthButtons.push(btn);
    lengthRow.append(btn);
  }
  lengthSection.append(lengthRow);

  const baseSection = el('div', { class: 'settings-section' });
  baseSection.append(el('h3', { text: 'Number base' }));
  const baseRow = el('div', { class: 'button-row' });
  const baseButtons: HTMLButtonElement[] = [];

  for (const base of BASES) {
    const btn = el('button', {
      class: 'option-btn',
      type: 'button',
      text: base.label,
      onclick: () => {
        selectedBase = base.value;
        if (selectedLength > selectedBase) selectedLength = selectedBase;
        updateUI();
      },
    });
    baseButtons.push(btn);
    baseRow.append(btn);
  }
  baseSection.append(baseRow);

  const info = el('p', { class: 'settings-info' });

  const startBtn = el('button', {
    class: 'start-btn',
    type: 'button',
    text: 'Start game',
    onclick: () => onStart({ length: selectedLength, base: selectedBase }),
  });

  const updateUI = (): void => {
    lengthButtons.forEach((btn, i) => {
      const len = LENGTHS[i];
      btn.classList.toggle('selected', len === selectedLength);
      btn.disabled = len > selectedBase;
    });
    baseButtons.forEach((btn, i) => {
      btn.classList.toggle('selected', BASES[i].value === selectedBase);
    });
    const possible = countPossibleSecrets(selectedLength, selectedBase);
    info.textContent = `Possible secrets for these settings: ${possible}`;
  };

  updateUI();
  container.append(lengthSection, baseSection, info, startBtn);
  return container;
};
