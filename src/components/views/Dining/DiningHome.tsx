// React imports
import React from "react";

// Additional imports
import { Link } from "react-router-dom";
import { StylizedLink } from "../../StylizedLink";

const DiningHome = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="facebook">
      <header>
        <div className="page-head">
          <h1>
            <Link to="/dining">Dining</Link>
          </h1>
          <ul>
            <li>
              <StylizedLink to="/dining/whitmans">Whitmans</StylizedLink>
            </li>
            <li>
              <StylizedLink to="/dining/driscoll">Driscoll</StylizedLink>
            </li>
            <li>
              <StylizedLink to="/dining/mission">Mission</StylizedLink>
            </li>
          </ul>
        </div>
      </header>
      {children}
    </div>
  );
};

export default DiningHome;
