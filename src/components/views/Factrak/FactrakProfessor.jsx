// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FactrakComment from "./FactrakComment";

// Redux imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

// External imports
import { createRouteNodeSelector } from "redux-router5";
import {
  getProfessor,
  getDepartment,
  getProfessorRatings,
  getProfessorSurveys,
} from "../../../api/factrak";

const FactrakProfessor = ({ token, route }) => {
  const [professor, updateProfessor] = useState(null);
  const [department, updateDepartment] = useState(null);
  const [ratings, updateRatings] = useState(null);
  const [surveys, updateSurveys] = useState([]);

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const professorParam = route.params.professor;

    const loadProfs = async (professorID) => {
      const professorData = await getProfessor(token, professorID);
      if (professorData) {
        console.log(professorData);
        updateProfessor(professorData);
        const departmentData = await getDepartment(
          token,
          professorData.departmentID
        );
        if (departmentData) {
          console.log(departmentData);
          updateDepartment(departmentData);
        }
      } else {
        // @TODO: Error handling?
      }
    };

    const loadRatings = async (professorID) => {
      const ratingsData = await getProfessorRatings(token, professorID);
      if (ratingsData) {
        console.log(ratingsData);
        updateRatings(ratingsData);
      } else {
        // @TODO: Error handling?
      }
    };

    const loadSurveys = async (professorID) => {
      const surveyData = await getProfessorSurveys(token, professorID);
      if (surveyData) {
        console.log(surveyData);
        updateSurveys(surveyData);
      } else {
        // @TODO: Error handling?
      }
    };

    loadProfs(professorParam);
    loadRatings(professorParam);
    loadSurveys(professorParam);
  }, []);

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
        <a href={`/factrak/surveys/new?professor_id=${professor.id}`}>
          Click here to review this professor
        </a>
        <br />
        <br />
        {surveyStats()}

        <br />
        <br />

        <h3>Comments</h3>
        <br />

        <div id="factrak-comments-section">
          {surveys && surveys.length > 0
            ? surveys.map((survey) => (
                <FactrakComment
                  comment={survey}
                  showProf={false}
                  abridged={false}
                  key={survey.comment}
                />
              ))
            : "No comments yet."}
        </div>
      </section>
    </article>
  );
};

FactrakProfessor.propTypes = {
  token: PropTypes.string.isRequired,
  route: PropTypes.object.isRequired,
};

FactrakProfessor.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("factrak.areasOfStudy");

  return (state) => ({
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(FactrakProfessor);
