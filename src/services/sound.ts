const base = import.meta.env.BASE_URL;

const sfxMap: Record<string, HTMLAudioElement> = {};
const sfxNames = ['start', 'click', 'error', 'win'];

export const preloadSounds = (): void => {
  sfxNames.forEach((name) => {
    const audio = new Audio(`${base}sounds/${name}.mp3`);
    audio.preload = 'auto';
    sfxMap[name] = audio;
  });

  bgMusic.src = `${base}sounds/tristram.mp3`;
  bgMusic.preload = 'auto';
  bgMusic.load();
};

const bgMusic = new Audio();
bgMusic.loop = true;
bgMusic.volume = 0.3;
let currentTrack = '';

export const playBackgroundMusic = (track: 'tristram' | 'game-music'): void => {
  if (currentTrack === track && !bgMusic.paused) return;

  bgMusic.src = `${base}sounds/${track}.mp3`;
  bgMusic.play().catch((e) => {
    console.warn('Autoplay prevented by browser', e);
  });
  currentTrack = track;
};

export const pauseBackgroundMusic = (): void => {
  bgMusic.pause();
};

export const resumeBackgroundMusic = (): void => {
  if (currentTrack) {
    bgMusic.play().catch(() => {});
  }
};

export const playSFX = (sound: 'start' | 'click' | 'error' | 'win'): void => {
  const original = sfxMap[sound];
  if (!original) return;

  const sfx = original.cloneNode() as HTMLAudioElement;

  if (sound === 'win') sfx.volume = 0.8;
  else sfx.volume = 0.5;

  sfx.play().catch(() => {});
};
