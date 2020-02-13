// React imports
import React from "react";
import PropTypes from "prop-types";
import "./stylesheets/Skeleton.css";

const commonPropTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  center: PropTypes.bool,
  className: PropTypes.string,
};

const commonDefaultProps = {
  width: "",
  height: "0.8em",
  center: false,
  className: "",
};

const Line = ({ width, height, center, className }) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ height, width, margin: center ? "auto" : "" }}
    />
  );
};

Line.propTypes = commonPropTypes;
Line.defaultProps = commonDefaultProps;

const randPercentBetween = (min, max) => {
  const randomPercent = min + Math.random() * (max - min);
  return `${randomPercent}%`;
};

const List = React.memo(({ width, height, center, className, numRows }) => {
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
});

List.propTypes = { ...commonPropTypes, numRows: PropTypes.number };
List.defaultProps = { ...commonDefaultProps, numRows: 5 };

const Paragraph = ({ center, className, numRows }) => {
  return (
    <div className="skeleton-container">
      {[...Array(numRows)].map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i}>
          <Line
            width="100%"
            height="0.8em"
            center={center}
            className={className}
          />
        </div>
      ))}

      <Line width="15%" height="0.8em" center={center} className={className} />
    </div>
  );
};

Paragraph.propTypes = {
  center: PropTypes.bool,
  className: PropTypes.string,
  numRows: PropTypes.number,
};
Paragraph.defaultProps = { center: false, className: "", numRows: 5 };

export { Line, List, Paragraph };
