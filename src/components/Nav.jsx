// React Imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// Redux imports
import { getCurrUser, getWSO } from "../selectors/auth";
import { connect } from "react-redux";
import { doRemoveCreds } from "../actions/auth";

// External imports
// Connected Link is the same as link, except it re-renders on route changes
import { ConnectedLink, Link } from "react-router5";
import { createRouteNodeSelector } from "redux-router5";

import { removeStateFromStorage } from "../stateStorage";
import { userTypeStudent } from "../constants/general";

const Nav = ({ currUser, removeCreds, wso }) => {
  const [menuVisible, updateMenuVisibility] = useState(false);
  const [userPhoto, updateUserPhoto] = useState(null);
  const [ephmatchVisibility, updateEphmatchVisibility] = useState(false);

  useEffect(() => {
    const loadPhoto = async () => {
      try {
        const photoResponse = await wso.userService.getUserThumbPhoto(
          currUser.unixID
        );
        updateUserPhoto(URL.createObjectURL(photoResponse.data));
      } catch {
        // Do nothing - it's okay to gracefully handle this.
      }
    };

    const checkEphmatchVisibility = async () => {
      try {
        const ephmatchAvailabilityResp = await wso.ephmatchService.getAvailability();

        if (ephmatchAvailabilityResp?.data?.available) {
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
  }, [currUser, wso]);

  const logout = () => {
    removeCreds();
    // Remove credentials from localStorage, since after logging out the edits will be done in
    // sessionStorage instead.
    removeStateFromStorage("state");
  };

  return (
    <nav>
      <div className="nav-container">
        <span className="nav-left-container">
          <a
            href="#top"
            type="button"
            id="nav-menu-button"
            onClick={(event) => {
              event.preventDefault();
              updateMenuVisibility(!menuVisible);
            }}
          >
            Menu
          </a>

          <ul
            className="nav-left"
            id="nav-menu-content"
            style={{ display: menuVisible ? "block" : "" }}
          >
            <li>
              <ConnectedLink routeName="home">Home</ConnectedLink>
            </li>
            <li>
              <Link routeName="facebook">Facebook</Link>
            </li>
            {currUser?.type === userTypeStudent && (
              <>
                <li>
                  <Link routeName="factrak">Factrak</Link>
                </li>
                <li>
                  <Link routeName="dormtrak">Dormtrak</Link>
                </li>
              </>
            )}

            <li>
              <Link routeName="faq">FAQ</Link>
            </li>
            <li>
              <a href="/wiki">Wiki</a>
            </li>
            <li>
              <Link routeName="about">About</Link>
            </li>
            <li>
              <Link routeName="scheduler">Course Scheduler</Link>
            </li>
            {ephmatchVisibility && (
              <li>
                <Link className="ephmatch-link" routeName="ephmatch">
                  Ephmatch
                </Link>
              </li>
            )}
          </ul>
        </span>

        <span className="nav-right-container">
          <ul className="nav-right">
            {currUser?.id ? (
              <>
                <li className="avatar">
                  <Link
                    routeName="facebook.users"
                    routeParams={{ userID: currUser.id }}
                  >
                    <img src={userPhoto} alt="avatar" />
                  </Link>
                </li>
                <li>
                  <Link onClick={() => logout()} routeName="home">
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link routeName="login">Login</Link>
              </li>
            )}
          </ul>
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
