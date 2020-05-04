// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Line } from "../../Skeleton";

// Redux imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

// Additional imports
import { Link } from "react-router5";

const HoodTableRow = ({ api, dorm }) => {
  const [dormInfo, updateDormInfo] = useState(null);

  useEffect(() => {
    const loadDormInfo = async () => {
      try {
        const dormResponse = await api.dormtrakService.getDormtrakDormFacts(
          dorm.id
        );
        updateDormInfo(dormResponse.data);
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    loadDormInfo();
  }, [api, dorm]);

  return (
    <tr key={dorm.id}>
      <td>
        <Link routeName="dormtrak.dorms" routeParams={{ dormID: dorm.id }}>
          {dorm.name}
        </Link>
      </td>
      <td>{dorm.numberSingles}</td>
      <td>{dorm.numberDoubles}</td>
      <td>{dorm.numberFlex}</td>

      <td>{dormInfo && dormInfo.seniorCount}</td>
      <td>{dormInfo && dormInfo.juniorCount}</td>
      <td>{dormInfo && dormInfo.sophomoreCount}</td>
    </tr>
  );
};

HoodTableRow.propTypes = {
  api: PropTypes.object.isRequired,
  dorm: PropTypes.object.isRequired,
};

const HoodTableRowSkeleton = () => {
  return (
    <tr>
      <td>
        <Line width="50%" />
      </td>
      <td>
        <Line width="15%" />
      </td>
      <td>
        <Line width="15%" />
      </td>
      <td>
        <Line width="15%" />
      </td>
      <td>
        <Line width="15%" />
      </td>
      <td>
        <Line width="15%" />
      </td>
      <td>
        <Line width="15%" />
      </td>
    </tr>
  );
};

const mapStateToProps = (state) => ({
  token: getToken(state),
});

export default connect(mapStateToProps)(HoodTableRow);
export { HoodTableRowSkeleton };
