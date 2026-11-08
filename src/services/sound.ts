const bgMusic = new Audio();
bgMusic.loop = true;
bgMusic.volume = 0.3;

let currentTrack = '';

export const playBackgroundMusic = (track: 'tristram' | 'game-music'): void => {
  if (currentTrack === track && !bgMusic.paused) return;

  const base = import.meta.env.BASE_URL;
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
  const base = import.meta.env.BASE_URL;
  const sfx = new Audio(`${base}sounds/${sound}.mp3`);

  if (sound === 'win') sfx.volume = 0.8;
  else sfx.volume = 0.5;

  sfx.play().catch(() => {});
};
