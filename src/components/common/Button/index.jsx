// React imports
import React from "react";
import PropTypes from "prop-types";

const Button = (props) => {
  const { children, ...other } = props;
  return (
    <button type="button" {...other}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

Button.defaultProps = {
  children: null,
};

export default Button;
