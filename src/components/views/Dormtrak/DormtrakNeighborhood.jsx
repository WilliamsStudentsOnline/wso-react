// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import HoodTableRow, { HoodTableRowSkeleton } from "./HoodTableRow";

// Redux/ Routing imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";
import { useNavigate, useParams } from "react-router-dom";

const DormtrakNeighborhood = ({ wso }) => {
  const navigateTo = useNavigate();
  const params = useParams();

  const [neighborhood, updateHoodInfo] = useState(null);

  useEffect(() => {
    const loadNeighborhood = async () => {
      const neighborhoodID = params.neighborhoodID;

      try {
        const hoodResponse = await wso.dormtrakService.getNeighborhood(
          neighborhoodID
        );
        updateHoodInfo(hoodResponse.data);
      } catch (error) {
        navigateTo("/error", { replace: true, state: error });
      }
    };

    loadNeighborhood();
  }, [params.neighborhoodID, wso]);

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
};

DormtrakNeighborhood.defaultProps = {};

const mapStateToProps = () => {
  return (state) => ({
    wso: getWSO(state),
  });
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DormtrakNeighborhood);
