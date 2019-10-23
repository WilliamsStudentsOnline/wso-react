// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// Redux/ Router imports
import { connect } from "react-redux";
import { getCurrUser, getToken } from "../../../selectors/auth";
import { doUpdateUser } from "../../../actions/auth";
import { actions } from "redux-router5";

// Additional Imports
import {
  postSurveyAgreement,
  patchSurveyAgreement,
  deleteSurveyAgreement,
  getSurvey,
  flagSurvey,
  deleteSurvey,
} from "../../../api/factrak";
import { getUser } from "../../../api/users";
import { checkAndHandleError } from "../../../lib/general";
import { Link } from "react-router5";
import { format } from "timeago.js";

const FactrakComment = ({
  comment,
  showProf,
  abridged,
  currUser,
  token,
  navigateTo,
  updateUser,
}) => {
  const [survey, updateSurvey] = useState(comment);
  const [isDeleted, updateDeleted] = useState(false);

  // Get the survey and update it after editing.
  const getAndUpdateSurvey = async () => {
    const surveyResponse = await getSurvey(token, survey.id);
    if (checkAndHandleError(surveyResponse)) {
      updateSurvey(surveyResponse.data.data);
    }
  };

  const deleteHandler = async () => {
    // eslint-disable-next-line no-restricted-globals
    const confirmDelete = confirm("Are you sure?"); // eslint-disable-line no-alert
    if (!confirmDelete) return;

    const response = await deleteSurvey(token, survey.id);

    if (checkAndHandleError(response)) {
      updateDeleted(true);
      const userResponse = await getUser("me", token);
      if (checkAndHandleError(userResponse)) {
        updateUser(userResponse.data.data);
      }
    }
  };

  // Handles survey agreement
  const agreeHandler = async (agree) => {
    const agreeParams = { agree };
    let response;
    if (survey && survey.clientAgreement !== undefined) {
      if (survey.clientAgreement === agree) {
        response = await deleteSurveyAgreement(token, survey.id, agreeParams);
      } else {
        response = await patchSurveyAgreement(token, survey.id, agreeParams);
      }
    } else {
      response = await postSurveyAgreement(token, survey.id, agreeParams);
    }

    if (checkAndHandleError(response)) {
      getAndUpdateSurvey();
    }
  };

  // Generates the agree count
  const agreeCount = () => {
    if (abridged) return null;
    return (
      <h1>
        <span id={`${survey.id}agree-count`}>
          {survey.totalAgree ? survey.totalAgree : 0}
        </span>
        ` agree, `
        <span id={`${survey.id}disagree-count`}>
          {survey.totalDisagree ? survey.totalDisagree : 0}
        </span>
        ` disagree`
        <span
          id={`${survey.id}flagged`}
          className="factrak-flag"
          title="Flagged for moderator attention"
        >
          {survey.flagged ? <>&#10071;</> : null}
        </span>
      </h1>
    );
  };

  // Generates all the survey details
  const surveyDetail = () => {
    // If the current user was the one who made the survey
    if (currUser.id === survey.userID) {
      return (
        <p className="survey-detail">
          <button
            type="button"
            onClick={() =>
              navigateTo("factrak.editSurvey", {
                surveyID: survey.id,
              })
            }
            className="inline-button"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={deleteHandler}
            className="inline-button"
          >
            Delete
          </button>
        </p>
      );
    }

    return (
      <p className="comment-detail">{`posted about ${format(
        new Date(survey.createdTime)
      )}`}</p>
    );
  };

  // Handling flagging
  const flagHandler = async () => {
    const response = await flagSurvey(token, survey.id);
    if (checkAndHandleError(response)) {
      getAndUpdateSurvey();
    }
  };

  // Generates the would take another sentence.
  const wouldTakeAnother = () => {
    if (survey.wouldTakeAnother === null) return null;
    if (survey.wouldTakeAnother)
      return (
        <>
          <br />I would take another course with this professor
        </>
      );
    return (
      <>
        <br />I would
        <b>&nbsp;not&nbsp;</b>
        take another course with this professor
      </>
    );
  };

  // Generate the would recommend field.
  const wouldRecommend = () => {
    if (survey.wouldRecommendCourse === null) return null;
    if (survey.wouldRecommendCourse)
      return (
        <>
          <br />I would recommend this course to a friend
        </>
      );
    return (
      <>
        <br />I would
        <b>&nbsp;not&nbsp;</b>
        recommend this course to a friend
      </>
    );
  };

  // Generate the agree/disagree buttons.
  const agree = () => {
    if (survey.userID === currUser.id) return null;

    return (
      <>
        <button
          type="button"
          className={
            survey.clientAgreement !== undefined && survey.clientAgreement
              ? "inline-button-inverted"
              : "inline-button"
          }
          onClick={() => agreeHandler(true)}
        >
          Agree
        </button>
        &ensp;
        <button
          type="button"
          className={
            survey.clientAgreement !== undefined && !survey.clientAgreement
              ? "inline-button-inverted"
              : "inline-button"
          }
          onClick={() => agreeHandler(false)}
        >
          Disagree
        </button>
        {!abridged && !survey.flagged ? (
          <span id="flag<%= survey.id %>">
            <button
              type="button"
              className="inline-button"
              onClick={flagHandler}
            >
              Flag for moderator attention
            </button>
          </span>
        ) : null}
      </>
    );
  };

  // Generate the survey text.
  const surveyText = () => {
    if (currUser.factrakSurveyDeficit !== 0 && survey.userID !== currUser.id) {
      return <div className="blurred">Please do your Factrak surveys.</div>;
    }

    let truncatedsurvey = survey.comment;
    if (survey.comment.length > 145)
      truncatedsurvey = survey.comment.substring(0, 145);
    if (abridged) {
      return (
        <div className="survey-text">
          {`${truncatedsurvey}...`}
          {survey.comment.length > 145 ? (
            <div>
              <Link
                routeName="factrak.professors"
                routeParams={{ profID: survey.professorID }}
              >
                See More
              </Link>
            </div>
          ) : null}
        </div>
      );
    }
    return (
      <div className="survey-text">
        {survey.comment}
        <br />
        {wouldTakeAnother()}
        {wouldRecommend()}
        <br />
        {agree()}
      </div>
    );
  };

  // Generate Professor link
  const profName = () => {
    if (showProf) {
      return (
        <Link
          routeName="factrak.professors"
          routeParams={{ profID: survey.professorID }}
        >
          {`${survey.professor.name} `}
        </Link>
      );
    }

    return null;
  };

  // Generate Course Link
  const courseLink = () => {
    return (
      <>
        {showProf && survey.course ? ` | ` : ""}
        <Link
          routeName="factrak.courses"
          routeParams={{ courseID: survey.courseID }}
        >
          {survey.course
            ? `${survey.course.areaOfStudy.abbreviation} ${survey.course.number}`
            : ""}
        </Link>
      </>
    );
  };

  if (isDeleted) return null;

  return (
    <div id={`comment${survey.id}`} className="comment">
      <div className="comment-content">
        <h1>
          {profName()}
          {courseLink()}
        </h1>

        {agreeCount()}
        {surveyText()}
        {surveyDetail()}
      </div>
    </div>
  );
};

FactrakComment.propTypes = {
  showProf: PropTypes.bool.isRequired,
  abridged: PropTypes.bool.isRequired,
  comment: PropTypes.object.isRequired,
  currUser: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  navigateTo: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
};

FactrakComment.defaultProps = {};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
  token: getToken(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
  updateUser: (updatedUser) => dispatch(doUpdateUser(updatedUser)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FactrakComment);
