// React imports
import React, { useState, useEffect } from "react";
import { List } from "../../Skeleton";

// Redux imports
import { useAppSelector } from "../../../lib/store";
import { getWSO, getAPIToken } from "../../../lib/authSlice";
import { Link, useNavigate } from "react-router-dom";

// Additional imports
import { containsOneOfScopes, scopes } from "../../../lib/general";
import FactrakCourseRankingsTable from "./FactrakCourseRankingsTable";
import { ModelsAreaOfStudy } from "wso-api-client/lib/services/types";

const FactrakCourseRankings = () => {
  const token = useAppSelector(getAPIToken);
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  const [areas, updateAreas] = useState<ModelsAreaOfStudy[]>([]);

  useEffect(() => {
    // Loads in the departments
    const loadAreas = async () => {
      try {
        const areasOfStudyResponse =
          await wso.factrakService.listAreasOfStudy();
        const areasOfStudy = areasOfStudyResponse.data;
        updateAreas(
          areasOfStudy
            ? areasOfStudy.sort((a, b) =>
                a.name && b.name ? a.name.localeCompare(b.name) : 1
              )
            : []
        );
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    };

    if (containsOneOfScopes(token, [scopes.ScopeFactrakFull])) {
      loadAreas();
    } else {
      updateAreas([...Array(10)].map((_, id) => ({ id })));
    }
  }, [token, wso]);

  return (
    <article className="dormtrak">
      <div className="container">
        <aside className="sidebar">
          <article className="home">
            <h3>Departments</h3>
            <ul id="dept_list">
              {areas ? (
                areas.map((area) => (
                  <li key={area.name}>
                    <Link
                      to={`/factrak/course-rankings/${area.id}`}
                      title={`${area.name} Course Rankings`}
                    >
                      {area.name}
                    </Link>
                  </li>
                ))
              ) : (
                <List height="80%" center numRows={46} />
              )}
            </ul>
          </article>
        </aside>

        <FactrakCourseRankingsTable />
      </div>
    </article>
  );
};

export default FactrakCourseRankings;
