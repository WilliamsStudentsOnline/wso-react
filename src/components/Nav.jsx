// React Imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// React/Redux imports
import { getCurrUser, getToken } from "../selectors/auth";
import { connect } from "react-redux";

// External imports
// Connected Link is the same as link, except it re-renders on route changes
import { Link, ConnectedLink } from "react-router5";
import { checkAndHandleError } from "../lib/general";
import { getUserThumbPhoto } from "../api/users";
import { createRouteNodeSelector } from "redux-router5";

const Nav = ({ currUser, token, route }) => {
  const [menuVisible, updateMenuVisibility] = useState(false);
  const [userPhoto, updateUserPhoto] = useState(null);

  useEffect(() => {
    const loadPhoto = async () => {
      const photoResponse = await getUserThumbPhoto(token, currUser.unixID);
      if (checkAndHandleError(photoResponse)) {
        updateUserPhoto(URL.createObjectURL(photoResponse.data));
      }
    };

    if (currUser && token && token !== "") loadPhoto();
    updateMenuVisibility(false);
    // eslint-disable-next-line
  }, [token, route]);

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
            {currUser && currUser.ephCatchEligibility ? (
              <li>
                <Link routeName="ephcatch">Ephcatch</Link>
                {currUser.ephcatches.length > 0 ? (
                  <span className="ephcatch-badge">
                    <Link routeName="ephcatch.matches" title="New matches!">
                      {currUser.ephcatches.length}
                    </Link>
                  </span>
                ) : null}
              </li>
            ) : (
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
              <Link routeName="listserv">Listserv</Link>
            </li>
            <li>
              <Link routeName="hours">Hours</Link>
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
          </ul>
        </span>

        <span className="nav-right-container">
          <ul className="nav-right">
            {currUser ? (
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
  token: PropTypes.string,
  route: PropTypes.object.isRequired,
};

Nav.defaultProps = { currUser: {}, token: "" };

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("");

  return (state) => ({
    currUser: getCurrUser(state),
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(Nav);
