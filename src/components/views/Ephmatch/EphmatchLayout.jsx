// React imports
import React from "react";
import PropTypes from "prop-types";

// Additional imports
import { Link } from "react-router5";
import { format } from "timeago.js";

const EphmatchLayout = ({ children, ephmatchEndDate, matches }) => {
  const isOpen = new Date() < ephmatchEndDate;
  return (
    <>
      <header>
        {isOpen && (
          <section className="notice">
            Ephmatch closes {format(ephmatchEndDate)}
          </section>
        )}

        <div className="page-head">
          <h1>
            <Link routeName="ephmatch">Ephmatch</Link>
          </h1>
          <ul>
            <li>
              <Link routeName="ephmatch">Home</Link>
            </li>
            {isOpen && (
              <>
                <li>
                  <Link routeName="ephmatch.matches">Matches</Link>
                  <span className="ephmatch-badge" title="Matches!">
                    {matches.length}
                  </span>
                </li>
                <li>
                  <Link routeName="ephmatch.profile">Profile</Link>
                </li>
                <li>
                  <Link routeName="ephmatch.optOut">Opt Out</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </header>
      {children}
    </>
  );
};

EphmatchLayout.propTypes = {
  children: PropTypes.object,
  ephmatchEndDate: PropTypes.object.isRequired,
  matches: PropTypes.arrayOf(PropTypes.object),
};

EphmatchLayout.defaultProps = { children: null, matches: [] };

export default EphmatchLayout;
