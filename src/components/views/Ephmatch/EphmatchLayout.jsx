// React imports
import React from "react";
import PropTypes from "prop-types";

// Additional imports
import { Link } from "react-router5";
import { format } from "timeago.js";
import { containsOneOfScopes, scopes } from "../../../lib/general";

const EphmatchLayout = ({
  available,
  children,
  closingTime,
  matchesTotalCount,
  token,
}) => {
  return (
    <>
      <header>
        {available && closingTime && (
          <section className="notice">
            Ephmatch closes {format(closingTime)}
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
            {containsOneOfScopes(token, [
              scopes.ScopeEphmatchMatches,
              scopes.ScopeEphmatchProfiles,
            ]) && (
              <>
                <li>
                  <Link routeName="ephmatch.matches">Matches</Link>
                  <span className="ephmatch-badge" title="Matches!">
                    {matchesTotalCount}
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

          <br />
          <div>Ephmatch strongly discourages meeting in person.</div>
        </div>
      </header>
      {children}
    </>
  );
};

EphmatchLayout.propTypes = {
  available: PropTypes.bool,
  children: PropTypes.object,
  closingTime: PropTypes.object,
  matchesTotalCount: PropTypes.number,
  token: PropTypes.string.isRequired,
};

EphmatchLayout.defaultProps = {
  available: false,
  children: null,
  closingTime: null,
  matchesTotalCount: 0,
};

export default EphmatchLayout;
