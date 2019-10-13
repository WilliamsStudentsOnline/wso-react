// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getCurrUser } from "../../../selectors/auth";
import { actions, createRouteNodeSelector } from "redux-router5";

// Additional imports
import { Link } from "react-router5";

const FacebookLayout = ({ children, currUser, navigateTo, route }) => {
  const [query, updateQuery] = useState("");

  useEffect(() => {
    if (route.params.q) {
      updateQuery(route.params.q);
    } else {
      updateQuery("");
    }
  }, [route.params.q]);

  // Handles submissions
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
            {currUser != null
              ? [
                  <li>
                    <Link
                      routeName="facebook.users"
                      routeParams={{ userID: currUser.id }}
                    >
                      View
                    </Link>
                  </li>,
                  <li>
                    <Link routeName="facebook.edit"> Edit </Link>
                  </li>,
                ]
              : null}
          </ul>
        </div>
        <form onSubmit={submitHandler}>
          <input
            id="search"
            type="search"
            placeholder="Search Facebook"
            autoFocus
            onChange={(event) => updateQuery(event.target.value)}
            value={query}
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
  route: PropTypes.object.isRequired,
};

FacebookLayout.defaultProps = {
  children: {},
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("facebook");

  return (state) => ({
    currUser: getCurrUser(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FacebookLayout);
