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
  height: "",
  center: false,
  className: "",
};

const SkeletonLine = ({ width, height, center, className }) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ height, width, margin: center ? "auto" : "" }}
    />
  );
};

SkeletonLine.propTypes = commonPropTypes;
SkeletonLine.defaultProps = commonDefaultProps;

const randPercentBetween = (min, max) => {
  const randomPercent = min + Math.random() * (max - min);
  return `${randomPercent}%`;
};

const SkeletonList = React.memo(
  ({ width, height, center, className, numRows }) => {
    return (
      <div className="skeleton-container">
        {[...Array(numRows)].map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i}>
            <SkeletonLine
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

SkeletonList.propTypes = { ...commonPropTypes, numRows: PropTypes.number };
SkeletonList.defaultProps = { ...commonDefaultProps, numRows: 5 };

export { SkeletonLine, SkeletonList };
