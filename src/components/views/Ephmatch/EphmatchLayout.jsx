// React imports
import React from "react";
import PropTypes from "prop-types";

// Additional imports
import { Link } from "react-router5";

const EphmatchLayout = ({ children, ephmatchReleaseDate, matches }) => {
  return (
    <>
      <header>
        <div className="page-head">
          <h1>
            <Link routeName="ephmatch">Ephmatch</Link>
          </h1>
          <ul>
            <li>
              <Link routeName="ephmatch">Home</Link>
            </li>
            {new Date() > ephmatchReleaseDate && (
              <li>
                <Link routeName="ephmatch.matches">Matches</Link>
                <span className="ephcatch-badge" title="Matches!">
                  {matches.length}
                </span>
              </li>
            )}
            <li>
              <Link routeName="ephmatch.profile">Profile</Link>
            </li>
            <li>
              <Link routeName="ephmatch.optOut">Opt Out</Link>
            </li>
          </ul>
        </div>
      </header>
      {children}
    </>
  );
};

EphmatchLayout.propTypes = {
  children: PropTypes.object,
  ephmatchReleaseDate: PropTypes.object.isRequired,
  matches: PropTypes.arrayOf(PropTypes.object),
};

EphmatchLayout.defaultProps = { children: null, matches: [] };

export default EphmatchLayout;
