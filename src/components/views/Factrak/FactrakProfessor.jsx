// React imports
import React from "react";
import PropTypes from "prop-types";
import FactrakComment from "./FactrakComment";
import FactrakLayout from "./FactrakLayout";

const FactrakProfessor = ({
  prof,
  ratings,
  comments,
  currentUser,
  authToken,
  notice,
  warning,
}) => {
  const courseWorkload = () => {
    if (!ratings.course_workload) return null;

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
        <u>{WORKLOAD_DESCRIPTIONS[Math.round(ratings.course_workload)]}</u>
        &nbsp;when compared to other courses ({ratings.num_course_workload}
        &nbsp;surveys).
      </li>
    );
  };

  const courseStimulating = () => {
    if (!ratings.course_stimulating) return null;
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
        <u>{STIMULATING_DESCR[Math.round(ratings.course_stimulating)]}</u>
        &nbsp;when compared to other courses ({ratings.num_course_stimulating}
        &nbsp;surveys).
      </li>
    );
  };

  const profApproachability = () => {
    if (!ratings.approachability) return null;
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
        <u>{APPROACH_DESCR[Math.round(ratings.approachability)]}</u>
        &nbsp;(
        {ratings.num_approachability}
        &nbsp;surveys).
      </li>
    );
  };
  const profLecture = () => {
    if (!ratings.lead_lecture) return null;
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
        <u>{LECTURE_DESCR[Math.round(ratings.lead_lecture)]}</u>
        &nbsp;at lecturing ({ratings.num_lead_lecture}
        &nbsp;surveys).
      </li>
    );
  };

  const profHelpful = () => {
    if (!ratings.outside_helpfulness) return null;
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
        <u>{HELP_DESCR[Math.round(ratings.outside_helpfulness)]}</u>
        &nbsp;outside of class ({ratings.num_outside_helpfulness}
        &nbsp;surveys).
      </li>
    );
  };

  const surveyStats = () => {
    return (
      <div>
        <h4>Survey Statistics</h4>
        <ul>
          {ratings.would_take_another ? (
            <li>
              <u>{`${Math.round(ratings.would_take_another * 100)}%`}</u>
              {` out of ${ratings.num_would_take_another} would take another course with this professor.`}
            </li>
          ) : null}
          {ratings.would_recommend_course ? (
            <li>
              <u>{`${Math.round(ratings.would_recommend_course * 100)}%`}</u>
              {` out of ${ratings.num_would_recommend_course} recommend this professor's courses to a friend.`}
            </li>
          ) : null}
          {ratings.would_recommend_course ? (
            <li>
              <u>{`${Math.round(ratings.would_recommend_course * 100)}%`}</u>
              {` out of ${ratings.num_would_recommend_course} recommend this professor's courses to a friend.`}
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

  return (
    <FactrakLayout
      currentUser={currentUser}
      authToken={authToken}
      notice={notice}
      warning={warning}
    >
      <article className="facebook-profile" id="fbprof">
        <section className="info">
          <h3>{prof.name}</h3>

          <h5>
            {prof.department.name}
            <br />
            {prof.title ? <span>{prof.title}</span> : null}
          </h5>
          <br />

          <br />
          <a href={`/factrak/surveys/new?professor_id=${prof.id}`}>
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
            {prof.factrak_surveys && prof.factrak_surveys.length > 0
              ? comments.map((comment) => (
                  <FactrakComment
                    comment={comment}
                    showProf={false}
                    abridged={false}
                    currentUser={currentUser}
                    key={comment.comment}
                  />
                ))
              : "No comments yet."}
          </div>
        </section>
      </article>
    </FactrakLayout>
  );
};

FactrakProfessor.propTypes = {
  prof: PropTypes.object.isRequired,
  ratings: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  authToken: PropTypes.string.isRequired,
  notice: PropTypes.string,
  warning: PropTypes.string,
};

FactrakProfessor.defaultProps = {
  notice: "",
  warning: "",
  currentUser: {},
};

export default FactrakProfessor;
