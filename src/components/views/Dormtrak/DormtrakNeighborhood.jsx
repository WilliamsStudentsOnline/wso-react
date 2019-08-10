// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

// API imports
import { getDormtrakNeighborhood } from "../../../api/dormtrak";
import { checkAndHandleError } from "../../../lib/general";

import { createRouteNodeSelector } from "redux-router5";

const DormtrakNeighborhood = ({ route, token }) => {
  const [neighborhood, updateHoodInfo] = useState(null);

  useEffect(() => {
    const loadNeighborhood = async () => {
      const neighborhoodID = route.params.neighborhoodID;
      const hoodResponse = await getDormtrakNeighborhood(token, neighborhoodID);

      if (checkAndHandleError(hoodResponse)) {
        updateHoodInfo(hoodResponse.data.data);
      }
    };

    loadNeighborhood();
  }, [token, route.params.neighborhoodID]);

  return (
    <article className="facebook-results">
      <section>
        <table>
          <thead>
            <tr>
              <th>Building</th>
              <th>Singles</th>
              <th>Doubles</th>
              <th>Flexes</th>

              <th>Seniors</th>
              <th>Juniors</th>
              <th>Sophomores</th>
            </tr>
          </thead>
          <tbody>
            {neighborhood
              ? neighborhood.dorms.map((dorm) => (
                  <tr key={dorm.id}>
                    <td>
                      <a href={`/dormtrak/dorms/${dorm.name}`}>{dorm.name}</a>
                    </td>
                    <td>{dorm.numberSingles}</td>
                    <td>{dorm.numberDoubles}</td>
                    <td>{dorm.numberFlex}</td>
                    {dorm.students ? (
                      <>
                        <td>{dorm.students.seniors}</td>
                        <td>{dorm.students.juniors}</td>
                        <td>{dorm.students.sophomores}</td>
                      </>
                    ) : (
                      <>
                        <td>N/A</td>
                        <td>N/A</td>
                        <td>N/A</td>
                      </>
                    )}
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </section>
    </article>
  );
};

DormtrakNeighborhood.propTypes = {
  token: PropTypes.string.isRequired,
  route: PropTypes.object.isRequired,
};

DormtrakNeighborhood.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("dormtrak.neighborhoods");

  return (state) => ({
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(DormtrakNeighborhood);
