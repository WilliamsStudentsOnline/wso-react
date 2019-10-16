// React imports
import React from "react";
import PropTypes from "prop-types";

const FiveOhOh = ({ error }) => {
  return (
    <header>
      <h1>Whoops! Page not found!</h1>
      Error Code #500.
      {error.message}
    </header>
  );
};

FiveOhOh.propTypes = {
  error: PropTypes.object.isRequired,
};

export default FiveOhOh;
