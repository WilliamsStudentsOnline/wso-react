// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux/ Router imports
import { connect } from "react-redux";
import { getWSO, getCurrUser } from "../../../selectors/auth";
import { actions, createRouteNodeSelector } from "redux-router5";

// Additional imports
import { Link } from "react-router5";
import styles from "./FactrakLayout.module.scss";
import SearchIcon from "../../../assets/SVG/VectorsearchIcon.svg";
import SearchIconPurple from "../../../assets/SVG/VectorsearchIconPurple.svg";

// Elastic Imports
import { EuiButton, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";

const FactrakLayout = ({ children, currUser, navigateTo, route }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadQuery = () => {
      if (route.params.q) setQuery(route.params.q);
      else setQuery(""); // Needed to reset if user clears the box.
    };

    if (isMounted) {
      loadQuery();
    }

    return () => {
      isMounted = false;
    };
  }, [route.params.q, route.path]);

  const factrakAutocomplete = async (event) => {
    setQuery(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    navigateTo("factrak.search", { q: query }, { reload: true });
  };

  if (currUser) {
    if (!currUser.hasAcceptedFactrakPolicy) {
      navigateTo("factrak.policy");
    }

    return (
      <>
        <header>
          <EuiFlexGroup className={styles.pageHead} alignItems="flexStart">
            <EuiFlexItem grow={1}>
              <h1>
                <Link routeName="factrak">Factrak</Link>
              </h1>
            </EuiFlexItem>
            <EuiFlexItem grow={4}>
              <EuiFlexGroup direction="column">
                <EuiFlexItem>
                  <form onSubmit={submitHandler} className={styles.searchBar}>
                    <EuiFlexGroup>
                      <EuiFlexItem className={styles.searchWrapper}>
                        <img
                          className={styles.searchIcon}
                          src={SearchIcon}
                          alt=""
                        />
                        <img
                          className={styles.searchIconPurple}
                          src={SearchIconPurple}
                          alt=""
                        />
                        <input
                          className={styles.search}
                          onChange={factrakAutocomplete}
                          onSubmit={submitHandler}
                          placeholder="Search Factrak"
                          type="text"
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
                    <EuiFlexItem grow={false}>
                      <Link routeName="factrak.surveys">My Reviews</Link>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <Link routeName="factrak.policy">Policy</Link>
                    </EuiFlexItem>
                    {currUser.factrakAdmin && (
                      <EuiFlexItem grow={false}>
                        <Link routeName="factrak.moderate">Moderate</Link>
                      </EuiFlexItem>
                    )}
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

  // Just to handle weird cases
  return null;
};

FactrakLayout.propTypes = {
  children: PropTypes.object.isRequired,
  currUser: PropTypes.object,
  navigateTo: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
};

FactrakLayout.defaultProps = { currUser: {} };

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("");

  return (state) => ({
    wso: getWSO(state),
    currUser: getCurrUser(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FactrakLayout);
