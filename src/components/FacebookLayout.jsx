// React imports
import React from "react";
import PropTypes from "prop-types";
import SearchBox from "./SearchBox";

// Redux imports
import { connect } from "react-redux";
import { getCurrUser } from "../selectors/auth";

const FacebookLayout = ({ children, currUser }) => {
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

            {currUser && currUser.id ? (
              <>
                <li>
                  <a href={`/facebook/users/${currUser.id}`}>View</a>
                </li>{" "}
                <li>
                  <a href="/facebook/edit"> Edit </a>
                </li>
              </>
            ) : null}
          </ul>
        </div>
        <SearchBox />
      </header>
      {children}
    </div>
  );
};

FacebookLayout.propTypes = {
  children: PropTypes.object,
};

FacebookLayout.defaultProps = {
  children: {},
};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
});

export default connect(mapStateToProps)(FacebookLayout);
