// React imports
import React from "react";
import PropTypes from "prop-types";

// Additional imports
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { containsOneOfScopes, scopes } from "../../../lib/general";
import { StylizedLink } from "../../Components";

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
            <Link to="/ephmatch">Ephmatch</Link>
          </h1>
          <ul>
            <li>
              <StylizedLink to="/ephmatch" end>
                Home
              </StylizedLink>
            </li>
            {containsOneOfScopes(token, [
              scopes.ScopeEphmatchMatches,
              scopes.ScopeEphmatchProfiles,
            ]) && (
              <>
                <li>
                  <StylizedLink to="/ephmatch/matches">Matches</StylizedLink>
                  <span className="ephmatch-badge" title="Matches!">
                    {matchesTotalCount}
                  </span>
                </li>
                <li>
                  <StylizedLink to="/ephmatch/profile">Profile</StylizedLink>
                </li>
                <li>
                  <StylizedLink to="/ephmatch/opt-out">Opt Out</StylizedLink>
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
