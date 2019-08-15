// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getToken, getCurrUser } from "../../../selectors/auth";
import { actions } from "redux-router5";

import { getDormtrakNeighborhoods } from "../../../api/dormtrak";
import { checkAndHandleError } from "../../../lib/general";
import { Link } from "react-router5";

const DormtrakLayout = ({ children, token, currUser, navigateTo }) => {
  const [neighborhoods, updateNeighborhoods] = useState([]);
  const [query, updateQuery] = useState("");

  useEffect(() => {
    const loadRankings = async () => {
      const neighborhoodsResponse = await getDormtrakNeighborhoods(token);

      if (checkAndHandleError(neighborhoodsResponse)) {
        updateNeighborhoods(neighborhoodsResponse.data.data);
      }
    };

    loadRankings();
  }, [token]);

  const submitHandler = (event) => {
    event.preventDefault();

    navigateTo("dormtrak.search", { q: query }, { reload: true });
  };

  if (currUser) {
    if (!currUser.hasAcceptedDormtrakPolicy) {
      navigateTo("dormtrak.policy");
    }
    return (
      <>
        <header>
          <div className="page-head">
            <h1>
              <Link routeName="dormtrak">Dormtrak</Link>
            </h1>
            <ul>
              <li>
                <Link routeName="dormtrak">Home</Link>
              </li>
              <li>
                <Link routeName="dormtrak.policy">Policy</Link>
              </li>
              <li>
                <a
                  href="http://student-life.williams.edu"
                  title="Office of Student Life"
                >
                  OSL
                </a>
              </li>
              {neighborhoods.map((neighborhood) =>
                neighborhood.name !== "First-year" &&
                neighborhood.name !== "Co-op" ? (
                  <li key={neighborhood.name}>
                    <Link
                      routeName="dormtrak.neighborhoods"
                      routeParams={{ neighborhoodID: neighborhood.id }}
                      title={`${neighborhood.name} Neighborhood Dorms`}
                    >
                      {neighborhood.name}
                    </Link>
                  </li>
                ) : null
              )}
            </ul>
          </div>

          <form onSubmit={(event) => submitHandler(event)}>
            <input
              type="search"
              id="search"
              placeholder="Enter all or part of a building's name"
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
            />
            <input
              type="submit"
              value="Search"
              className="submit"
              data-disable-with="Search"
            />
          </form>
        </header>
        {children}
      </>
    );
  }

  navigateTo("home");
  return null;
};

DormtrakLayout.propTypes = {
  children: PropTypes.object.isRequired,
  currUser: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

DormtrakLayout.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
  currUser: getCurrUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DormtrakLayout);
