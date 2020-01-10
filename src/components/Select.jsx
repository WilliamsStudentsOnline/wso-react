// React imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import "./stylesheets/Select.css";

const Select = ({
  onChange,
  options,
  value,
  valueList,
  fillerOption,
  fillerValue,
  style,
}) => {
  return (
    <select className="select" style={style} onChange={onChange} value={value}>
      {fillerOption ? (
        <option value={fillerValue}>{fillerOption}</option>
      ) : null}

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
    PropTypes.oneOfType([PropTypes.number, PropTypes.bool, PropTypes.string])
  ).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  valueList: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.bool, PropTypes.string])
  ),
  fillerOption: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
  fillerValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object,
  ]),
  style: PropTypes.object,
};

Select.defaultProps = {
  valueList: [],
  fillerValue: null,
  fillerOption: "",
  style: {},
};

export default Select;
