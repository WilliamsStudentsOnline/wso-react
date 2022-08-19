// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getWSO, getCurrUser } from "../../../selectors/auth";

// Additional imports
import { Link, useNavigate, Navigate } from "react-router-dom";

const DormtrakLayout = ({ children, currUser, wso }) => {
  const navigateTo = useNavigate();

  const [neighborhoods, updateNeighborhoods] = useState([]);
  const [query, updateQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadNeighborhoods = async () => {
      try {
        const neighborhoodsResponse =
          await wso.dormtrakService.listNeighborhoods();
        if (isMounted) {
          updateNeighborhoods(neighborhoodsResponse.data);
        }
      } catch {
        // It's alright to handle this gracefully without showing them.
      }
    };

    loadNeighborhoods();

    return () => {
      isMounted = false;
    };
  }, [wso]);

  const submitHandler = (event) => {
    event.preventDefault();

    navigateTo(`/dormtrak/search?q=${query}`, { reload: true });
  };

  if (currUser) {
    return (
      <>
        <header>
          <div className="page-head">
            <h1>
              <Link to="/dormtrak">Dormtrak</Link>
            </h1>
            <ul>
              <li>
                <Link to="/dormtrak">Home</Link>
              </li>
              <li>
                <Link to="/dormtrak/policy">Policy</Link>
              </li>
              <li>
                <a
                  href="http://student-life.williams.edu"
                  title="Office of Campus Life"
                >
                  OCL
                </a>
              </li>
              {neighborhoods.map((neighborhood) =>
                neighborhood.name !== "First-year" &&
                neighborhood.name !== "Co-op" ? (
                  <li key={neighborhood.name}>
                    <Link
                      to={`/dormtrak/neighborhoods/${neighborhood.id}`}
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

  return <Navigate to="/login" />;
};

DormtrakLayout.propTypes = {
  children: PropTypes.object.isRequired,
  currUser: PropTypes.object.isRequired,
  wso: PropTypes.object.isRequired,
};

DormtrakLayout.defaultProps = {};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DormtrakLayout);
