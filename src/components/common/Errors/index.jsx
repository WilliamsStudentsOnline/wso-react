// React imports
import React from "react";
import PropTypes from "prop-types";

const Errors = ({ errors }) => {
  return (
    <div id="errors">
      {errors.length > 0 &&
        errors.map((msg) => {
          return <p key={msg}>{`* ${msg}`}</p>;
        })}
    </div>
  );
};

Errors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string),
};
Errors.defaultProps = {
  errors: [],
};

export default Errors;
