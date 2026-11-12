export const initFireEffect = (): void => {
  const canvas = document.createElement('canvas');
  canvas.id = 'fire-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = window.innerWidth;
  let height = window.innerHeight;

  const resize = (): void => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  };
  window.addEventListener('resize', resize);
  resize();

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    life: number;
    maxLife: number;
    color: string;
  }

  const particles: Particle[] = [];
  const colors = ['#ff4500', '#ff8c00', '#ffd700', '#ff0000'];

  const createParticle = (): Particle => {
    return {
      x: Math.random() * width,
      y: height + Math.random() * 20,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -(Math.random() * 2 + 1),
      size: Math.random() * 3 + 1,
      life: 0,
      maxLife: Math.random() * 100 + 50,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  };

  const animate = (): void => {
    ctx.clearRect(0, 0, width, height);

    if (particles.length < 150) {
      particles.push(createParticle());
      if (Math.random() > 0.5) particles.push(createParticle());
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      const opacity = 1 - p.life / p.maxLife;

      if (p.life >= p.maxLife || p.y < -10) {
        particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, opacity);

      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;

      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(animate);
  };

  animate();
};
