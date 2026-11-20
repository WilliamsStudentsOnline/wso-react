import { useEffect, useRef } from "react";

export const useAnimationFrame = (
  callback: (elapsed: number, time: number) => void,
  active = true
) => {
  const cb = useRef(callback);
  cb.current = callback;

  useEffect(() => {
    if (!active) return undefined;
    let handle = 0;
    let last = performance.now();
    const frame = (time: number) => {
      cb.current((time - last) / 1000, time / 1000);
      last = time;
      handle = requestAnimationFrame(frame);
    };
    handle = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(handle);
  }, [active]);
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
