import React from "react";
import NowPlaying from "./NowPlaying";
import { useWCFM } from "./WCFMProvider";
import "./WCFM.css";

const WCFMMini = () => {
  const { status, sceneOpen, toggle, openScene } = useWCFM();
  const playing = status === "playing" || status === "loading";

  return (
    <div className="wcfm-dock" hidden={sceneOpen}>
      {playing && <NowPlaying className="wcfm-mini-card" />}
      <div className="wcfm-mini">
        <button
          type="button"
          className="wcfm-mini-open"
          onClick={openScene}
          aria-label="Open the WCFM player"
        >
          <span className="wcfm-mini-title">WCFM 91.9</span>
          <i className="material-icons" aria-hidden>
            open_in_full
          </i>
        </button>
        <button
          type="button"
          className="wcfm-mini-play"
          onClick={toggle}
          aria-label={playing ? "Stop WCFM" : "Play WCFM"}
        >
          <i className="material-icons" aria-hidden>
            {status === "loading"
              ? "more_horiz"
              : playing
                ? "stop"
                : "play_arrow"}
          </i>
        </button>
      </div>
    </div>
  );
};

export default WCFMMini;
