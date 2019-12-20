// React imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import "./stylesheets/Select.css";

const Select = ({ onChange, options, value, valueList }) => {
  return (
    <select
      className="select"
      onChange={onChange}
      value={value}
      style={{ display: "inline", padding: "3px 10px" }}
    >
      {options.map((option, index) => {
        if (option)
          return (
            <option
              value={valueList[index] ? valueList[index] : null}
              key={option}
            >
              {option}
            </option>
          );
        return null;
      })}
    </select>
  );
};

Select.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  valueList: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
};

Select.defaultProps = {
  valueList: [],
};

export default Select;
