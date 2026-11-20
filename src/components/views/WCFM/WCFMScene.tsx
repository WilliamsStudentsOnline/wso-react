import React, { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_FIRE, FireParams, FireSim } from "./fireSim";
import {
  Herd,
  layoutScene,
  makeStars,
  paintBackdrop,
  paintGlow,
  paintLogs,
  paintMoon,
  paintStars,
  SceneLayout,
  Sparkles,
  Sparks,
  Star,
} from "./scene";
import { prefersReducedMotion, useAnimationFrame } from "./useAnimationFrame";
import { useWCFM } from "./WCFMProvider";
import { fireHeat } from "./heat";
import NowPlaying, { formatTime } from "./NowPlaying";
import "./WCFM.css";

const SCENE_WIDTH = 260;
const SCENE_HEIGHT = 300;
const STIR_RADIUS = 5;
const STIR = 0.25;
const MAX_STIR = 0.6;
const SPARK_SPREAD = 5;
const FIRE_COLS = 44;
const FIRE_ROWS = 72;

const WCFMScene = () => {
  const { now, status, closeScene, features } = useWCFM();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduced = useMemo(prefersReducedMotion, []);
  const tuning = useMemo(
    () => new URLSearchParams(window.location.search).has("firetune"),
    []
  );

  const sim = useMemo(
    () =>
      new FireSim(FIRE_COLS, FIRE_ROWS, {
        timeScale: reduced ? 0.3 : DEFAULT_FIRE.timeScale,
      }),
    [reduced]
  );
  const [params, setParams] = useState<FireParams>(() => ({ ...sim.params }));

  const backdrop = useRef<HTMLCanvasElement | null>(null);
  const fireCanvas = useMemo(() => document.createElement("canvas"), []);
  const fireImage = useRef<ImageData | null>(null);
  const [layout, setLayout] = useState<SceneLayout | null>(null);
  const stars = useRef<Star[]>([]);
  const herd = useRef<Herd | null>(null);
  const scaleRef = useRef(1);
  const pointer = useRef<{ x: number; y: number; t: number } | null>(null);
  const sparkles = useMemo(() => new Sparkles(), []);
  const sparks = useMemo(() => new Sparks(), []);
  const sparkDebt = useRef(0);

  useEffect(() => {
    fireCanvas.width = FIRE_COLS;
    fireCanvas.height = FIRE_ROWS;
  }, [fireCanvas]);

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const scale = Math.max(
        2,
        Math.round(
          Math.max(
            window.innerWidth / SCENE_WIDTH,
            window.innerHeight / SCENE_HEIGHT
          )
        )
      );
      const width = Math.ceil(window.innerWidth / scale);
      const height = Math.ceil(window.innerHeight / scale);
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width * scale}px`;
      canvas.style.height = `${height * scale}px`;
      scaleRef.current = scale;
      const l = layoutScene(width, height);
      const bg = backdrop.current ?? document.createElement("canvas");
      bg.width = width;
      bg.height = height;
      const bctx = bg.getContext("2d");
      if (bctx) {
        paintBackdrop(bctx, l);
        paintMoon(bctx, l);
      }
      backdrop.current = bg;
      stars.current = makeStars(l);
      herd.current = new Herd(l);
      setLayout(l);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeScene();
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [closeScene]);

  const playing = status === "playing" || status === "loading";

  useAnimationFrame((elapsed, time) => {
    const ctx = canvasRef.current?.getContext("2d");
    const fctx = fireCanvas.getContext("2d");
    if (!ctx || !fctx || !layout || !backdrop.current) return;

    const { crestX, crestY, height } = layout;
    const music = features(time);
    // don't compound
    Object.assign(sim.params, params);
    sim.params.heat = tuning ? params.heat : fireHeat(playing, music.level);
    sim.params.lift = params.lift * (1 + 0.6 * music.mid);
    if (music.beat) {
      sim.kick(music.beatStrength);
      sparks.emit(
        crestX,
        crestY - 4,
        SPARK_SPREAD,
        3 + Math.round(8 * music.beatStrength),
        1 + music.beatStrength * 0.6
      );
    }
    sparkDebt.current += elapsed * (playing ? 2 + music.treble * 40 : 0.4);
    if (sparkDebt.current >= 1) {
      const n = Math.floor(sparkDebt.current);
      sparks.emit(crestX, crestY - 4, SPARK_SPREAD, n);
      sparkDebt.current -= n;
    }
    const tint = Math.min(Math.max((music.brightness - 0.2) / 0.45, 0), 1);

    sim.advance(elapsed);
    if (!fireImage.current)
      fireImage.current = fctx.createImageData(FIRE_COLS, FIRE_ROWS);
    sim.render(fireImage.current, tint);
    fctx.putImageData(fireImage.current, 0, 0);

    ctx.drawImage(backdrop.current, 0, 0);
    paintStars(ctx, stars.current);
    if (!reduced) sparkles.update(ctx, stars.current, time);
    herd.current?.update(
      ctx,
      now?.live ? Math.floor((now.listeners ?? 0) / 2) + 1 : 0,
      elapsed,
      time,
      !reduced
    );
    const glow = 0.4 + sim.intensity() * 0.9;
    paintGlow(ctx, crestX, crestY - 6, height * 0.42, glow);
    ctx.drawImage(
      fireCanvas,
      Math.round(crestX - FIRE_COLS / 2),
      crestY - FIRE_ROWS + 1
    );
    paintLogs(ctx, crestX, crestY + 1, 18);
    sparks.update(ctx, Math.min(elapsed, 0.1), time);
  });

  const setParam = (key: keyof FireParams, value: number) => {
    setParams((p) => ({ ...p, [key]: value }));
  };

  const next = now?.next;
  const recent = (now?.recent ?? []).slice(0, 4);

  // j counts up from the fire floor
  const toFire = (e: React.PointerEvent) => {
    if (!layout) return null;
    const x = e.clientX / scaleRef.current;
    const y = e.clientY / scaleRef.current;
    const i = x - Math.round(layout.crestX - FIRE_COLS / 2);
    const j = layout.crestY - y;
    return { x, y, i, j };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const at = toFire(e);
    if (!at) return;
    const t = e.timeStamp / 1000;
    const last = pointer.current;
    pointer.current = { x: at.x, y: at.y, t };
    const near =
      at.i > -STIR_RADIUS &&
      at.i < FIRE_COLS + STIR_RADIUS &&
      at.j > 0 &&
      at.j < FIRE_ROWS;
    if (!last || !near) return;
    const dt = Math.max(t - last.t, 1 / 240);
    const clamp = (n: number) => Math.max(-MAX_STIR, Math.min(MAX_STIR, n));
    sim.stir(
      at.i,
      at.j,
      clamp(((at.x - last.x) / dt / FIRE_ROWS) * STIR),
      clamp(((last.y - at.y) / dt / FIRE_ROWS) * STIR),
      STIR_RADIUS
    );
  };

  return (
    <div
      className="wcfm-scene"
      onPointerMove={onPointerMove}
      role="dialog"
      aria-modal="true"
      aria-label="WCFM 91.9"
    >
      <canvas ref={canvasRef} className="wcfm-scene-canvas" aria-hidden />

      <div className="wcfm-scene-top">
        <button
          ref={closeRef}
          type="button"
          className="wcfm-scene-close"
          onClick={closeScene}
        >
          <i className="material-icons" aria-hidden>
            arrow_back
          </i>
          Back to WSO
        </button>
        {now?.live && now.listeners != null && (
          <span className="wcfm-scene-listeners">
            {now.listeners === 1
              ? "1 person listening"
              : `${now.listeners} people listening`}
          </span>
        )}
      </div>

      <div className="wcfm-scene-ground">
        <NowPlaying className="wcfm-scene-now" />

        <div className="wcfm-scene-side">
          {recent.length > 0 && (
            <section>
              <h3>Played earlier</h3>
              <ol>
                {recent.map((t) => (
                  <li key={t.id}>
                    <span className="wcfm-scene-time">
                      {formatTime(t.start)}
                    </span>
                    {t.song}
                    {t.artist && (
                      <span className="wcfm-scene-by"> by {t.artist}</span>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}
          {next && (
            <section>
              <h3>Up next</h3>
              <p>
                <span className="wcfm-scene-time">
                  {formatTime(next.start)}
                </span>
                {next.title}
              </p>
            </section>
          )}
        </div>
      </div>

      {tuning && (
        <form className="wcfm-tune" onSubmit={(e) => e.preventDefault()}>
          {(
            [
              ["heat", 0, 1, 0.01],
              ["timeScale", 0.1, 1.5, 0.05],
              ["sourceWidth", 0.1, 0.9, 0.01],
              ["lift", 0, 4, 0.1],
              ["liftAccel", 0, 12, 0.5],
              ["fireCoolRate", 0.5, 10, 0.1],
              ["smokeCoolRate", 0.2, 6, 0.1],
              ["swirlProbability", 0, 0.2, 0.005],
              ["swirlAngularVel", 0, 40, 1],
              ["gsIterations", 4, 60, 1],
            ] as [keyof FireParams, number, number, number][]
          ).map(([key, min, max, step]) => (
            <label key={key}>
              <span>
                {key} {params[key]}
              </span>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={params[key]}
                onChange={(e) => setParam(key, Number(e.target.value))}
              />
            </label>
          ))}
        </form>
      )}
    </div>
  );
};

export default WCFMScene;
