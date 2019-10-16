// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

// Additional imports
import { Link } from "react-router5";
import { getDormtrakDormFacts } from "../../../api/dormtrak";
import { checkAndHandleError } from "../../../lib/general";

const HoodTableRow = ({ dorm, token }) => {
  const [dormInfo, updateDormInfo] = useState(null);

  useEffect(() => {
    const loadDormInfo = async () => {
      const dormResponse = await getDormtrakDormFacts(token, dorm.id);
      if (checkAndHandleError(dormResponse)) {
        updateDormInfo(dormResponse.data.data);
      }
    };

    loadDormInfo();
  }, [token, dorm]);

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
      {dormInfo ? (
        <>
          <td>{dormInfo.seniorCount}</td>
          <td>{dormInfo.juniorCount}</td>
          <td>{dormInfo.sophomoreCount}</td>
        </>
      ) : (
        <>
          <td>N/A</td>
          <td>N/A</td>
          <td>N/A</td>
        </>
      )}
    </tr>
  );
};

HoodTableRow.propTypes = {
  dorm: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  token: getToken(state),
});

export default connect(mapStateToProps)(HoodTableRow);
