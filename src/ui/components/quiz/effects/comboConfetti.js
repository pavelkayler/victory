const colors = ["#22c55e", "#a3e635", "#fde047", "#fb923c", "#38bdf8"];

const launchComboConfetti = ({
  particleCount = 60,
  spread = 60,
  startVelocity = 18,
  origin = { x: 0.5, y: 0.5 },
} = {}) => {
  if (typeof document === "undefined") {
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  canvas.style.transition = "opacity 160ms ease-out";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const angleBase = -Math.PI / 2;
  const startX = origin.x * canvas.width;
  const startY = origin.y * canvas.height;
  const spreadRad = (spread * Math.PI) / 180;
  const gravity = 0.4;
  const duration = 520;

  const particles = Array.from({ length: particleCount }, () => {
    const angle = angleBase + (Math.random() - 0.5) * spreadRad;
    const velocity = startVelocity * (0.65 + Math.random() * 0.45);

    return {
      x: startX,
      y: startY,
      angle,
      velocity,
      size: 5 + Math.random() * 3.5,
      spin: (Math.random() * 2 - 1) * Math.PI,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: duration * (0.7 + Math.random() * 0.3),
    };
  });

  const startTime = performance.now();

  const frame = (now) => {
    const elapsed = now - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let hasAlive = false;

    particles.forEach((particle) => {
      if (elapsed <= particle.life) {
        hasAlive = true;
        const progress = elapsed / particle.life;
        const fall = gravity * elapsed * 0.035;

        particle.x += Math.cos(particle.angle) * particle.velocity * 0.75;
        particle.y += Math.sin(particle.angle) * particle.velocity * 0.75 + fall;

        ctx.save();
        ctx.globalAlpha = 1 - progress;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.spin * progress);
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.8);
        ctx.restore();
      }
    });

    if (hasAlive) {
      requestAnimationFrame(frame);
      return;
    }

    canvas.style.opacity = "0";
    setTimeout(() => canvas.remove(), 160);
  };

  requestAnimationFrame(frame);
};

export { launchComboConfetti };
