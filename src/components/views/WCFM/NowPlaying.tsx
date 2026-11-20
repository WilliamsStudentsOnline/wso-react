import React from "react";
import { useWCFM } from "./WCFMProvider";

const WCFM_SITE = "https://wcfm.nekoweb.org/";

export const formatTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

const NowPlaying = ({ className }: { className: string }) => {
  const { now, status, toggle } = useWCFM();
  const playing = status === "playing" || status === "loading";
  const track = now?.track;
  const onAir = now?.onAir;
  const next = now?.next;

  return (
    <div className={className}>
      {!onAir && next && (
        <p className="wcfm-scene-show">
          Auto-DJ
          <span className="wcfm-scene-until">
            {" "}
            until {formatTime(next.start)}
          </span>
        </p>
      )}
      {onAir && (
        <p className="wcfm-scene-show">
          {onAir.title}
          {onAir.djs &&
            onAir.djs.length > 0 &&
            ` with ${onAir.djs.join(" & ")}`}
          <span className="wcfm-scene-until">
            {" "}
            until {formatTime(onAir.end)}
          </span>
        </p>
      )}
      <h2 className="wcfm-scene-song">{track?.song || "WCFM 91.9"}</h2>
      <p className="wcfm-scene-artist">
        {track
          ? [track.artist, track.album, track.year].filter(Boolean).join(", ")
          : "Williams College radio"}
      </p>
      <button type="button" className="wcfm-scene-play" onClick={toggle}>
        <i className="material-icons" aria-hidden>
          {playing ? "stop" : "play_arrow"}
        </i>
        {status === "loading" ? (
          <>
            Tuning in
            <span className="wcfm-dots" aria-hidden>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </>
        ) : playing ? (
          "Stop"
        ) : (
          "Listen live"
        )}
      </button>
      <a
        className="wcfm-scene-play wcfm-scene-site-link"
        href={WCFM_SITE}
        target="_blank"
        rel="noreferrer"
      >
        <i className="material-icons" aria-hidden>
          open_in_new
        </i>
        WCFM
      </a>
      {status === "error" && (
        <p className="wcfm-scene-error">
          The WCFM stream isn&apos;t responding. Try again in a minute.
        </p>
      )}
    </div>
  );
};

export default NowPlaying;
