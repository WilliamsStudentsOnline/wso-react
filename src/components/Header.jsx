// React Imports
import React from "react";
import { connect } from "react-redux";

// Utility imports
import { getCurrUser } from "../selectors/auth";

// External imports
// Connected Link is the same as link, except it re-renders on route changes
import { Link, ConnectedLink } from "react-router5";

// @TODO: Rename to Nav?
const Header = ({ currUser }) => {
  let unseen = 0;

  // @TODO: Find number of ephcatch unseen matches, update unseen.

  const ephCatch = false; // @TODO: checkScope("service:ephcatch");

  return (
    <nav>
      <div className="nav-container">
        <span className="nav-left-container">
          <button type="button" id="nav-menu-button">
            Menu
          </button>
          <ul className="nav-left" id="nav-menu-content">
            <li>
              <ConnectedLink routeName="home">Home</ConnectedLink>
            </li>
            <li>
              <Link routeName="facebook">Facebook</Link>
            </li>
            {ephCatch ? (
              <li>
                <Link routeName="ephcatch">Ephcatch</Link>
                {unseen > 0 ? (
                  <span className="ephcatch-badge">
                    <a href="<%=matches_path%>" title="New matches!">
                      {unseen}
                    </a>
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
                  <a href={`/facebook/users/${currUser.id}`}>
                    <img src={`/pic/${currUser.unixID}`} alt="avatar" />
                  </a>
                </li>
                <li>
                  <a href="/account/logout">Logout</a>
                </li>
              </>
            ) : (
              <li>
                <a href="/account/login">Login</a>
              </li>
            )}
          </ul>
        </span>
      </div>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
});

export default connect(mapStateToProps)(Header);
