import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatCompactHours, normalizeClockTime } from "../lib/timeFormat";
import { parseAndAdjustTime } from "./views/Dining/diningShared";
import "./stylesheets/Dining.css";

type LibraryService = {
  name: string;
  hours: {
    open: string[] | null;
    close: string[] | null;
  };
};

const useOpenProgress = (open: string | null, close: string | null) => {
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    if (!open || !close) {
      setProgress(null);
      return undefined;
    }

    const tick = () => {
      const now = new Date();
      const openNorm = normalizeClockTime(open);
      const closeNorm = normalizeClockTime(close);
      const openDateTime = parseAndAdjustTime(openNorm, now, false);
      const closeDateTime = parseAndAdjustTime(closeNorm, now, true, openNorm);
      if (now >= openDateTime && now < closeDateTime) {
        const totalMs = closeDateTime.getTime() - openDateTime.getTime();
        const elapsedMs = now.getTime() - openDateTime.getTime();
        setProgress(
          totalMs > 0 ? Math.min(1, Math.max(0, elapsedMs / totalMs)) : 0
        );
      } else {
        setProgress(null);
      }
    };

    tick();
    const timer = window.setInterval(tick, 60 * 1000);
    return () => window.clearInterval(timer);
  }, [open, close]);

  return progress;
};

const LibraryHoursInterval = ({
  open,
  close,
}: {
  open: string;
  close: string;
}) => {
  const progress = useOpenProgress(open, close);
  const openProgressStyle =
    progress === null
      ? undefined
      : ({
          ["--open-progress" as string]: `${Math.round(progress * 100)}%`,
        } as React.CSSProperties);

  return (
    <td
      className={[
        "library-hours-cell",
        progress !== null ? "dining-meal-has-progress" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={openProgressStyle}
    >
      {progress !== null ? (
        <div className="dining-meal-progress-fill" aria-hidden />
      ) : null}
      <span className="library-hours-cell-label">
        {formatCompactHours(open, close)}
      </span>
    </td>
  );
};

const LibraryHoursTable = () => {
  const [services, setServices] = useState<LibraryService[] | null>(null);
  const [error, setError] = useState(false);

  const loadLibraryHours = (retry = false) => {
    const axiosHeaders = {
      "X-Requested-With": "XMLHttpRequest",
    };

    axios({
      url: "/library.json",
      headers: axiosHeaders,
    })
      .then((response) => {
        if (response.status !== 200) {
          if (!retry) loadLibraryHours(true);
          else setError(true);
        } else {
          setServices(
            Object.values(response.data.libraryservices) as LibraryService[]
          );
        }
      })
      .catch(() => {
        if (!retry) loadLibraryHours(true);
        else setError(true);
      });
  };

  useEffect(() => {
    loadLibraryHours();
  }, []);

  if (error) return <p>Unable to load hours.</p>;
  if (!services) return <p>Loading…</p>;

  return (
    <div className="library-hours dining">
      <h3>Library Hours</h3>
      <table className="library-hours-table">
        <thead>
          <tr>
            <th>Library</th>
            <th>Hours</th>
          </tr>
        </thead>
        <tbody>
          {services.map((svc) => {
            const openTimes = svc.hours.open;
            if (openTimes === null) {
              return (
                <tr key={`${svc.name}-no-hours`}>
                  <td>
                    <b>{svc.name}</b>
                  </td>
                  <td className="library-hours-empty">(no hours)</td>
                </tr>
              );
            }
            return openTimes.map((open, i) => (
              <tr key={`${svc.name}-${i}`}>
                {i === 0 && (
                  <td rowSpan={openTimes.length}>
                    <b>{svc.name}</b>
                  </td>
                )}
                <LibraryHoursInterval
                  open={open}
                  close={svc.hours.close?.[i] || ""}
                />
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LibraryHoursTable;
