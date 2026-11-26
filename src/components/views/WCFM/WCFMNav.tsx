import React, { useEffect, useRef, useState } from "react";
import WCFMPlayer from "./WCFMPlayer";

const WCFMNav = () => {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span className="wcfm-nav" ref={root}>
      <button
        type="button"
        className={`nav-icon-button wcfm-nav-button${open ? " open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="WCFM radio"
        aria-expanded={open}
      >
        <i className="material-icons" aria-hidden="true">
          cell_tower
        </i>
        <span className="wcfm-nav-arrow" aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <div className="wcfm-nav-panel">
          <WCFMPlayer />
        </div>
      )}
    </span>
  );
};

export default WCFMNav;
