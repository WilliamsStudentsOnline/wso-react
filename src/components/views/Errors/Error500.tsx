// React imports
import React from "react";

export interface Error500Props {
  error?: { message?: string } | null;
}

const Error500 = ({ error = null }: Error500Props) => {
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

export default Error500;
