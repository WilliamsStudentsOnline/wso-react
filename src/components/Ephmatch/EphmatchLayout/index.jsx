// React imports
import React from "react";
import PropTypes from "prop-types";

// Redux/routing imports
import { connect } from "react-redux";

// Additional imports
import { Link } from "react-router5";
import { format } from "timeago.js";
import { containsOneOfScopes, scopes } from "../../../lib/general";
import { createRouteNodeSelector } from "redux-router5";
import styles from "./EphmatchLayout.module.scss";

const NavLink = ({ activeStyle, children, defaultStyle, route, routeName }) => {
  console.log(routeName);
  console.log(route);
  if (routeName === route.name) {
    console.log(activeStyle);
    return (
      <Link className={activeStyle} routeName={routeName}>
        {children}
      </Link>
    );
  }

  return (
    <Link className={defaultStyle} routeName={routeName}>
      {children}
    </Link>
  );
};

NavLink.propTypes = {
  activeStyle: PropTypes.string,
  children: PropTypes.element,
  defaultStyle: PropTypes.string,
  route: PropTypes.object.isRequired,
  routeName: PropTypes.string.isRequired,
};
NavLink.defaultProps = {
  activeStyle: "",
  children: null,
  defaultStyle: "",
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("ephmatch");

  return (state) => routeNodeSelector(state);
};

const ConnectedNavLink = connect(mapStateToProps)(NavLink);

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
                <ConnectedNavLink
                  activeStyle={styles.activeNavLink}
                  defaultStyle={styles.navLink}
                  routeName="ephmatch.matches"
                >
                  My Matches
                </ConnectedNavLink>
                {/* <span className="ephmatch-badge" title="Matches!">
                  {matchesTotalCount}
                </span> */}

                <ConnectedNavLink
                  activeStyle={styles.activeNavLink}
                  defaultStyle={styles.navLink}
                  routeName="ephmatch.profile"
                >
                  My Profile
                </ConnectedNavLink>

                <ConnectedNavLink
                  activeStyle={styles.activeNavLink}
                  defaultStyle={styles.navLink}
                  routeName="ephmatch.settings"
                >
                  Settings
                </ConnectedNavLink>
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
