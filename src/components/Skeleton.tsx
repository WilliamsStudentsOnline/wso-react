// React imports
import React, { ReactElement } from "react";
import { CommonPropTypes } from "../lib/types";
import "./stylesheets/Skeleton.css";

const Line = ({
  width = "",
  height = "0.8em",
  center = false,
  className = "",
}: CommonPropTypes) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ height, width, margin: center ? "auto" : "" }}
    />
  );
};

const Photo = ({
  height = "250px",
  width = "250px",
}: {
  height?: string;
  width?: string;
}) => {
  return <div className="skeleton-photo" style={{ height, width }} />;
};

const randPercentBetween = (min: number, max: number) => {
  const randomPercent = min + Math.random() * (max - min);
  return `${randomPercent}%`;
};

// eslint-disable-next-line react/display-name
const List = React.memo(
  ({
    width = "",
    height = "0.8em",
    center = false,
    className = "",
    numRows = 5,
  }: CommonPropTypes & {
    numRows?: number;
  }) => {
    return (
      <div className="skeleton-container">
        {[...Array(numRows)].map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i}>
            <Line
              width={width || randPercentBetween(30, 90)}
              height={height}
              center={center}
              className={className}
            />
          </div>
        ))}
      </div>
    );
  }
);
const Paragraph = ({
  center = false,
  className = "",
  numRows = 5,
}: {
  center?: boolean;
  className?: string;
  numRows?: number;
}) => {
  return (
    <div className="skeleton-container">
      {[...Array(numRows)].map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i}>
          <Line width="100%" center={center} className={className} />
        </div>
      ))}

      <Line width="15%" height="0.8em" center={center} className={className} />
    </div>
  );
};

const Circle = ({
  diameter,
  className = "",
  children = null,
}: {
  diameter: string;
  className?: string;
  children?: ReactElement | null;
}) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ height: diameter, width: diameter, borderRadius: "100%" }}
    >
      {children}
    </div>
  );
};

const CircularLoader = ({
  diameter,
  className = "",
}: {
  diameter: string;
  className?: string;
}) => {
  return (
    <div
      className={`spinner ${className}`}
      style={{ width: diameter, height: diameter }}
    />
  );
};

export { Line, List, Paragraph, Photo, Circle, CircularLoader };
