// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getWSO, getCurrUser } from "../../../selectors/auth";
import { actions } from "redux-router5";

// Additional imports
import { Link } from "react-router5";
import styles from "./DormtrakLayout.module.scss";
import Redirect from "../../common/Redirect";

// Elastic Imports
import {
  EuiButton,
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
} from "@elastic/eui";

const DormtrakLayout = ({ children, currUser, navigateTo, wso }) => {
  const [neighborhoods, updateNeighborhoods] = useState([]);
  const [query, updateQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadNeighborhoods = async () => {
      try {
        const neighborhoodsResponse = await wso.dormtrakService.listNeighborhoods();
        if (isMounted) {
          updateNeighborhoods(
            neighborhoodsResponse.data.filter(
              (n) => n.name !== "First-year" && n.name !== "Co-op"
            )
          );
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

    navigateTo("dormtrak.search", { q: query }, { reload: true });
  };

  if (currUser) {
    return (
      <>
        <header>
          <EuiFlexGroup
            className={styles.pageHead}
            alignItems="flexStart"
            gutterSize="none"
          >
            <EuiFlexItem grow={1}>
              <h1>
                <Link routeName="dormtrak">Dormtrak</Link>
              </h1>
            </EuiFlexItem>
            <EuiFlexItem grow={4}>
              <EuiFlexGroup direction="column">
                <EuiFlexItem>
                  <form onSubmit={submitHandler} className={styles.searchBar}>
                    <EuiFlexGroup>
                      <EuiFlexItem className={styles.searchWrapper}>
                        <EuiFieldSearch
                          placeholder="Enter all or part of a building's name"
                          value={query}
                          onChange={(event) => updateQuery(event.target.value)}
                          fullWidth
                        />
                      </EuiFlexItem>
                      <EuiFlexItem grow={false}>
                        <EuiButton fill onClick={submitHandler}>
                          Search
                        </EuiButton>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </form>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFlexGroup
                    direction="row"
                    className={styles.factrakText}
                    justifyContent="flexStart"
                  >
                    {neighborhoods.map((neighborhood) => (
                      <EuiFlexItem grow={false} key={neighborhood.name}>
                        <Link
                          routeName="dormtrak.neighborhoods"
                          routeParams={{ neighborhoodID: neighborhood.id }}
                          title={`${neighborhood.name} Neighborhood Dorms`}
                        >
                          {neighborhood.name}
                        </Link>
                      </EuiFlexItem>
                    ))}
                    <EuiFlexItem grow={false}>
                      <a
                        href="http://student-life.williams.edu"
                        title="Office of Campus Life"
                      >
                        OCL
                      </a>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <Link routeName="dormtrak.policy">Policy</Link>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
            <EuiFlexItem grow={3} />
          </EuiFlexGroup>
          <hr className={styles.lineBreak} />
        </header>
        {children}
      </>
    );
  }

  return <Redirect to="login" />;
};

DormtrakLayout.propTypes = {
  children: PropTypes.object.isRequired,
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  wso: PropTypes.object.isRequired,
};

DormtrakLayout.defaultProps = {};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
  wso: getWSO(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DormtrakLayout);
