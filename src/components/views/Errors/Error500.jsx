// React imports
import React from "react";
import PropTypes from "prop-types";

const Error500 = ({ error }) => {
  return (
    <header>
      <h1>Whoops! Something Bad Happened!</h1>
      Error Code #500.
      <br />
      {error?.message}
      <br />
      Try waiting for a few minutes and trying what you did again to see if your
      issue is resolved! Otherwise, contact us at{" "}
      <a href="mailto:wso-dev@wso.williams.edu">wso-dev@wso.williams.edu</a>
    </header>
  );
};

Error500.propTypes = {
  error: PropTypes.object,
};

Error500.defaultProps = {
  error: null,
};

export default Error500;
