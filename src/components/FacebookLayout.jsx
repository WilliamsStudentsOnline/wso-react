// React imports
import React from "react";
import PropTypes from "prop-types";
import SearchBox from "./SearchBox";

const FacebookLayout = ({ currentUser, authToken, children }) => {
  return (
    <div className="facebook">
      <header>
        <div className="page-head">
          <h1>
            <a href="/facebook"> Facebook </a>
          </h1>
          <ul>
            <li>
              <a href="/facebook"> Search </a>
            </li>
            <li>
              <a href="/facebook/help"> Help </a>
            </li>

            {currentUser ? (
              <>
                <li>
                  <a href={`/facebook/users/${currentUser.id}`}>View</a>
                </li>{" "}
                <li>
                  <a href="/facebook/edit"> Edit </a>
                </li>
              </>
            ) : null}
          </ul>
        </div>
        <SearchBox authToken={authToken} />
      </header>
      {children}
    </div>
  );
};

FacebookLayout.propTypes = {
  currentUser: PropTypes.object.isRequired,
  authToken: PropTypes.string.isRequired,
  children: PropTypes.object,
};

FacebookLayout.defaultProps = {
  children: {},
};

export default FacebookLayout;
