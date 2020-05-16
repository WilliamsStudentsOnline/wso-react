// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Line } from "../../Skeleton";

// Redux imports
import { connect } from "react-redux";
import { getAPIToken } from "../../../selectors/auth";

// Additional imports
import { Link } from "react-router5";

const HoodTableRow = ({ dorm, wso }) => {
  const [dormInfo, updateDormInfo] = useState(null);

  useEffect(() => {
    const loadDormInfo = async () => {
      try {
        const dormResponse = await wso.dormtrakService.getFacts(dorm.id);
        updateDormInfo(dormResponse.data);
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    loadDormInfo();
  }, [wso, dorm]);

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
  dorm: PropTypes.object.isRequired,
  wso: PropTypes.object.isRequired,
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
  token: getAPIToken(state),
});

export default connect(mapStateToProps)(HoodTableRow);
export { HoodTableRowSkeleton };
