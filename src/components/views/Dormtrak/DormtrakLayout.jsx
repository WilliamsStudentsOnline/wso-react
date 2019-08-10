// React imports
import React from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getToken, getCurrUser } from "../../../selectors/auth";
import { actions } from "redux-router5";

import { Link } from "react-router5";

const DormtrakLayout = ({ children, neighborhoods, currUser, navigateTo }) => {
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
                    <a
                      href={`/dormtrak/hoods/${neighborhood.name}`}
                      title={`${neighborhood.name} Neighborhood Dorms`}
                    >
                      {neighborhood.name}
                    </a>
                  </li>
                ) : null
              )}
            </ul>
          </div>

          <form>
            <input
              type="search"
              id="search"
              placeholder="Enter all or part of a building's name"
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
  // token: PropTypes.object.isRequired,
  neighborhoods: PropTypes.arrayOf(PropTypes.object),
  navigateTo: PropTypes.func.isRequired,
};

DormtrakLayout.defaultProps = { neighborhoods: [{ name: "Dodd" }] };

const mapStateToProps = (state) => ({
  token: getToken(state),
  currUser: getCurrUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location) => dispatch(actions.navigateTo(location)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DormtrakLayout);
