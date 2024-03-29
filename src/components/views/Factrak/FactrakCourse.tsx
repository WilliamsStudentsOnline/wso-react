// React imports
import React, { useState, useEffect } from "react";
import FactrakComment, { FactrakCommentSkeleton } from "./FactrakComment";
import FactrakDeficitMessage from "./FactrakUtils";
import FactrakRatings, { FactrakRatingsSkeleton } from "./FactrakRatings";
import { Line } from "../../Skeleton";

// Redux/ Router imports
import { useAppSelector } from "../../../lib/store";
import { getWSO, getCurrUser, getAPIToken } from "../../../lib/authSlice";
import { Link, useParams, useNavigate } from "react-router-dom";

// Additional imports
import { containsOneOfScopes, scopes } from "../../../lib/general";
import {
  ModelsCourse,
  ModelsFactrakSurvey,
  ModelsFactrakSurveyAvgRatings,
  ModelsUser,
} from "wso-api-client/lib/services/types";

const FactrakCourse = () => {
  // currUser should always be an authenticated user
  const currUser = useAppSelector(getCurrUser);
  const token = useAppSelector(getAPIToken);
  const wso = useAppSelector(getWSO);

  const params = useParams();
  const navigateTo = useNavigate();

  const [course, updateCourse] = useState<ModelsCourse | undefined>(undefined);
  const [courseSurveys, updateSurveys] = useState<ModelsFactrakSurvey[]>([]);
  const [courseProfs, updateProfs] = useState<ModelsUser[]>([]);
  const [ratings, updateRatings] = useState<
    ModelsFactrakSurveyAvgRatings | undefined
  >(undefined);
  const [profClicked, updateProfClicked] = useState("");

  useEffect(() => {
    const courseID = parseInt(params.courseID as string);
    const profID = params.profID ? parseInt(params.profID) : -1;

    const loadCourse = async () => {
      try {
        const courseResponse = await wso.factrakService.getCourse(courseID);
        updateCourse(courseResponse.data);
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    };

    const loadSurveys = async () => {
      // TODO: We should define this differntly so we don't have to do this hack
      const preload = ["professor", "course"] as ("professor" | "course")[];
      const queryParams = {
        preload: preload,
        courseID,
        populateAgreements: true,
        populateClientAgreement: true,
        professorID: profID !== -1 ? profID : undefined,
      };

      try {
        const surveyResponse = await wso.factrakService.listSurveys(
          queryParams
        );
        updateSurveys(surveyResponse.data ?? []);
      } catch (error) {
        // TODO: Add error type from wso-api-client
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((error as any).errorCode === 1330) {
          // Do nothing - This should be expected if the user has not fulfilled the 2 surveys
        } else {
          navigateTo("/error", { replace: true, state: { error } });
        }
      }
    };

    const loadRatings = async () => {
      try {
        const ratingsResponse = await wso.factrakService.getCourseRatings(
          courseID,
          profID !== -1 ? profID : undefined
        );
        updateRatings(ratingsResponse.data);
      } catch (error) {
        // TODO: Add error type from wso-api-client
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((error as any).errorCode === 1330) {
          // Do nothing - This should be expected if the user has not fulfilled the 2 surveys
        } else {
          navigateTo("/error", { replace: true, state: { error } });
        }
      }
    };

    const loadProfs = async () => {
      const queryParams = { courseID };

      try {
        const profResponse = await wso.factrakService.listProfessors(
          queryParams
        );
        updateProfs(profResponse.data ?? []);
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    };

    loadCourse();
    loadRatings();
    if (containsOneOfScopes(token, [scopes.ScopeFactrakFull])) {
      loadSurveys();
    } else {
      updateSurveys([...Array(10)].map((_, id) => ({ id })));
    }

    loadProfs();
  }, [token, params.course, params.profID, params.courseID, wso]);

  // Generates the list of professors who teach the course
  const professorList = () => {
    if (courseProfs.length === 0) return null;
    return (
      <div>
        View comments only for:
        <br />
        {course?.id ? (
          courseProfs.map((prof) => (
            <React.Fragment key={prof.name}>
              <Link
                to={`/factrak/courses/${course.id}/${prof.id}`}
                onClick={() => {
                  updateProfClicked(prof.name ?? "");
                }}
              >
                {profClicked === prof.name ? <b>{prof.name}</b> : prof.name}
              </Link>
              &emsp;
            </React.Fragment>
          ))
        ) : (
          <Line width="50%" />
        )}
      </div>
    );
  };

  // Generates the factrak survey comments of the course
  const commentList = () => {
    if (!courseSurveys) {
      return [...Array(5)].map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i}>
          <FactrakCommentSkeleton />
        </div>
      ));
    }

    return (
      <div className="factrak-prof-comments">
        {courseSurveys.length === 0
          ? "None yet."
          : courseSurveys.map((comment) => {
              if (containsOneOfScopes(token, [scopes.ScopeFactrakFull])) {
                return (
                  <FactrakComment
                    comment={comment}
                    abridged={false}
                    showProf
                    key={comment.id}
                  />
                );
              }

              return (
                <FactrakComment abridged={false} showProf key={comment.id} />
              );
            })}
      </div>
    );
  };

  const selectedProf = () => {
    if (!params.profID || params.profID === "-1") return null;

    const prof = courseProfs.find(
      (courseProf) => courseProf.id === params.profID
    );
    const general = prof ? true : false;

    return (
      <>
        <br />
        {containsOneOfScopes(token, [scopes.ScopeFactrakFull]) &&
          (prof ? (
            <h4>
              <u>Ratings for {prof.name} in this course</u>
            </h4>
          ) : (
            <h4>
              <u>Average Course Ratings</u>
            </h4>
          ))}
        <br />
        {ratings ? (
          <FactrakRatings ratings={ratings} general={general} />
        ) : (
          <FactrakRatingsSkeleton />
        )}
      </>
    );
  };

  const courseTitle = () => {
    if (!course) return <Line width="20%" />;

    return `${course.areaOfStudy ? course.areaOfStudy.abbreviation : ""} ${
      course.number
    }`;
  };

  return (
    <article className="facebook-profile">
      <section className="info">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>{courseTitle()}</h3>
          <input
            type="submit"
            value="Review Class"
            onClick={() => {
              navigateTo(`/factrak/surveys/new/${params.profID}`, {
                replace: true,
                state: {
                  courseName: course?.areaOfStudy?.abbreviation,
                  courseNumber: course?.number,
                },
              });
            }}
            className="submit"
            disabled={!profClicked}
          />
        </div>

        <br />
        {professorList()}
        {selectedProf()}
        <br />
        <FactrakDeficitMessage currUser={currUser} />
        {commentList()}
      </section>
    </article>
  );
};

export default FactrakCourse;
