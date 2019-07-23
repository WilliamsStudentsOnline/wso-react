// React Imports
import React from "react";
import PropTypes from "prop-types";

const Header = ({ ephCatch, currentUser }) => {
  let unseen = 0;

  if (currentUser && currentUser.ephcatch_unseen_matches)
    unseen = currentUser.ephcatch_unseen_matches.size;

  return (
    <nav>
      <div className="nav-container">
        <span className="nav-left-container">
          <button type="button" id="nav-menu-button">
            Menu
          </button>
          <ul className="nav-left" id="nav-menu-content">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/facebook">Facebook</a>
            </li>
            {ephCatch ? (
              <li>
                <a href="/ephcatch">Ephcatch</a>
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
                  <a href="/factrak">Factrak</a>
                </li>
                <li>
                  <a href="/dormtrak">Dormtrak</a>
                </li>
              </>
            )}

            <li>
              <a href="/listserv">Listserv</a>
            </li>
            <li>
              <a href="/hours">Hours</a>
            </li>
            <li>
              <a href="/wiki">Wiki</a>
            </li>
            <li>
              {" "}
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/schedulecourses">Course Scheduler</a>
            </li>
          </ul>
        </span>

        <span className="nav-right-container">
          <ul className="nav-right">
            {currentUser ? (
              <>
                <li className="avatar">
                  <a href={`/facebook/users/${currentUser.id}`}>
                    <img src={`/pic/${currentUser.unix_id}`} alt="avatar" />
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

Header.propTypes = {
  ephCatch: PropTypes.bool,
  currentUser: PropTypes.object
};

Header.defaultProps = {
  ephCatch: false,
  currentUser: false
};

export default Header;
