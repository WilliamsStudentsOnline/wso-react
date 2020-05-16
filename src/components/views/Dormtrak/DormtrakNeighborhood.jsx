// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import HoodTableRow, { HoodTableRowSkeleton } from "./HoodTableRow";

// Redux/ Routing imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";
import { createRouteNodeSelector } from "redux-router5";

const DormtrakNeighborhood = ({ wso, route }) => {
  const [neighborhood, updateHoodInfo] = useState(null);

  useEffect(() => {
    const loadNeighborhood = async () => {
      const neighborhoodID = route.params.neighborhoodID;

      try {
        const hoodResponse = await wso.dormtrakService.getNeighborhood(
          neighborhoodID
        );
        updateHoodInfo(hoodResponse.data);
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    loadNeighborhood();
  }, [wso, route.params.neighborhoodID]);

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
                  <HoodTableRow wso={wso} dorm={dorm} key={dorm.id} />
                ))
              : [...Array(5)].map((_, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <HoodTableRowSkeleton key={i} />
                ))}
          </tbody>
        </table>
      </section>
    </article>
  );
};

DormtrakNeighborhood.propTypes = {
  wso: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

DormtrakNeighborhood.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("dormtrak.neighborhoods");

  return (state) => ({
    wso: getWSO(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(DormtrakNeighborhood);
