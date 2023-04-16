// React imports
import React, { useState, useEffect } from "react";
import FactrakComment, { FactrakCommentSkeleton } from "./FactrakComment";
import FactrakRatings, { FactrakRatingsSkeleton } from "./FactrakRatings";
import FactrakDeficitMessage from "./FactrakUtils";
import { Line } from "../../Skeleton";

// Redux/ Routing imports
import { useAppSelector } from "../../../lib/store";
import { getWSO, getCurrUser, getAPIToken } from "../../../lib/authSlice";

import { Link, useNavigate, useParams } from "react-router-dom";

// Additional imports
import { containsOneOfScopes, scopes } from "../../../lib/general";
import {
  ModelsDepartment,
  ModelsFactrakSurvey,
  ModelsFactrakSurveyAvgRatings,
  ModelsUser,
} from "wso-api-client/lib/services/types";

const FactrakProfessor = () => {
  const currUser = useAppSelector(getCurrUser);
  const token = useAppSelector(getAPIToken);
  const wso = useAppSelector(getWSO);

  const params = useParams();
  const navigateTo = useNavigate();

  const [professor, updateProfessor] = useState<ModelsUser | undefined>(
    undefined
  );
  const [department, updateDepartment] = useState<ModelsDepartment | undefined>(
    undefined
  );
  const [ratings, updateRatings] = useState<
    ModelsFactrakSurveyAvgRatings | undefined
  >(undefined);
  const [surveys, updateSurveys] = useState<ModelsFactrakSurvey[]>([]);

  // Equivalent to ComponentDidMount
  useEffect(() => {
    if (!params.profID) {
      return;
    }
    const professorParam = parseInt(params.profID);

    const loadProfs = async (professorID: number) => {
      try {
        const professorResponse = await wso.factrakService.getProfessor(
          professorID
        );
        const professorData = professorResponse.data;

        updateProfessor(professorData);
        if (professorData?.departmentID) {
          const departmentResponse = await wso.factrakService.getDepartment(
            professorData?.departmentID
          );
          updateDepartment(departmentResponse.data);
        } else {
          updateDepartment(undefined);
        }
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    };

    const loadRatings = async (professorID: number) => {
      try {
        const ratingsResponse = await wso.factrakService.getProfessorRatings(
          professorID
        );
        updateRatings(ratingsResponse.data);
      } catch (error) {
        // TODO: add error type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((error as any).errorCode === 1330) {
          // Do nothing - This should be expected if the user has not fulfilled the 2 surveys
        } else {
          navigateTo("/error", { replace: true, state: { error } });
        }
      }
    };

    const loadSurveys = async (professorID: number) => {
      const preload = ["course"] as "course"[];
      const queryParams = {
        professorID,
        preload: preload,
        populateAgreements: true,
        populateClientAgreement: true,
      };
      try {
        const surveysResponse = await wso.factrakService.listSurveys(
          queryParams
        );
        updateSurveys(surveysResponse.data ?? []);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((error as any).errorCode === 1330) {
          // Do nothing - This should be expected if the user has not fulfilled the 2 surveys
        } else {
          navigateTo("/error", { replace: true, state: { error } });
        }
      }
    };

    loadProfs(professorParam);
    loadRatings(professorParam);
    loadSurveys(professorParam);
    if (containsOneOfScopes(token, [scopes.ScopeFactrakFull])) {
      loadSurveys(professorParam);
    } else {
      updateSurveys([...Array(10)].map((_, id) => ({ id })));
    }
  }, [params.professor, params.profID, token, wso]);

  if (!professor)
    return (
      <article className="facebook-profile" id="fbprof">
        <section className="info">
          <h3>
            <Line width="20%" />
          </h3>
          <h5>
            <Line width="20%" />
            <br />
            <Line width="40%" />
          </h5>
          <br />
          <br />
          <Line width="20%" />
          <br />
          <FactrakRatingsSkeleton />
          <br />
          <h3>Comments</h3>
          <br />
          <FactrakDeficitMessage currUser={currUser} />
          <div id="factrak-comments-section">
            {[...Array(10)].map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={i}>
                <FactrakCommentSkeleton />
              </div>
            ))}
          </div>
        </section>
      </article>
    );

  return (
    <article className="facebook-profile" id="fbprof">
      <section className="info">
        <h3>{professor.name}</h3>

        <h5>
          {department?.name}
          <br />
          <span>{professor?.title}</span>
        </h5>
        <br />
        <Link to={`/factrak/surveys/new/${professor.id}`}>
          <button type="button">Click here to review this professor</button>
        </Link>
        <br />
        <br />
        <FactrakRatings ratings={ratings} />
        <br />
        <br />

        <h3>Comments</h3>
        <br />
        <FactrakDeficitMessage currUser={currUser} />
        <div id="factrak-comments-section">
          {surveys && surveys.length > 0
            ? surveys.map((survey) => {
                if (containsOneOfScopes(token, [scopes.ScopeFactrakFull])) {
                  return (
                    <FactrakComment
                      comment={survey}
                      showProf={false}
                      abridged={false}
                      key={survey.id}
                    />
                  );
                }

                return (
                  <FactrakComment
                    abridged={false}
                    showProf={false}
                    key={survey.id}
                  />
                );
              })
            : "No comments yet."}
        </div>
      </section>
    </article>
  );
};

export default FactrakProfessor;
