// React Imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// Redux imports
import { getCurrUser, getWSO } from "../../../selectors/auth";
import { connect } from "react-redux";
import { doRemoveCreds } from "../../../actions/auth";

// External imports
// Connected Link is the same as link, except it re-renders on route changes
import { ConnectedLink, Link } from "react-router5";
import { createRouteNodeSelector } from "redux-router5";

import { removeStateFromStorage } from "../../../stateStorage";
import { userTypeStudent } from "../../../constants/general";

// Asset imports
import WSOLogo from "../../../assets/images/brand/wso_icon_white_border.svg";
import styles from "./Nav.module.scss";

const Nav = ({ currUser, removeCreds, wso }) => {
  const [menuVisible, updateMenuVisibility] = useState(false);
  const [userPhoto, updateUserPhoto] = useState(null);
  const [ephmatchVisibility, updateEphmatchVisibility] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadPhoto = async () => {
      try {
        const photoResponse = await wso.userService.getUserThumbPhoto(
          currUser.unixID
        );

        if (isMounted) {
          updateUserPhoto(URL.createObjectURL(photoResponse.data));
        }
      } catch {
        // Do nothing - it's okay to gracefully handle this.
      }
    };

    const checkEphmatchVisibility = async () => {
      try {
        const ephmatchAvailabilityResp = await wso.ephmatchService.getAvailability();

        if (ephmatchAvailabilityResp?.data?.available && isMounted) {
          updateEphmatchVisibility(true);
        }
      } catch {
        // Do nothing - it's okay to gracefully handle this.
      }
    };

    if (currUser) {
      loadPhoto();
      checkEphmatchVisibility();
    } else {
      updateEphmatchVisibility(false);
    }

    updateMenuVisibility(false);

    return () => {
      isMounted = false;
    };
  }, [currUser, wso]);

  const logout = () => {
    removeCreds();
    // Remove credentials from localStorage, since after logging out the edits will be done in
    // sessionStorage instead.
    removeStateFromStorage("state");
  };

  return (
    <nav id={styles.navBar}>
      <div id={styles.navContainer}>
        <span className={styles.navLeftContainer}>
          <a
            href="#top"
            type="button"
            id={styles.navMenuButton}
            onClick={(event) => {
              event.preventDefault();
              updateMenuVisibility(!menuVisible);
            }}
          >
            Menu
          </a>
          <span className={menuVisible ? styles.navLeft : styles.navLeftHidden}>
            <ConnectedLink routeName="home">
              <img src={WSOLogo} id={styles.navLogo} alt="WSO logo" />
            </ConnectedLink>
            <Link routeName="facebook">Facebook</Link>

            {currUser?.type === userTypeStudent && (
              <>
                <Link routeName="factrak">Factrak</Link>
                <Link routeName="dormtrak">Dormtrak</Link>
              </>
            )}

            <a href="/wiki">Wiki</a>
            <Link routeName="about">About</Link>
            <Link routeName="scheduler">Course Scheduler</Link>

            {ephmatchVisibility && (
              <Link className={styles.ephMatchLink} routeName="ephmatch">
                Ephmatch
              </Link>
            )}
          </span>
        </span>

        <span className={styles.navRight}>
          {currUser?.id ? (
            <>
              <Link
                routeName="facebook.users"
                routeParams={{ userID: currUser.id }}
              >
                <img src={userPhoto} alt="avatar" />
              </Link>
              <Link onClick={() => logout()} routeName="home">
                Logout
              </Link>
            </>
          ) : (
            <Link routeName="login">Login</Link>
          )}
        </span>
      </div>
    </nav>
  );
};

Nav.propTypes = {
  // No isRequired because it must work for non-authenticated users too
  currUser: PropTypes.object,
  removeCreds: PropTypes.func.isRequired,
  wso: PropTypes.object.isRequired,
};

Nav.defaultProps = { currUser: {} };

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("");

  return (state) => ({
    currUser: getCurrUser(state),
    wso: getWSO(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  removeCreds: () => dispatch(doRemoveCreds()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
