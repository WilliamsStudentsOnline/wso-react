// React imports
import React from 'react';
import PropTypes from 'prop-types';

// Component imports
import './stylesheets/Select.css';

const Select = ({onChange, options, value, valueList}) => {
  return (
    <select className="select" onChange={onChange} value={value}>
      <option value="">Pick a Time</option>
      {options.map((option, index) => {
        if (option)
          return (
            <option value={valueList[index] ? valueList[index] : null} key={option}>
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
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  valueList: PropTypes.arrayOf(PropTypes.string)
};

Select.defaultProps = {
  valueList: []
};

export default Select;
