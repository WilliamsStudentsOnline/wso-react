// React imports
import React from "react";

export interface error404Props {
  message?: string;
}

const Error404 = ({ message }: error404Props): React.JSX.Element => {
  return (
    <header>
      <h1>Whoops! Page not found!</h1>
      <p>404. Run. Hide. Cease and Desist.</p>
      {message && <p>{message}</p>}
    </header>
  );
};

export default Error404;
