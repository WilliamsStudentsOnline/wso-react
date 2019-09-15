// React imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import "../../stylesheets/Checkbox.css";

// Simple checkbox component.
const Checkbox = ({ onClick, checked }) => {
  return (
    <input type="checkbox" onChange={onClick} checked={checked !== false} />
  );
};

Checkbox.propTypes = {
  onClick: PropTypes.func,
  checked: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
};

Checkbox.defaultProps = {
  onClick: null,
};

export default Checkbox;
