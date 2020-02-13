// React imports
import React from "react";
import PropTypes from "prop-types";
import "./stylesheets/Skeleton.css";

const SkeletonLine = ({ width, height, center, className }) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ height, width, margin: center ? "auto" : "" }}
    />
  );
};

SkeletonLine.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  center: PropTypes.bool,
  className: PropTypes.string,
};

SkeletonLine.defaultProps = {
  width: "",
  height: "",
  center: false,
  className: "",
};

export default SkeletonLine;
