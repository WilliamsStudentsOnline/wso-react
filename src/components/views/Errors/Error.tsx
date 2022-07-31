// React imports
import React from "react";
import { useLocation } from "react-router-dom";

export interface errorState {
  error?: {
    errorCode?: string;
    message?: string;
  };
} /* use `interface` if exporting so that consumers can extend */

const Error = (): React.ReactElement => {
  const location = useLocation();
  const state = location.state as errorState;
  const error = state?.error;

  return (
    <header>
      <h1>Whoops! Something Bad Happened!</h1>
      <p>
        Error Code <code>{error?.errorCode || "Unknown"}</code>
      </p>
      Error Message:
      <pre>
        <code>{error?.message || "No message"}</code>
      </pre>
      <br />
      <p>
        Try waiting for a few minutes and trying what you did again to see if
        your issue is resolved! Otherwise, contact us at{" "}
        <a href="mailto:wso-dev@williams.edu">wso-dev@williams.edu</a>
      </p>
    </header>
  );
};

export default Error;
