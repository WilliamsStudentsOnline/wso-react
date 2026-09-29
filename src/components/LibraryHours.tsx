import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { formatCompactHours, normalizeClockTime } from "../lib/timeFormat";
import {
  getDiningStatusPill,
  parseAndAdjustTime,
} from "./views/Dining/diningShared";
import "./stylesheets/Dining.css";

type LibraryService = {
  name: string;
  hours: {
    open: string[] | null;
    close: string[] | null;
  };
};

type Interval = { open: string; close: string };

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

const useLibraryStatus = (intervals: Interval[]) => {
  const [status, setStatus] = useState({
    style: "Closed",
    message: "Closed",
  });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      let nextOpenTime: Date | null = null;
      let nextOpenLabel = "";
      let nextOpenMessage = "";

      for (const { open, close } of intervals) {
        if (!open || !close) continue;
        const openNorm = normalizeClockTime(open);
        const closeNorm = normalizeClockTime(close);
        const openDateTime = parseAndAdjustTime(openNorm, now, false);
        const closeDateTime = parseAndAdjustTime(
          closeNorm,
          now,
          true,
          openNorm
        );

        if (now >= openDateTime && now < closeDateTime) {
          const diffMinutes =
            (closeDateTime.getTime() - now.getTime()) / 1000 / 60;
          setStatus({
            style: diffMinutes < 60 ? "Closing" : "Open",
            message:
              diffMinutes < 60
                ? `Closes in ${Math.round(diffMinutes)} min`
                : `Open until ${
                    formatCompactHours(open, close).split("–")[1] || close
                  }`,
          });
          return;
        }

        if (now < openDateTime) {
          if (!nextOpenTime || openDateTime < nextOpenTime) {
            nextOpenTime = openDateTime;
            nextOpenLabel = open;
            const diffMinutes =
              (openDateTime.getTime() - now.getTime()) / 1000 / 60;
            nextOpenMessage =
              diffMinutes < 60
                ? `Opens in ${Math.round(diffMinutes)} min`
                : `Opens at ${
                    formatCompactHours(open, close).split("–")[0] || open
                  }`;
          }
        }
      }

      if (nextOpenTime && nextOpenMessage.includes("Opens in")) {
        setStatus({ style: "Opening", message: nextOpenMessage });
      } else if (nextOpenTime) {
        setStatus({
          style: "Closed",
          message: nextOpenMessage || `Opens at ${nextOpenLabel}`,
        });
      } else {
        setStatus({ style: "Closed", message: "Closed for the day" });
      }
    };

    tick();
    const timer = window.setInterval(tick, 60 * 1000);
    return () => window.clearInterval(timer);
  }, [intervals]);

  return status;
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

const LibraryServiceRows = ({ service }: { service: LibraryService }) => {
  const openTimes = service.hours.open;
  const closeTimes = service.hours.close;
  const intervals: Interval[] = useMemo(
    () =>
      openTimes === null
        ? []
        : openTimes.map((open, i) => ({
            open,
            close: closeTimes?.[i] || "",
          })),
    [openTimes, closeTimes]
  );
  const { style, message } = useLibraryStatus(intervals);
  const pill = getDiningStatusPill(style);

  if (openTimes === null) {
    return (
      <tr key={`${service.name}-no-hours`}>
        <td>
          <span className="homepage-hours-name">
            <span
              className={`homepage-status-dot homepage-status-dot-closed`}
              aria-label="Closed: No hours"
            >
              <span className="homepage-status-tooltip" role="tooltip">
                No hours
              </span>
            </span>
            <b>{service.name}</b>
          </span>
        </td>
        <td className="library-hours-empty">(no hours)</td>
      </tr>
    );
  }

  return (
    <>
      {openTimes.map((open, i) => (
        <tr key={`${service.name}-${i}`}>
          {i === 0 && (
            <td rowSpan={openTimes.length}>
              <span className="homepage-hours-name">
                <span
                  className={`homepage-status-dot homepage-status-dot-${pill.kind}`}
                  aria-label={`${pill.label}: ${message}`}
                >
                  <span className="homepage-status-tooltip" role="tooltip">
                    {message}
                  </span>
                </span>
                <b>{service.name}</b>
              </span>
            </td>
          )}
          <LibraryHoursInterval
            open={open}
            close={service.hours.close?.[i] || ""}
          />
        </tr>
      ))}
    </>
  );
};

const LibraryHoursSkeleton = () => (
  <div className="library-hours dining" aria-busy="true" aria-hidden="true">
    <h3>Library Hours</h3>
    <table className="library-hours-table">
      <thead>
        <tr>
          <th>Library</th>
          <th>Hours</th>
        </tr>
      </thead>
      <tbody>
        {[0, 1, 2, 3, 4].map((i) => (
          <tr key={i}>
            <td>
              <span className="homepage-hours-name">
                <span className="homepage-skeleton-dot" />
                <span
                  className="homepage-skeleton-line"
                  style={{ width: "70%" }}
                />
              </span>
            </td>
            <td>
              <span
                className="homepage-skeleton-line"
                style={{ width: "55%" }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

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
  if (!services) return <LibraryHoursSkeleton />;

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
          {services.map((svc) => (
            <LibraryServiceRows key={svc.name} service={svc} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LibraryHoursTable;
