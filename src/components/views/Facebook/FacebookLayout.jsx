// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getCurrUser } from "../../../selectors/auth";
import { actions } from "redux-router5";

import { Link } from "react-router5";

const FacebookLayout = ({ children, currUser, navigateTo }) => {
  const [query, updateQuery] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();

    navigateTo("facebook", { q: query }, { reload: true });
  };

  return (
    <div className="facebook">
      <header>
        <div className="page-head">
          <h1>
            <Link routeName="facebook">Facebook</Link>
          </h1>
          <ul>
            <li>
              <Link routeName="facebook">Search</Link>
            </li>
            <li>
              <Link routeName="facebook.help">Help</Link>
            </li>

            {currUser && currUser.id ? (
              <>
                <li>
                  <Link
                    routeName="facebook.users"
                    routeParams={{ userID: currUser.id }}
                  >
                    View
                  </Link>
                </li>
                <li>
                  <a href="/facebook/edit"> Edit </a>
                </li>
              </>
            ) : null}
          </ul>
        </div>
        <form onSubmit={submitHandler}>
          <input
            id="search"
            type="search"
            placeholder="Search Facebook"
            onChange={(event) => updateQuery(event.target.value)}
          />
          <input
            data-disable-with="Search"
            type="submit"
            value="Search"
            className="submit"
          />
        </form>
      </header>
      {children}
    </div>
  );
};

FacebookLayout.propTypes = {
  children: PropTypes.object,
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

FacebookLayout.defaultProps = {
  children: {},
};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FacebookLayout);
