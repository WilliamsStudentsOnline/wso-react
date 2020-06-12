// React Imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// React/Redux imports
import { getCurrUser, getWSO } from "../selectors/auth";
import { connect } from "react-redux";

// External imports
// Connected Link is the same as link, except it re-renders on route changes
import { Link, ConnectedLink } from "react-router5";
import { createRouteNodeSelector } from "redux-router5";

const Nav = ({ wso, currUser }) => {
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
        // eslint-disable-next-line no-empty
      }
    };

    const checkEphmatchVisibility = async () => {
      try {
        const ephmatchAvailabilityResp = await wso.ephmatchService.getAvailability();

        if (ephmatchAvailabilityResp?.data?.available) {
          updateEphmatchVisibility(true);
        }
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    if (currUser) {
      loadPhoto();
      checkEphmatchVisibility();
    } else {
      updateEphmatchVisibility(false);
    }

    updateMenuVisibility(false);
  }, [wso, currUser]);

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
            <li>
              <Link routeName="factrak">Factrak</Link>
            </li>
            <li>
              <Link routeName="dormtrak">Dormtrak</Link>
            </li>
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
            {currUser && currUser.id ? (
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
                  <Link routeName="logout">Logout</Link>
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
  wso: PropTypes.object.isRequired,
};

Nav.defaultProps = { currUser: {} };

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("");

  return (state) => ({
    wso: getWSO(state),
    currUser: getCurrUser(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(Nav);
