import React from "react";
import { useWCFM } from "./WCFMProvider";
import "./WCFMPlayer.css";

const WCFM_SITE = "https://wcfm.nekoweb.org/";

const WCFMPlayer = () => {
  const { now, status, toggle } = useWCFM();
  const playing = status === "playing" || status === "loading";
  const track = now?.track;

  let detail: React.ReactNode = now?.onAir ? now.onAir.title : "Auto-DJ";
  if (playing && track) {
    detail = track.artist ? `${track.song} by ${track.artist}` : track.song;
  }
  if (status === "loading") {
    detail = (
      <>
        Tuning in
        <span className="wcfm-player-dots" aria-hidden>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </>
    );
  }
  if (status === "error") detail = "Stream isn't responding";

  return (
    <div className="wcfm-player">
      <button
        type="button"
        className="wcfm-player-toggle"
        onClick={toggle}
        aria-label={playing ? "Pause WCFM" : "Play WCFM"}
      >
        <i className="material-icons" aria-hidden>
          {playing ? "pause" : "play_arrow"}
        </i>
      </button>
      <div className="wcfm-player-text" aria-live="polite">
        <span className="wcfm-player-title">
          WCFM 91.9
          <a
            className="wcfm-player-site"
            href={WCFM_SITE}
            target="_blank"
            rel="noreferrer"
            aria-label="WCFM's website (opens in a new tab)"
          >
            <i className="material-icons" aria-hidden>
              open_in_new
            </i>
          </a>
        </span>
        <span className="wcfm-player-detail">{detail}</span>
      </div>
    </div>
  );
};

export default WCFMPlayer;
