/**
 * High-performance, canvas-based multi-stage confetti & particle celebration engine.
 * Simulates 3D tumbling paper flakes, golden stars, streamers, and physics-based cannon bursts.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  opacity: number;
  gravity: number;
  drag: number;
  shape: 'rect' | 'star' | 'circle' | 'streamer';
  wobble?: number;
  wobbleSpeed?: number;
}

const CELEBRATION_COLORS = [
  '#EF4444', // Crimson Red
  '#F59E0B', // Amber Gold
  '#10B981', // Emerald Green
  '#3B82F6', // Royal Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F97316', // Orange
  '#FFD700', // Metallic Gold
  '#06B6D4', // Cyan
];

export class ConfettiCelebration {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animId: number | null = null;
  private isRunning: boolean = false;
  private resizeHandler: (() => void) | null = null;
  private stopTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.initCanvasSize();
  }

  private initCanvasSize() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.ctx = this.canvas.getContext('2d');
    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }
  }

  /**
   * Launch a directional cannon burst from (x, y)
   */
  public addBurst(
    originX: number,
    originY: number,
    count: number = 80,
    options: {
      spreadAngle?: number; // In radians
      baseAngle?: number; // In radians (e.g. -Math.PI / 2 is straight UP)
      minSpeed?: number;
      maxSpeed?: number;
      colors?: string[];
      shapes?: Array<'rect' | 'star' | 'circle' | 'streamer'>;
    } = {}
  ) {
    const {
      spreadAngle = Math.PI / 2.5,
      baseAngle = -Math.PI / 2,
      minSpeed = 6,
      maxSpeed = 16,
      colors = CELEBRATION_COLORS,
      shapes = ['rect', 'rect', 'star', 'circle', 'streamer'],
    } = options;

    for (let i = 0; i < count; i++) {
      const angle = baseAngle + (Math.random() - 0.5) * spreadAngle;
      const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = shape === 'streamer' ? 14 + Math.random() * 12 : 7 + Math.random() * 9;

      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        width: size,
        height: shape === 'streamer' ? 4 : size * (0.6 + Math.random() * 0.4),
        color,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        flip: Math.random() * Math.PI,
        flipSpeed: 0.08 + Math.random() * 0.12,
        opacity: 1,
        gravity: shape === 'streamer' ? 0.18 : 0.28,
        drag: 0.982,
        shape,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.05 + Math.random() * 0.08,
      });
    }

    if (!this.isRunning) {
      this.startLoop();
    }
  }

  /**
   * Triggers the full victory grand finale:
   * Multi-stage sequence over 4.5 seconds
   */
  public launchVictorySequence(square100ScreenPos?: { x: number; y: number }) {
    this.initCanvasSize();
    this.particles = [];

    const w = window.innerWidth;
    const h = window.innerHeight;

    // Stage 1: Immediate burst from Square 100 (or top left)
    const sX = square100ScreenPos?.x ?? w * 0.28;
    const sY = square100ScreenPos?.y ?? h * 0.24;
    this.addBurst(sX, sY, 90, {
      baseAngle: -Math.PI / 4,
      spreadAngle: Math.PI / 1.5,
      minSpeed: 7,
      maxSpeed: 17,
    });

    // Stage 2: Left bottom cannon (+200ms)
    setTimeout(() => {
      this.addBurst(w * 0.08, h * 0.95, 80, {
        baseAngle: -Math.PI / 3, // Up and towards center
        spreadAngle: Math.PI / 3,
        minSpeed: 11,
        maxSpeed: 21,
      });
    }, 200);

    // Stage 3: Right bottom cannon (+400ms)
    setTimeout(() => {
      this.addBurst(w * 0.92, h * 0.95, 80, {
        baseAngle: (-2 * Math.PI) / 3, // Up and towards center
        spreadAngle: Math.PI / 3,
        minSpeed: 11,
        maxSpeed: 21,
      });
    }, 400);

    // Stage 4: Center golden shower (+850ms)
    setTimeout(() => {
      this.addBurst(w * 0.5, h * 0.15, 110, {
        baseAngle: Math.PI / 2, // Downwards spray
        spreadAngle: Math.PI * 0.9,
        minSpeed: 4,
        maxSpeed: 14,
        colors: ['#FFD700', '#F59E0B', '#FBBF24', '#FEF08A', '#EF4444', '#10B981'],
      });
    }, 850);

    // Stage 5: Final dual blast (+1400ms)
    setTimeout(() => {
      this.addBurst(w * 0.2, h * 0.85, 60, {
        baseAngle: -Math.PI / 2.6,
        spreadAngle: Math.PI / 2.5,
        minSpeed: 10,
        maxSpeed: 18,
      });
      this.addBurst(w * 0.8, h * 0.85, 60, {
        baseAngle: -Math.PI / 1.6,
        spreadAngle: Math.PI / 2.5,
        minSpeed: 10,
        maxSpeed: 18,
      });
    }, 1400);
  }

  private startLoop() {
    this.isRunning = true;

    const render = () => {
      if (!this.ctx || !this.canvas) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      this.ctx.clearRect(0, 0, w, h);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];

        // Physics update
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;

        if (p.wobble !== undefined && p.wobbleSpeed !== undefined) {
          p.wobble += p.wobbleSpeed;
          p.x += p.vx + Math.sin(p.wobble) * 1.4;
        } else {
          p.x += p.vx;
        }

        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;

        // Fade out as it nears bottom or after slowing down
        if (p.y > h * 0.85) {
          p.opacity -= 0.022;
        }

        if (p.opacity <= 0.01 || p.y > h + 50) {
          this.particles.splice(i, 1);
          continue;
        }

        // Draw particle
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.scale(1, Math.cos(p.flip)); // 3D flip effect
        this.ctx.globalAlpha = Math.max(0, p.opacity);
        this.ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.width / 2, 0, Math.PI * 2);
          this.ctx.fill();
        } else if (p.shape === 'star') {
          this.drawStar(this.ctx, 0, 0, 5, p.width * 0.65, p.width * 0.32);
        } else {
          // 'rect' and 'streamer'
          this.ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        }

        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(render);
      } else {
        this.isRunning = false;
        this.ctx.clearRect(0, 0, w, h);
      }
    };

    this.animId = requestAnimationFrame(render);
  }

  private drawStar(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number
  ) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  public clear() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    this.particles = [];
    this.isRunning = false;
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  public destroy() {
    this.clear();
    if (this.stopTimeout) clearTimeout(this.stopTimeout);
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }
}
