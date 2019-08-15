// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

import { getDormtrakDorms } from "../../../api/dormtrak";
import { checkAndHandleError } from "../../../lib/general";
import { createRouteNodeSelector } from "redux-router5";

import { Link } from "react-router5";

const DormtrakSearch = ({ token, route }) => {
  const [dorms, updateDorms] = useState(null);

  useEffect(() => {
    const loadDorms = async () => {
      const queryParams = {
        q: route.params.q ? route.params.q : undefined,
        preload: ["neighborhood"],
      };
      const dormsResponse = await getDormtrakDorms(token, queryParams);

      if (checkAndHandleError(dormsResponse)) {
        updateDorms(dormsResponse.data.data.sort((a, b) => a.name > b.name));
      } else updateDorms([]);
    };

    loadDorms();
  }, [token, route.params.q]);

  return (
    <article className="facebook-results">
      <section>
        {!dorms || dorms.length === 0 ? (
          <>
            <br />
            <h1 className="no-matches-found">No matches were found.</h1>
          </>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Building</th>
                <th>Neighborhood</th>
              </tr>
            </thead>
            <tbody>
              {dorms.map((dorm) => (
                <tr key={dorm.id}>
                  <td>
                    <Link
                      routeName="dormtrak.dorms"
                      routeParams={{ dormID: dorm.id }}
                    >
                      {dorm.name}
                    </Link>
                  </td>

                  <td>
                    <Link
                      routeName="dormtrak.neighborhoods"
                      routeParams={{ neighborhoodID: dorm.neighborhood.id }}
                    >
                      {dorm.neighborhood.name}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </article>
  );
};

DormtrakSearch.propTypes = {
  token: PropTypes.string.isRequired,
  route: PropTypes.object.isRequired,
};

DormtrakSearch.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("dormtrak.search");

  return (state) => ({
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(DormtrakSearch);
