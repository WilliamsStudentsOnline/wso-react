// placeholder art

export const PALETTE = {
  sky: [
    [27, 21, 48],
    [35, 27, 62],
    [45, 34, 77],
    [58, 42, 92],
  ],
  ridgeFar: [52, 39, 84],
  ridgeNear: [38, 29, 62],
  hill: [30, 44, 46],
  hillLow: [24, 35, 40],
  hillRim: [44, 62, 58],
  blade: [36, 54, 52],
  star: [236, 230, 255],
  log: [110, 70, 50],
  logDark: [66, 41, 34],
  stone: [86, 80, 104],
  glow: [255, 154, 60],
  cowWhite: [222, 216, 230],
  cowBlack: [36, 30, 44],
  cowPink: [214, 150, 160],
} as const;

type RGB = readonly number[];

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

const rgb = (c: RGB, a = 1) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;

// stable across resizes
export const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};

export interface SceneLayout {
  width: number;
  height: number;
  horizon: number;
  crestX: number;
  crestY: number;
}

export const layoutScene = (width: number, height: number): SceneLayout => ({
  width,
  height,
  horizon: Math.round(height * 0.58),
  crestX: Math.round(width / 2),
  crestY: Math.round(height * 0.62),
});

export const hillY = (l: SceneLayout, x: number) => {
  const d = (x - l.crestX) / (Math.max(l.width, l.height * 0.8) * 0.55);
  return l.crestY + d * d * l.height * 0.32;
};

const ditherBands = (
  d: Uint8ClampedArray,
  width: number,
  x: number,
  y: number,
  colors: readonly RGB[],
  pos: number
) => {
  const steps = colors.length - 1;
  const band = Math.min(Math.floor(pos * steps), steps - 1);
  const frac = Math.min(Math.max((pos * steps - band - 0.6) / 0.4, 0), 1);
  const threshold = BAYER[(y % 4) * 4 + (x % 4)] / 16;
  const c = colors[frac > threshold ? band + 1 : band];
  const p = 4 * (y * width + x);
  d[p] = c[0];
  d[p + 1] = c[1];
  d[p + 2] = c[2];
  d[p + 3] = 255;
};

export const paintBackdrop = (
  ctx: CanvasRenderingContext2D,
  l: SceneLayout
) => {
  const { width, height, horizon } = l;
  const img = ctx.createImageData(width, height);
  for (let y = 0; y < height; y++) {
    const pos = Math.min(y / horizon, 1) ** 1.6;
    for (let x = 0; x < width; x++) {
      ditherBands(img.data, width, x, y, PALETTE.sky, pos);
    }
  }
  ctx.putImageData(img, 0, 0);

  const ridge = (
    color: RGB,
    base: number,
    amp: number,
    f1: number,
    f2: number,
    phase: number
  ) => {
    ctx.fillStyle = rgb(color);
    for (let x = 0; x < width; x++) {
      const y = Math.round(
        base -
          amp *
            (0.6 * Math.sin(x * f1 + phase) +
              0.4 * Math.sin(x * f2 + phase * 2))
      );
      ctx.fillRect(x, y, 1, height - y);
    }
  };
  ridge(
    PALETTE.ridgeFar,
    horizon - height * 0.04,
    height * 0.07,
    0.021,
    0.057,
    1.3
  );
  ridge(
    PALETTE.ridgeNear,
    horizon + height * 0.02,
    height * 0.05,
    0.034,
    0.083,
    4.1
  );

  const hill = ctx.getImageData(0, 0, width, height);
  for (let x = 0; x < width; x++) {
    const top = Math.round(hillY(l, x));
    for (let y = Math.max(top, 0); y < height; y++) {
      const pos = Math.min((y - top) / (height * 0.4), 1);
      ditherBands(hill.data, width, x, y, [PALETTE.hill, PALETTE.hillLow], pos);
    }
  }
  ctx.putImageData(hill, 0, 0);

  const rand = seeded(7);
  for (let x = 0; x < width; x++) {
    const top = Math.round(hillY(l, x));
    ctx.fillStyle = rgb(PALETTE.hillRim);
    ctx.fillRect(x, top, 1, 1);
    if (rand() < 0.35) {
      const tall = rand() < 0.3 ? 2 : 1;
      ctx.fillStyle = rgb(PALETTE.blade);
      ctx.fillRect(x, top - tall, 1, tall);
    }
  }
};

export interface Star {
  x: number;
  y: number;
  alpha: number;
}

export const makeStars = (l: SceneLayout): Star[] => {
  const rand = seeded(42);
  const count = Math.round((l.width * l.horizon) / 140);
  return Array.from({ length: count }, () => ({
    x: Math.floor(rand() * l.width),
    y: Math.floor(rand() * l.horizon * 0.85),
    alpha: 0.35 + rand() * 0.65,
  }));
};

export const paintStars = (ctx: CanvasRenderingContext2D, stars: Star[]) => {
  for (const s of stars) {
    ctx.fillStyle = rgb(PALETTE.star, s.alpha);
    ctx.fillRect(s.x, s.y, 1, 1);
  }
};

const SPARKLE_SECONDS = 1.1;

// skewed long
const sparkleGap = () => 1 + 99 * Math.sqrt(Math.random());

export class Sparkles {
  private next = sparkleGap();
  private active: { star: Star; start: number } | null = null;

  update(ctx: CanvasRenderingContext2D, stars: Star[], time: number) {
    if (!this.active && time >= this.next && stars.length) {
      const bright = stars.filter((s) => s.alpha > 0.7);
      const pool = bright.length ? bright : stars;
      this.active = {
        star: pool[Math.floor(Math.random() * pool.length)],
        start: time,
      };
    }
    if (!this.active) return;

    const t = (time - this.active.start) / SPARKLE_SECONDS;
    if (t >= 1) {
      this.active = null;
      this.next = time + sparkleGap();
      return;
    }
    const { x, y } = this.active.star;
    const peak = Math.sin(t * Math.PI);
    const arm = peak > 0.75 ? 2 : peak > 0.3 ? 1 : 0;
    ctx.fillStyle = rgb(PALETTE.star, Math.min(1, 0.6 + peak));
    ctx.fillRect(x, y, 1, 1);
    for (let r = 1; r <= arm; r++) {
      ctx.fillStyle = rgb(PALETTE.star, peak * (r === 1 ? 0.8 : 0.4));
      ctx.fillRect(x - r, y, 1, 1);
      ctx.fillRect(x + r, y, 1, 1);
      ctx.fillRect(x, y - r, 1, 1);
      ctx.fillRect(x, y + r, 1, 1);
    }
  }
}

export const paintMoon = (ctx: CanvasRenderingContext2D, l: SceneLayout) => {
  const r = Math.max(4, Math.round(l.height * 0.045));
  const cx = Math.round(l.width * 0.78);
  const cy = Math.round(l.height * 0.16);
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      const inMoon = x * x + y * y <= r * r;
      const bite = (x + r * 0.55) ** 2 + (y - r * 0.2) ** 2 <= r * r * 0.8;
      if (inMoon && !bite) {
        ctx.fillStyle = rgb(PALETTE.star, 0.95);
        ctx.fillRect(cx + x, cy + y, 1, 1);
      }
    }
  }
};

export const paintGlow = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  strength: number
) => {
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
  g.addColorStop(0, rgb(PALETTE.glow, 0.32 * strength));
  g.addColorStop(0.5, rgb(PALETTE.glow, 0.1 * strength));
  g.addColorStop(1, rgb(PALETTE.glow, 0));
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = g;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  ctx.restore();
};

export const paintLogs = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  width: number
) => {
  const half = Math.round(width / 2);
  const rise = Math.max(2, Math.round(width / 6));
  for (let i = -half; i < half; i++) {
    const y = baseY - Math.round(((i + half) / width) * rise);
    ctx.fillStyle = rgb(PALETTE.log);
    ctx.fillRect(cx + i, y - 1, 1, 1);
    ctx.fillRect(cx - i - 1, y - 1, 1, 1);
    ctx.fillStyle = rgb(PALETTE.logDark);
    ctx.fillRect(cx + i, y, 1, 1);
    ctx.fillRect(cx - i - 1, y, 1, 1);
  }
  ctx.fillStyle = rgb(PALETTE.stone);
  for (let i = -half - 2; i <= half + 1; i += 3) {
    ctx.fillRect(cx + i, baseY + 1, 2, 1);
  }
};

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
}

export class Sparks {
  private list: Spark[] = [];

  emit(x: number, y: number, spread: number, count: number, speed = 1) {
    for (let n = 0; n < count; n++) {
      this.list.push({
        x: x + (Math.random() * 2 - 1) * spread,
        y,
        vx: (Math.random() * 2 - 1) * 4,
        vy: -(14 + Math.random() * 22) * speed,
        age: 0,
        life: 1 + Math.random() * 1.8,
      });
    }
  }

  update(ctx: CanvasRenderingContext2D, dt: number, time: number) {
    this.list = this.list.filter((s) => s.age < s.life);
    for (const s of this.list) {
      s.age += dt;
      s.vy *= 1 - 0.6 * dt;
      s.x += (s.vx + Math.sin(time * 3 + s.life * 10) * 3) * dt;
      s.y += s.vy * dt;
      const fade = 1 - s.age / s.life;
      ctx.fillStyle =
        fade > 0.5
          ? `rgba(255, ${Math.round(150 + 80 * fade)}, 80, ${fade})`
          : `rgba(220, 80, 50, ${fade * 1.6})`;
      ctx.fillRect(Math.round(s.x), Math.round(s.y), 1, 1);
    }
  }
}

// k black, w white, p pink
const COW_STAND = [
  ".........w.w",
  ".........kkk",
  ".kkwwkkwwkwk",
  "kwwwkkwwwkkk",
  ".wkkwwwwkwpp",
  ".wwwwwwwww..",
  ".k.k...k.k..",
  ".k.k...k.k..",
];
const HEAD_COLS = 9;

const COW_GRAZE = COW_STAND.map((_, r) => {
  const body = COW_STAND[r].slice(0, HEAD_COLS);
  const src = r - 2;
  const head = src >= 0 && src < 6 ? COW_STAND[src].slice(HEAD_COLS) : "...";
  return body + head;
});

const COW_STEP = [...COW_STAND.slice(0, 6), "..k...k...k.", "..k...k...k."];

const COW_COLORS: Record<string, RGB> = {
  k: PALETTE.cowBlack,
  w: PALETTE.cowWhite,
  p: PALETTE.cowPink,
};

type CowMode = "graze" | "stand" | "walk";

interface Cow {
  x: number;
  y: number;
  dir: number;
  mode: CowMode;
  until: number;
}

const drawSprite = (
  ctx: CanvasRenderingContext2D,
  sprite: string[],
  x: number,
  y: number,
  dir: number
) => {
  const w = sprite[0].length;
  for (let r = 0; r < sprite.length; r++) {
    for (let c = 0; c < w; c++) {
      const color = COW_COLORS[sprite[r][c]];
      if (!color) continue;
      ctx.fillStyle = rgb(color);
      ctx.fillRect(x + (dir === 1 ? c : w - 1 - c), y + r, 1, 1);
    }
  }
};

export const MAX_COWS = 20;
const FIRE_CLEARANCE = 18;
const COW_DEPTH = 3;

// phones hide the side text
const pasture = (l: SceneLayout) =>
  l.width < 200 ? [4, l.width - 13] : [l.width * 0.3, l.width * 0.7 - 12];

export class Herd {
  private cows: Cow[];
  private layout: SceneLayout;

  constructor(layout: SceneLayout) {
    this.layout = layout;
    const rand = seeded(91);
    this.cows = [];
    Array.from({ length: MAX_COWS }, () => {
      const cow: Cow = {
        x: 0,
        y: 0,
        dir: rand() < 0.5 ? -1 : 1,
        mode: "graze",
        until: rand() * 6,
      };
      this.place(cow, rand);
      this.cows.push(cow);
      return cow;
    });
  }

  private place(cow: Cow, rand: () => number) {
    const l = this.layout;
    const [lo, hi] = pasture(l);
    let best = { x: l.crestX + FIRE_CLEARANCE + 4, y: 0, gap: -1 };
    for (let tries = 0; tries < 40; tries++) {
      const x = lo + rand() * (hi - lo);
      if (Math.abs(x - l.crestX) < FIRE_CLEARANCE) continue;
      const y = hillY(l, x) + COW_DEPTH + rand() * l.height * 0.05;
      const gap = Math.min(
        Infinity,
        ...this.cows.map((c) =>
          Math.max(Math.abs(c.x - x) / 12, Math.abs(c.y - y) / 8)
        )
      );
      if (gap > best.gap) best = { x, y, gap };
      if (gap >= 1) break;
    }
    cow.x = best.x;
    cow.y = best.y || hillY(l, best.x) + COW_DEPTH;
  }

  update(
    ctx: CanvasRenderingContext2D,
    count: number,
    dt: number,
    time: number,
    animate: boolean
  ) {
    const l = this.layout;
    const shown = this.cows
      .slice(0, Math.min(count, MAX_COWS))
      .sort((a, b) => a.y - b.y);
    for (const cow of shown) {
      if (animate && time > cow.until) {
        const r = Math.random();
        cow.mode = r < 0.55 ? "graze" : r < 0.8 ? "stand" : "walk";
        if (cow.mode === "walk" && Math.random() < 0.4) cow.dir *= -1;
        cow.until = time + 2 + Math.random() * 6;
      }
      if (animate && cow.mode === "walk") {
        const nx = cow.x + cow.dir * 2.5 * dt;
        const blocked =
          Math.abs(nx - l.crestX) < FIRE_CLEARANCE ||
          nx < pasture(l)[0] ||
          nx > pasture(l)[1] ||
          cow.y < hillY(l, nx) + COW_DEPTH;
        if (blocked) {
          cow.dir *= -1;
          cow.mode = "stand";
        } else cow.x = nx;
      }
      const sprite =
        cow.mode === "graze"
          ? COW_GRAZE
          : cow.mode === "walk" && Math.floor(time * 4) % 2
            ? COW_STEP
            : COW_STAND;
      drawSprite(
        ctx,
        sprite,
        Math.round(cow.x),
        Math.round(cow.y) - sprite.length,
        cow.dir
      );
    }
  }
}
