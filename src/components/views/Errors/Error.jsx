// React imports
import React from "react";
import PropTypes from "prop-types";

const Error = ({ error }) => {
  return (
    <header>
      <h1>Whoops! Something Bad Happened!</h1>
      Error Code {error?.errorCode || "500"}.
      <br />
      {error?.message}
      <br />
      Try waiting for a few minutes and trying what you did again to see if your
      issue is resolved! Otherwise, contact us at{" "}
      <a href="mailto:wso-dev@williams.edu">wso-dev@williams.edu</a>
    </header>
  );
};

Error.propTypes = {
  error: PropTypes.object,
};

Error.defaultProps = {
  error: null,
};

export default Error;
