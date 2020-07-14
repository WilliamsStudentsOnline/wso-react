// React imports
import React from "react";
import PropTypes from "prop-types";

import styles from "./PostBoardLayout.module.scss";

// Redux/routing imports
import { connect } from "react-redux";

// Additional imports
import { Link } from "react-router5";
import { EuiHorizontalRule } from "@elastic/eui";
import { createRouteNodeSelector } from "redux-router5";
import {
  bulletinTypeLostAndFound,
  bulletinTypeJob,
  bulletinTypeRide,
  bulletinTypeExchange,
  bulletinTypeAnnouncement,
} from "../../../constants/general";

const NavLink = ({
  activeStyle,
  children,
  defaultStyle,
  route,
  routeName,
  routeParams,
}) => {
  if (routeName === route.name && route.params.type === routeParams.type) {
    return (
      <Link
        className={activeStyle}
        routeName={routeName}
        routeParams={routeParams}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      className={defaultStyle}
      routeName={routeName}
      routeParams={routeParams}
    >
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
  routeParams: PropTypes.object,
};
NavLink.defaultProps = {
  activeStyle: "",
  children: null,
  defaultStyle: "",
  routeParams: null,
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("");

  return (state) => routeNodeSelector(state);
};

const ConnectedNavLink = connect(mapStateToProps)(NavLink);

const PostBoardLayout = ({ children }) => {
  return (
    <div className={styles.page}>
      <div className={styles.pageContent}>
        <div className={styles.title}>
          <Link routeName="home">PostBoard</Link>
        </div>
        <div className={styles.navLinks}>
          <ConnectedNavLink
            activeStyle={styles.activeNavLink}
            defaultStyle={styles.navLink}
            routeName="discussions"
          >
            Discussions
          </ConnectedNavLink>
          <ConnectedNavLink
            activeStyle={styles.activeNavLink}
            defaultStyle={styles.navLink}
            routeName="bulletins"
            routeParams={{ type: bulletinTypeAnnouncement }}
          >
            Announcements
          </ConnectedNavLink>

          <ConnectedNavLink
            activeStyle={styles.activeNavLink}
            defaultStyle={styles.navLink}
            routeName="bulletins"
            routeParams={{ type: bulletinTypeExchange }}
          >
            Exchange
          </ConnectedNavLink>

          <ConnectedNavLink
            activeStyle={styles.activeNavLink}
            defaultStyle={styles.navLink}
            routeName="bulletins"
            routeParams={{ type: bulletinTypeLostAndFound }}
          >
            Lost and Found
          </ConnectedNavLink>

          <ConnectedNavLink
            activeStyle={styles.activeNavLink}
            defaultStyle={styles.navLink}
            routeName="bulletins"
            routeParams={{ type: bulletinTypeJob }}
          >
            Jobs
          </ConnectedNavLink>

          <ConnectedNavLink
            activeStyle={styles.activeNavLink}
            defaultStyle={styles.navLink}
            routeName="bulletins"
            routeParams={{ type: bulletinTypeRide }}
          >
            Ride Share
          </ConnectedNavLink>
        </div>
        <EuiHorizontalRule />
        {children}
      </div>
    </div>
  );
};

PostBoardLayout.propTypes = {
  children: PropTypes.object.isRequired,
};

export default PostBoardLayout;
