// from https://charliemax.dev/projects/fire/

export interface FireParams {
  heat: number;
  sourceWidth: number;
  timeScale: number;
  lift: number;
  liftAccel: number;
  fireCoolRate: number;
  smokeCoolRate: number;
  swirlProbability: number;
  swirlRadius: number;
  swirlAngularVel: number;
  swirlMaxAge: number;
  gsIterations: number;
}

export const DEFAULT_FIRE: FireParams = {
  heat: 1,
  sourceWidth: 0.25,
  timeScale: 0.4,
  lift: 2.1,
  liftAccel: 10,
  fireCoolRate: 2.3,
  smokeCoolRate: 1.9,
  swirlProbability: 0.2,
  swirlRadius: 3,
  swirlAngularVel: 40,
  swirlMaxAge: 70,
  gsIterations: 19,
};

const STEP = 1 / 60;
const MAX_STEPS_PER_FRAME = 3;
const OVERRELAX = 1.9;
const SOURCE_DEPTH = 3;
const AIR_DRAG = 1.5;

interface Swirl {
  x: number;
  y: number;
  omega: number;
  age: number;
}

export class FireSim {
  readonly cols: number;
  readonly rows: number;
  params: FireParams;

  private h: number;
  private u: Float32Array;
  private v: Float32Array;
  private t: Float32Array;
  private s: Float32Array;
  private nu: Float32Array;
  private nv: Float32Array;
  private nt: Float32Array;
  private swirls: Swirl[] = [];
  private acc = 0;

  constructor(cols: number, rows: number, params: Partial<FireParams> = {}) {
    this.cols = cols;
    this.rows = rows;
    this.params = { ...DEFAULT_FIRE, ...params };
    this.h = 1 / rows;
    const n = cols * rows;
    this.u = new Float32Array(n);
    this.v = new Float32Array(n);
    this.t = new Float32Array(n);
    this.s = new Float32Array(n).fill(1);
    this.nu = new Float32Array(n);
    this.nv = new Float32Array(n);
    this.nt = new Float32Array(n);
    for (let i = 0; i < cols; i++) this.s[i * rows] = 0;
  }

  // same speed at any refresh rate
  advance(elapsed: number) {
    this.acc += Math.min(elapsed, 0.1) * this.params.timeScale;
    let steps = 0;
    while (this.acc >= STEP && steps < MAX_STEPS_PER_FRAME) {
      this.step();
      this.acc -= STEP;
      steps++;
    }
    if (steps === MAX_STEPS_PER_FRAME) this.acc = 0;
  }

  private idx(i: number, j: number) {
    return i * this.rows + j;
  }

  private sample(px: number, py: number, field: Float32Array) {
    const { h, cols, rows } = this;
    let dx = 0;
    let dy = 0;
    if (field === this.u) dy = h / 2;
    else if (field === this.v) dx = h / 2;
    else {
      dx = h / 2;
      dy = h / 2;
    }
    px = Math.min(Math.max(px, h), cols * h);
    py = Math.min(Math.max(py, h), rows * h);

    const x0 = Math.min(Math.floor((px - dx) / h), cols - 1);
    const x1 = Math.min(x0 + 1, cols - 1);
    const y0 = Math.min(Math.floor((py - dy) / h), rows - 1);
    const y1 = Math.min(y0 + 1, rows - 1);
    const tx = (px - dx - x0 * h) / h;
    const ty = (py - dy - y0 * h) / h;
    const sx = 1 - tx;
    const sy = 1 - ty;

    return (
      sx * sy * field[x0 * rows + y0] +
      tx * sy * field[x1 * rows + y0] +
      tx * ty * field[x1 * rows + y1] +
      sx * ty * field[x0 * rows + y1]
    );
  }

  private step() {
    const { cols, rows, h, u, v, t, s, params: p } = this;
    const dt = STEP;

    const half = Math.round((cols * p.sourceWidth) / 2);
    const mid = Math.floor(cols / 2);
    for (let i = mid - half; i < mid + half; i++) {
      if (i < 1 || i >= cols - 1) continue;
      const edge = 1 - Math.abs(i - mid + 0.5) / (half + 1);
      const flicker = 0.8 + 0.2 * Math.random();
      const heat = p.heat * flicker * (0.55 + 0.45 * edge);
      // floor row dilutes a 1-row source
      for (let j = 1; j <= SOURCE_DEPTH; j++) {
        const k = this.idx(i, j);
        t[k] = Math.max(t[k], heat);
      }

      const r = Math.random();
      if (r < p.swirlProbability * p.heat) {
        const sign = r < (p.swirlProbability * p.heat) / 2 ? -1 : 1;
        this.swirls.push({
          x: i,
          y: 1,
          omega: sign * p.swirlAngularVel,
          age: 0,
        });
      }
    }

    // damp sideways drift
    const drag = 1 - AIR_DRAG * dt;
    for (let k = 0; k < u.length; k++) u[k] *= drag;

    for (let k = 0; k < t.length; k++) {
      const t0 = t[k];
      if (t0 === 0) continue;
      const rate = t0 < 0.5 ? p.smokeCoolRate : p.fireCoolRate;
      t[k] = Math.max(t0 - rate * dt, 0);
    }

    for (let i = 1; i < cols; i++) {
      for (let j = 1; j < rows; j++) {
        const k = this.idx(i, j);
        if (s[k] !== 0 && s[k - 1] !== 0) {
          // ambient gravity pins the heat down
          v[k] += p.liftAccel * (p.lift * t[k] - v[k]) * dt;
        }
      }
    }

    this.swirls = this.swirls.filter(
      (w) =>
        w.age < p.swirlMaxAge && w.x > 0 && w.x < cols && w.y > 0 && w.y < rows
    );
    const r = p.swirlRadius;
    for (const w of this.swirls) {
      const cx = w.x * h;
      const cy = w.y * h;
      const su = this.sample(cx, cy, u);
      const sv = this.sample(cx, cy, v);
      const ci = Math.round(w.x);
      const cj = Math.round(w.y);
      for (let a = Math.max(ci - r, 0); a < Math.min(ci + r, cols); a++) {
        for (let b = Math.max(cj - r, 0); b < Math.min(cj + r, rows); b++) {
          const dx = w.x - a;
          const dy = w.y - b;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d >= r) continue;
          const dn = d / r;
          const kern = dn < 0.8 ? 1 : (1 - dn) * 5;
          const k = this.idx(a, b);
          // cells to domain units
          u[k] += (su - u[k] - dy * h * w.omega) * kern * dt;
          v[k] += (sv - v[k] + dx * h * w.omega) * kern * dt;
        }
      }
      w.x += (su * dt) / h;
      w.y += (sv * dt) / h;
      w.age++;
    }

    for (let n = 0; n < p.gsIterations; n++) {
      for (let i = 1; i < cols - 1; i++) {
        for (let j = 1; j < rows - 1; j++) {
          const k = this.idx(i, j);
          if (s[k] === 0) continue;
          const sx0 = s[k + rows];
          const sx1 = s[k - rows];
          const sy0 = s[k + 1];
          const sy1 = s[k - 1];
          const b = sx0 + sx1 + sy0 + sy1;
          if (b === 0) continue;
          const div = u[k + rows] - u[k] + v[k + 1] - v[k];
          const pr = (-OVERRELAX * div) / b;
          u[k + rows] += pr * sx0;
          u[k] -= pr * sx1;
          v[k + 1] += pr * sy0;
          v[k] -= pr * sy1;
        }
      }
    }

    for (let i = 0; i < cols; i++) {
      u[this.idx(i, 0)] = u[this.idx(i, 1)];
      u[this.idx(i, rows - 1)] = u[this.idx(i, rows - 2)];
    }
    for (let j = 0; j < rows; j++) {
      v[this.idx(0, j)] = v[this.idx(1, j)];
      v[this.idx(cols - 1, j)] = v[this.idx(cols - 2, j)];
    }

    const { nu, nv, nt } = this;
    nu.set(u);
    nv.set(v);
    for (let i = 1; i < cols; i++) {
      for (let j = 1; j < rows; j++) {
        const k = this.idx(i, j);
        if (s[k] === 0) continue;
        if (s[k - rows] !== 0 && j < rows - 1) {
          const avgV = (v[k - rows] + v[k] + v[k - rows + 1] + v[k + 1]) / 4;
          const px = i * h - u[k] * dt;
          const py = j * h + h / 2 - avgV * dt;
          nu[k] = this.sample(px, py, u);
        }
        if (s[k - 1] !== 0 && i < cols - 1) {
          const avgU = (u[k - 1] + u[k] + u[k + rows - 1] + u[k + rows]) / 4;
          const px = i * h + h / 2 - avgU * dt;
          const py = j * h - v[k] * dt;
          nv[k] = this.sample(px, py, v);
        }
      }
    }
    u.set(nu);
    v.set(nv);

    nt.set(t);
    for (let i = 1; i < cols - 1; i++) {
      for (let j = 1; j < rows - 1; j++) {
        const k = this.idx(i, j);
        if (s[k] === 0) continue;
        const cu = (u[k] + u[k + rows]) / 2;
        const cv = (v[k] + v[k + 1]) / 2;
        nt[k] = this.sample(
          i * h + h / 2 - cu * dt,
          j * h + h / 2 - cv * dt,
          t
        );
      }
    }
    t.set(nt);
  }

  // cells and domain units/s
  stir(i: number, j: number, du: number, dv: number, radius: number) {
    const { cols, rows, u, v } = this;
    const a0 = Math.max(1, Math.floor(i - radius));
    const a1 = Math.min(cols - 1, Math.ceil(i + radius));
    const b0 = Math.max(1, Math.floor(j - radius));
    const b1 = Math.min(rows - 1, Math.ceil(j + radius));
    for (let a = a0; a < a1; a++) {
      for (let b = b0; b < b1; b++) {
        const falloff = 1 - Math.hypot(a - i, b - j) / radius;
        if (falloff <= 0) continue;
        u[a * rows + b] += du * falloff;
        v[a * rows + b] += dv * falloff;
      }
    }
  }

  kick(strength: number) {
    const { cols, rows, t } = this;
    const half = Math.round((cols * this.params.sourceWidth) / 2);
    const mid = Math.floor(cols / 2);
    const count = Math.round(2 + strength * 6);
    for (let n = 0; n < count; n++) {
      const sign = Math.random() < 0.5 ? -1 : 1;
      this.swirls.push({
        x: mid + (Math.random() * 2 - 1) * half,
        y: 2 + Math.random() * 3,
        omega: sign * this.params.swirlAngularVel * (1 + strength),
        age: 0,
      });
    }
    for (let i = mid - half; i < mid + half; i++) {
      for (let j = 1; j <= SOURCE_DEPTH + 2; j++) {
        if (i > 0 && i < cols - 1) t[i * rows + j] = 1;
      }
    }
  }

  // 0 red to 1 golden-white
  render(img: ImageData, tint = 0.5) {
    const { cols, rows, t } = this;
    const d = img.data;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const p = 4 * ((rows - 1 - j) * cols + i);
        const [r, g, b, a] = heatColor(t[i * rows + j], tint);
        d[p] = r;
        d[p + 1] = g;
        d[p + 2] = b;
        d[p + 3] = a;
      }
    }
  }

  intensity() {
    const { t, cols, rows } = this;
    let sum = 0;
    for (let i = 0; i < cols; i++) {
      for (let j = 1; j < Math.min(rows, 8); j++) sum += t[i * rows + j];
    }
    return Math.min(sum / (cols * 7 * 0.35), 1);
  }
}

const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

export function heatColor(
  val: number,
  tint = 0.5
): [number, number, number, number] {
  const t = Math.min(Math.max(val, 0), 1);
  if (t < 0.04) return [0, 0, 0, 0];
  if (t < 0.3) {
    const n = (t - 0.04) / 0.26;
    return [92, 78, 120, Math.round(lerp(0, 90, n))];
  }
  if (t < 0.5) {
    const n = (t - 0.3) / 0.2;
    return [
      Math.round(lerp(150, 238, n)),
      Math.round(lerp(30, lerp(60, 110, tint), n)),
      Math.round(lerp(40, 28, n)),
      Math.round(lerp(150, 255, n)),
    ];
  }
  const n = (t - 0.5) / 0.5;
  return [
    255,
    Math.round(lerp(lerp(100, 150, tint), lerp(200, 250, tint), n)),
    Math.round(lerp(lerp(25, 50, tint), lerp(90, 215, tint), n)),
    255,
  ];
}
