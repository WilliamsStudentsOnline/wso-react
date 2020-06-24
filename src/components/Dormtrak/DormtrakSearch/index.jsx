// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux/ Routing imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";
import { createRouteNodeSelector } from "redux-router5";

// Additional imports
import { Link } from "react-router5";

const DormtrakSearch = ({ wso, route }) => {
  const [dorms, updateDorms] = useState(null);

  useEffect(() => {
    const loadDorms = async () => {
      const queryParams = {
        q: route.params.q ? route.params.q : undefined,
        preload: ["neighborhood"],
      };

      try {
        const dormsResponse = await wso.dormtrakService.listDorms(queryParams);
        updateDorms(dormsResponse.data.sort((a, b) => a.name > b.name));
      } catch {
        updateDorms([]);
      }
    };

    loadDorms();
  }, [wso, route.params.q]);

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
  wso: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

DormtrakSearch.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("dormtrak.search");

  return (state) => ({
    wso: getWSO(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(DormtrakSearch);