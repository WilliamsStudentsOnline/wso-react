// React imports
import React, { useState, useEffect } from "react";
import HoodTableRow, { HoodTableRowSkeleton } from "./HoodTableRow";

// Redux/ Routing imports
import { useAppSelector } from "../../../lib/store";
import { getWSO } from "../../../lib/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import { ModelsNeighborhood } from "wso-api-client/lib/services/types";

const DormtrakNeighborhood = () => {
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();
  const params = useParams();

  const [neighborhood, updateHoodInfo] = useState<
    ModelsNeighborhood | undefined
  >(undefined);

  useEffect(() => {
    const loadNeighborhood = async () => {
      if (params.neighborhoodID) {
        try {
          const neighborhoodID = parseInt(params.neighborhoodID, 10);
          const hoodResponse = await wso.dormtrakService.getNeighborhood(
            neighborhoodID
          );
          updateHoodInfo(hoodResponse.data);
        } catch (error) {
          navigateTo("/error", { replace: true, state: error });
        }
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
              ? neighborhood.dorms?.map((dorm) => (
                  <HoodTableRow dorm={dorm} key={dorm.id} />
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

export default DormtrakNeighborhood;
