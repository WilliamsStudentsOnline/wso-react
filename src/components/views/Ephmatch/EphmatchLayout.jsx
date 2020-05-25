// React imports
import React from "react";
import PropTypes from "prop-types";

// Additional imports
import { Link } from "react-router5";

import { format } from "timeago.js";
import { containsScopes, scopes } from "../../../lib/general";

const EphmatchLayout = ({ children, token, availability, matches }) => {
  return (
    <>
      <header>
        {availability && availability.available && availability.closingTime && (
          <section className="notice">
            Ephmatch closes {format(availability.closingTime)}
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
            {containsScopes(token, [
              scopes.ScopeEphmatchMatches,
              scopes.ScopeEphmatchProfiles,
            ]) && (
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
  token: PropTypes.string.isRequired,
  children: PropTypes.object,
  availability: PropTypes.object,
  matches: PropTypes.arrayOf(PropTypes.object),
};

EphmatchLayout.defaultProps = {
  children: null,
  matches: [],
  availability: null,
};

export default EphmatchLayout;
