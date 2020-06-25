// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getCurrUser } from "../../../selectors/auth";
import { actions, createRouteNodeSelector } from "redux-router5";

// Additional imports
import { Link } from "react-router5";
import { EuiFormControlLayout, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import styles from "./FacebookLayout.module.scss";

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
    navigateTo("facebook", { q: query });
  };

  return (
    <article className={styles.facebook}>
      <header>
        <div className="page-head">
          <h1>
            <Link routeName="facebook">Facebook</Link>
          </h1>
          <article className={styles.search}>
            <form onSubmit={submitHandler}>
              <EuiFormControlLayout
                icon="search"
                className={styles.formControlLayout}
              >
                <input
                  id="search"
                  type="search"
                  placeholder="Search Facebook"
                  autoFocus
                  onChange={(event) => updateQuery(event.target.value)}
                  value={query}
                />
              </EuiFormControlLayout>
            </form>
          </article>
          <br />
          <article className={styles.options}>
            <EuiFlexGroup justifyContent="center">
              <EuiFlexItem grow={false}>
                {currUser && [
                  <Link
                    routeName="facebook.users"
                    routeParams={{ userID: currUser.id }}
                  >
                    My Profile
                  </Link>,
                ]}
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <Link routeName="facebook.help">Help</Link>
              </EuiFlexItem>
            </EuiFlexGroup>
          </article>
        </div>
      </header>
      {children}
    </article>
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

export default connect(mapStateToProps, mapDispatchToProps)(FacebookLayout);
