// React imports
import React from "react";
import PropTypes from "prop-types";

// Redux/routing imports
import { connect } from "react-redux";

// Additional imports
import { Link } from "react-router5";
import { createRouteNodeSelector } from "redux-router5";
import styles from "./AboutLayout.module.scss";

const NavLink = ({ activeStyle, children, defaultStyle, route, routeName }) => {
  if (routeName === route.name) {
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
  const routeNodeSelector = createRouteNodeSelector("about");

  return (state) => routeNodeSelector(state);
};

const ConnectedNavLink = connect(mapStateToProps)(NavLink);

const AboutLayout = ({ children }) => {
  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.pageHead}>
          <h1 className={styles.pageTitle}>
            <Link routeName="about">About</Link>
          </h1>
          <div className={styles.navLinks}>
            <ConnectedNavLink
              activeStyle={styles.activeNavLink}
              defaultStyle={styles.navLink}
              routeName="about"
            >
              WSO
            </ConnectedNavLink>

            <ConnectedNavLink
              activeStyle={styles.activeNavLink}
              defaultStyle={styles.navLink}
              routeName="about.team"
            >
              Meet The Team
            </ConnectedNavLink>
          </div>
        </div>
      </header>
      {children}
    </>
  );
};
AboutLayout.propTypes = {
  children: PropTypes.element,
};
AboutLayout.defaultProps = {
  children: null,
};
export default AboutLayout;
