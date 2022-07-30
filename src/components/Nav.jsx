// React Imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// Redux imports
import { getCurrUser, getWSO } from "../selectors/auth";
import { connect } from "react-redux";
import { doRemoveCreds } from "../actions/auth";

// External imports
// Connected Link is the same as link, except it re-renders on route changes
import { Link } from "react-router-dom";
// import { ConnectedLink, Link } from "react-router5";
// import { createRouteNodeSelector } from "redux-router5";

import { removeStateFromStorage } from "../stateStorage";
import { userTypeStudent } from "../constants/general";

const Nav = ({ currUser, removeCreds, wso }) => {
  const [menuVisible, updateMenuVisibility] = useState(false);
  const [userPhoto, updateUserPhoto] = useState(null);
  const [ephmatchVisibility, updateEphmatchVisibility] = useState(0);
  // 0 - off, 1 - on, 2 - senior only

  useEffect(() => {
    const loadPhoto = async () => {
      try {
        const photoResponse = await wso.userService.getUserThumbPhoto(
          currUser.unixID
        );
        updateUserPhoto(URL.createObjectURL(photoResponse));
      } catch {
        // Do nothing - it's okay to gracefully handle this.
      }
    };

    const checkEphmatchVisibility = async () => {
      try {
        const ephmatchAvailabilityResp = await wso.ephmatchService.getAvailability();

        if (
          ephmatchAvailabilityResp?.data?.available ||
          (ephmatchAvailabilityResp?.data?.nextOpenTime &&
            new Date(ephmatchAvailabilityResp?.data?.nextOpenTime).valueOf() -
              new Date().valueOf() <
              4 * 604800000) // used to be 1 week: 604800000. Now 4 weeks: 3024000000
        ) {
          if (ephmatchAvailabilityResp?.data?.seniorOnly) {
            updateEphmatchVisibility(2);
          } else {
            updateEphmatchVisibility(1);
          }
        }
      } catch {
        // Do nothing - it's okay to gracefully handle this.
      }
    };

    if (currUser) {
      loadPhoto();
      checkEphmatchVisibility();
    } else {
      updateEphmatchVisibility(0);
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
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="facebook">Facebook</Link>
            </li>
            {currUser?.type === userTypeStudent && (
              <>
                <li>
                  <Link to="factrak">Factrak</Link>
                </li>
                <li>
                  <Link to="dormtrak">Dormtrak</Link>
                </li>
              </>
            )}

            <li>
              <Link to="faq">FAQ</Link>
            </li>
            <li>
              <a href="/wiki/">Wiki</a>
            </li>
            <li>
              <Link to="about">About</Link>
            </li>
            <li>
              <Link to="schedulecourses">Course Scheduler</Link>
            </li>
            {ephmatchVisibility > 0 && (
              <li>
                <Link
                  className="ephmatch-link"
                  style={{ color: "#fff238" }}
                  to="ephmatch"
                >
                  {ephmatchVisibility === 2 ? "Senior " : ""}Ephmatch
                </Link>
              </li>
            )}
            {/* userScopes &&
              scopesContainsOneOfScopes(userScopes, [scopes.ScopeGoodrich]) && (
                <>
                  <li>
                    <Link routeName="goodrich">Goodrich</Link>
                  </li>
                </>
              ) */}
          </ul>
        </span>

        <span className="nav-right-container">
          <ul className="nav-right">
            {currUser?.id ? (
              <>
                <li className="avatar">
                  <Link to={`facebook/users/${currUser.id}`}>
                    <img src={userPhoto} alt="avatar" />
                  </Link>
                </li>
                <li>
                  {/* TODO: does React Router Link support onClick? */}
                  <Link onClick={() => logout()} to="/">
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link to="login">Login</Link>
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
  // userScopes: PropTypes.arrayOf(PropTypes.string),
};

Nav.defaultProps = { currUser: {} /* userScopes: [] */ };

const mapStateToProps = () => {
  // const routeNodeSelector = createRouteNodeSelector("");

  return (state) => ({
    currUser: getCurrUser(state),
    wso: getWSO(state),
    // userScopes: getScopes(state),
    // ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  removeCreds: () => dispatch(doRemoveCreds()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
