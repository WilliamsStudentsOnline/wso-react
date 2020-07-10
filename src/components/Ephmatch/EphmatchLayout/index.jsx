// React imports
import React from "react";
import PropTypes from "prop-types";

// Additional imports
import { Link } from "react-router5";
import { format } from "timeago.js";
import { containsOneOfScopes, scopes } from "../../../lib/general";
import styles from "./EphmatchLayout.module.scss";

const EphmatchLayout = ({
  available,
  children,
  closingTime,
  // matchesTotalCount,
  token,
}) => {
  return (
    <>
      <header className={styles.pageHeader}>
        {available && closingTime && (
          // TODO: test this.
          <section className="notice">
            Ephmatch closes {format(closingTime)}
          </section>
        )}

        <div className={styles.pageHead}>
          <h1 className={styles.pageTitle}>
            <Link routeName="ephmatch">EphMatch</Link>
          </h1>
          <div className={styles.navLinks}>
            {containsOneOfScopes(token, [
              scopes.ScopeEphmatchMatches,
              scopes.ScopeEphmatchProfiles,
            ]) && (
              <>
                <Link routeName="ephmatch.matches">My Matches</Link>
                {/* <span className="ephmatch-badge" title="Matches!">
                  {matchesTotalCount}
                </span> */}

                <Link routeName="ephmatch.profile">My Profile</Link>

                <Link routeName="ephmatch.settings">Settings</Link>
              </>
            )}
          </div>
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
  // matchesTotalCount: PropTypes.number,
  token: PropTypes.string.isRequired,
};

EphmatchLayout.defaultProps = {
  available: false,
  children: null,
  closingTime: null,
  // matchesTotalCount: 0,
};

export default EphmatchLayout;
