// React import
import React from "react";
import PropTypes from "prop-types";
import Redirect from "../Redirect";

const ErrorRedirect = ({ error }) => {
  if (!error) return null;

  switch (error.errorCode) {
    case 403:
      return <Redirect to="403" />;
    case 404:
      return <Redirect to="404" />;
    case 500:
      return <Redirect to="500" />;
    default:
      return <Redirect to="500" />;
  }
};

ErrorRedirect.propTypes = {
  error: PropTypes.object,
};

ErrorRedirect.defaultProps = {
  error: null,
};

export default ErrorRedirect;
