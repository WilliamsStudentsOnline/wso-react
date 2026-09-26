// React imports
import React from "react";
import PropTypes from "prop-types";

// Additional imports
import { format } from "timeago.js";
import { containsOneOfScopes, scopes } from "../../../lib/general";
import { ServiceHeader } from "../../ui";

const EphmatchLayout = ({
  available,
  children,
  closingTime,
  matchesTotalCount,
  token,
}) => {
  const tabs = [
    { to: "/ephmatch", label: "Home", end: true },
    ...(containsOneOfScopes(token, [
      scopes.ScopeEphmatchMatches,
      scopes.ScopeEphmatchProfiles,
    ])
      ? [
          {
            to: "/ephmatch/matches",
            label: (
              <>
                Matches
                <span className="ephmatch-badge" title="Matches!">
                  {matchesTotalCount}
                </span>
              </>
            ),
          },
          { to: "/ephmatch/profile", label: "Profile" },
          { to: "/ephmatch/opt-out", label: "Opt Out" },
        ]
      : []),
  ];

  return (
    <>
      <ServiceHeader
        title="Ephmatch"
        titleTo="/ephmatch"
        tabs={tabs}
        notice={
          available && closingTime ? (
            <section className="notice">
              Ephmatch closes {format(closingTime)}
            </section>
          ) : null
        }
      />
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
