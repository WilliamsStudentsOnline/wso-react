// React imports
import React, { useState, useEffect } from "react";
import FactrakComment, { FactrakCommentSkeleton } from "./FactrakComment";
import { List } from "../../Skeleton";
import FactrakDeficitMessage from "./FactrakUtils";

// Redux imports
import { useAppSelector } from "../../../lib/store";
import { getWSO, getCurrUser, getAPIToken } from "../../../lib/authSlice";

// Additional imports
import { containsOneOfScopes, scopes } from "../../../lib/general";
import { Link, useNavigate } from "react-router-dom";

const FactrakHome = () => {
  const currUser = useAppSelector(getCurrUser);
  const token = useAppSelector(getAPIToken);
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  const [areas, updateAreas] = useState(null);
  const [surveys, updateSurveys] = useState(null);

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const loadSurveys = async () => {
      const queryParams = {
        preload: ["professor", "course"],
        limit: 10,
        start: new Date(),
      };

      try {
        const surveysResponse = await wso.factrakService.listSurveys(
          queryParams
        );
        updateSurveys(surveysResponse.data);
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    };

    const loadAreas = async () => {
      try {
        const areasOfStudyResponse =
          await wso.factrakService.listAreasOfStudy();

        const areasOfStudy = areasOfStudyResponse.data;
        updateAreas(areasOfStudy.sort((a, b) => a.name > b.name));
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    };
    if (containsOneOfScopes(token, [scopes.ScopeFactrakFull])) {
      loadSurveys();
    } else {
      updateSurveys([...Array(10)].map((_, id) => ({ id })));
    }

    loadAreas();
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
                    <Link to={`/factrak/areasOfStudy/${area.id}`}>
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

        <article className="main">
          <section className="lead">
            <h3>Recent Comments</h3>
            <br />
            <FactrakDeficitMessage currUser={currUser} />

            {surveys
              ? surveys.map((survey) => {
                  if (containsOneOfScopes(token, [scopes.ScopeFactrakFull])) {
                    return (
                      <FactrakComment
                        comment={survey}
                        showProf
                        abridged
                        key={survey.id}
                      />
                    );
                  }
                  return <FactrakComment showProf abridged key={survey.id} />;
                })
              : [...Array(10)].map((_, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={i}>
                    <FactrakCommentSkeleton />
                  </div>
                ))}
          </section>
        </article>
      </div>
    </article>
  );
};

export default FactrakHome;
