// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getAPI, getCurrUser } from "../../../selectors/auth";
import { actions } from "redux-router5";

// Additional imports
import { Link } from "react-router5";

const DormtrakLayout = ({ api, children, currUser, navigateTo }) => {
  const [neighborhoods, updateNeighborhoods] = useState([]);
  const [query, updateQuery] = useState("");

  useEffect(() => {
    const loadRankings = async () => {
      try {
        const neighborhoodsResponse = await api.dormtrakService.getDormtrakNeighborhoods();
        updateNeighborhoods(neighborhoodsResponse.data);
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    loadRankings();
  }, [api]);

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

  return null;
};

DormtrakLayout.propTypes = {
  api: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

DormtrakLayout.defaultProps = {};

const mapStateToProps = (state) => ({
  api: getAPI(state),
  currUser: getCurrUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DormtrakLayout);
