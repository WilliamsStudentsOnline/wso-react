// React imports
import React, { useState, useEffect } from "react";
import { Line } from "../../Skeleton";

// Redux imports
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";

// Additional imports
import { Link } from "react-router-dom";
import { ModelsDorm, ModelsDormFacts } from "wso-api-client/lib/services/types";

const HoodTableRow = ({ dorm }: { dorm: ModelsDorm }) => {
  const wso = useAppSelector(getWSO);

  const [dormInfo, updateDormInfo] = useState<ModelsDormFacts | undefined>(
    undefined
  );

  useEffect(() => {
    const loadDormInfo = async () => {
      try {
        if (dorm.id) {
          const dormResponse = await wso.dormtrakService.getDormFacts(dorm.id);
          updateDormInfo(dormResponse.data);
        }
      } catch {
        // Let this be handled by the loading state for now
      }
    };

    loadDormInfo();
  }, [dorm, wso]);

  return (
    <tr key={dorm.id}>
      <td>
        <Link to={`/dormtrak/dorms/${dorm.id}`}>{dorm.name}</Link>
      </td>
      <td>{dorm.numberSingles}</td>
      <td>{dorm.numberDoubles}</td>
      <td>{dorm.numberFlex}</td>

      <td>{dormInfo?.seniorCount}</td>
      <td>{dormInfo?.juniorCount}</td>
      <td>{dormInfo?.sophomoreCount}</td>
    </tr>
  );
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

export default HoodTableRow;

export { HoodTableRowSkeleton };
