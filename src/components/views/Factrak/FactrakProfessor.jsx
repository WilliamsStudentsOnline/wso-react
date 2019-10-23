// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FactrakComment from "./FactrakComment";

// Redux/ Routing imports
import { connect } from "react-redux";
import { getToken, getCurrUser } from "../../../selectors/auth";
import { createRouteNodeSelector } from "redux-router5";

// Additional imports
import {
  getProfessor,
  getDepartment,
  getSurveys,
  getProfessorRatings,
} from "../../../api/factrak";
import {
  checkAndHandleError,
  containsScopes,
  scopes,
} from "../../../lib/general";
import { Link } from "react-router5";

const FactrakProfessor = ({ token, route, currUser }) => {
  const [professor, updateProfessor] = useState(null);
  const [department, updateDepartment] = useState(null);
  const [ratings, updateRatings] = useState(null);
  const [surveys, updateSurveys] = useState([]);

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const professorParam = route.params.profID;

    const loadProfs = async (professorID) => {
      const professorResponse = await getProfessor(token, professorID);
      if (checkAndHandleError(professorResponse)) {
        const professorData = professorResponse.data.data;
        updateProfessor(professorData);
        const departmentResponse = await getDepartment(
          token,
          professorData.departmentID
        );
        if (checkAndHandleError(departmentResponse)) {
          updateDepartment(departmentResponse.data.data);
        }
      }
    };

    const loadRatings = async (professorID) => {
      const ratingsResponse = await getProfessorRatings(token, professorID);
      if (checkAndHandleError(ratingsResponse)) {
        updateRatings(ratingsResponse.data.data);
      }
    };

    const loadSurveys = async (professorID) => {
      const params = {
        professorID,
        preload: ["course"],
        populateAgreements: true,
        populateClientAgreement: true,
      };
      const surveysResponse = await getSurveys(token, params);
      if (checkAndHandleError(surveysResponse)) {
        updateSurveys(surveysResponse.data.data);
      }
    };

    loadProfs(professorParam);
    loadRatings(professorParam);
    loadSurveys(professorParam);
    if (
      containsScopes(token, scopes.ScopeFactrakAdmin) ||
      containsScopes(token, scopes.ScopeFactrakFull)
    ) {
      loadSurveys(professorParam);
    } else {
      updateSurveys([
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
      ]);
    }
  }, [route.params.professor, token, route.params.profID]);

  // Generates the crowdsourced opinion on the professor's courses' workload
  const courseWorkload = () => {
    if (!ratings.numCourseWorkload) return null;

    const WORKLOAD_DESCRIPTIONS = [
      "",
      "very easy",
      "easy",
      "somewhat easy",
      "normal",
      "somewhat hard",
      "hard",
      "very hard",
    ];
    return (
      <li>
        The course workloads are&nbsp;
        <u>{WORKLOAD_DESCRIPTIONS[Math.round(ratings.avgCourseWorkload)]}</u>
        &nbsp;when compared to other courses ({ratings.numCourseWorkload}
        &nbsp;surveys).
      </li>
    );
  };

  // Generates the crowdsourced opinion on how stimulating the professor's courses are.
  const courseStimulating = () => {
    if (!ratings.numCourseStimulating) return null;
    const STIMULATING_DESCR = [
      "",
      "very boring",
      "boring",
      "somewhat boring",
      "normal",
      "somewhat stimulating",
      "stimulating",
      "very stimulating",
    ];

    return (
      <li>
        The courses taught are&nbsp;
        <u>{STIMULATING_DESCR[Math.round(ratings.avgCourseStimulating)]}</u>
        &nbsp;when compared to other courses ({ratings.numCourseStimulating}
        &nbsp;surveys).
      </li>
    );
  };

  // Generates the crowdsourced opinion on how approachable the professor is.
  const profApproachability = () => {
    if (!ratings.avgApproachability) return null;
    const APPROACH_DESCR = [
      "",
      "very unapproachable",
      "unapproachable",
      "somewhat unapproachable",
      "somewhat approachable",
      "moderately approachable",
      "approchable",
      "very approchable",
    ];

    return (
      <li>
        The professor is&nbsp;
        <u>{APPROACH_DESCR[Math.round(ratings.avgApproachability)]}</u>
        &nbsp;(
        {ratings.numApproachability}
        &nbsp;surveys).
      </li>
    );
  };

  // Generates the crowdsourced opinion on how good the professor is at lecturing.
  const profLecture = () => {
    if (!ratings.numLeadLecture) return null;
    const LECTURE_DESCR = [
      "",
      "very ineffective",
      "ineffective",
      "somewhat ineffective",
      "somewhat effective",
      "moderately effective",
      "effective",
      "very effective",
    ];
    return (
      <li>
        The professor is&nbsp;
        <u>{LECTURE_DESCR[Math.round(ratings.avgLeadLecture)]}</u>
        &nbsp;at lecturing ({ratings.numLeadLecture}
        &nbsp;surveys).
      </li>
    );
  };

  // Generates the crowdsourced opinion on how helpful the professor is.
  const profHelpful = () => {
    if (!ratings.numOutsideHelpfulness) return null;
    const HELP_DESCR = [
      "",
      "very unhelpful",
      "unhelpful",
      "somewhat unhelpful",
      "somewhat helpful",
      "moderately helpful",
      "helpful",
      "very helpful",
    ];
    return (
      <li>
        The professor is&nbsp;
        <u>{HELP_DESCR[Math.round(ratings.avgOutsideHelpfulness)]}</u>
        &nbsp;outside of class ({ratings.numOutsideHelpfulness}
        &nbsp;surveys).
      </li>
    );
  };

  // Generates the survey statistics for the professor.
  const surveyStats = () => {
    if (!ratings) return null;

    return (
      <div>
        <h4>Survey Statistics</h4>
        <ul>
          {ratings.numWouldTakeAnother ? (
            <li>
              <u>{`${Math.round(ratings.avgWouldTakeAnother * 100)}%`}</u>
              {` out of ${ratings.numWouldTakeAnother} would take another course with this professor.`}
            </li>
          ) : null}
          {ratings.numWouldRecommendCourse ? (
            <li>
              <u>{`${Math.round(ratings.avgWouldRecommendCourse * 100)}%`}</u>
              {` out of ${ratings.numWouldRecommendCourse} recommend this professor's courses to a friend.`}
            </li>
          ) : null}
          {courseWorkload()}
          {courseStimulating()}
          {profApproachability()}
          {profLecture()}
          {profHelpful()}
        </ul>
      </div>
    );
  };
  // Generates the factrak survey deficit message if necessary
  const factrakSurveyDeficitMessage = () => {
    if (currUser.factrakSurveyDeficit > 0) {
      return (
        <>
          <strong>
            {`Write just ${currUser.factrakSurveyDeficit} reviews to
            make the blur go away!`}
          </strong>
          <br />
          To write a review, just search a prof&apos;s name directly above, or
          click a department on the left to see a list of profs in that
          department. Then click the link on the prof&apos;s page to write a
          review!
          <br />
          <br />
        </>
      );
    }

    return null;
  };

  if (!professor) return null;

  return (
    <article className="facebook-profile" id="fbprof">
      <section className="info">
        <h3>{professor.name}</h3>

        <h5>
          {department ? department.name : ""}
          <br />
          {professor && professor.title ? <span>{professor.title}</span> : null}
        </h5>
        <br />

        <br />
        <Link
          routeName="factrak.newSurvey"
          routeParams={{ profID: professor.id }}
        >
          Click here to review this professor
        </Link>
        <br />
        <br />
        {surveyStats()}
        <br />
        <br />

        <h3>Comments</h3>
        <br />
        {factrakSurveyDeficitMessage()}
        <div id="factrak-comments-section">
          {surveys && surveys.length > 0
            ? surveys.map((survey) => {
                if (
                  containsScopes(token, scopes.ScopeFactrakAdmin) ||
                  containsScopes(token, scopes.ScopeFactrakFull)
                ) {
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

FactrakProfessor.propTypes = {
  token: PropTypes.string.isRequired,
  route: PropTypes.object.isRequired,
  currUser: PropTypes.object.isRequired,
};

FactrakProfessor.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("factrak.professors");

  return (state) => ({
    token: getToken(state),
    currUser: getCurrUser(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(FactrakProfessor);
