import './style.css';
import { renderSettings } from './ui/settings';

const root = document.createElement('div');
root.id = 'root';
document.body.append(root);

const showSettings = (): void => {
  root.replaceChildren(
    renderSettings({ length: 4, base: 10 }, (settings) => {
      console.log('Start with:', settings);
    }),
  );
};

showSettings();
