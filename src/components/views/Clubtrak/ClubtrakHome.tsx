// React imports
import React from "react";

// Additional imports
import { Link } from "react-router-dom";
import { StylizedLink } from "../../StylizedLink";

const ClubtrakHome = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="facebook">
      <header>
        <div className="page-head">
          <h1>
            <Link to="/clubtrak">Clubtrak</Link>
          </h1>
          <ul>
            <li>
              <StylizedLink to="/clubtrak/calendar">Calendar</StylizedLink>
            </li>
          </ul>
        </div>
      </header>
      {children}
    </div>
  );
};

export default ClubtrakHome;
