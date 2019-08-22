// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getCurrUser, getToken } from "../../../selectors/auth";
import { doUpdateUser } from "../../../actions/auth";

// API Imports
import {
  getSurveyAgreements,
  postSurveyAgreement,
  patchSurveyAgreement,
  getSurvey,
  flagSurvey,
  deleteSurvey,
} from "../../../api/factrak";
import { getUser } from "../../../api/users";
import { actions } from "redux-router5";
import { checkAndHandleError } from "../../../lib/general";
import { Link } from "react-router5";

// @TODO: investigate survey deficit
const FactrakComment = ({
  comment,
  showProf,
  abridged,
  currUser,
  token,
  navigateTo,
  updateUser,
}) => {
  const [agreement, updateAgreements] = useState(null);
  const [survey, updateSurvey] = useState(comment);
  const [isDeleted, updatedDeleted] = useState(false);

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const loadAgreements = async () => {
      const agreementResponse = await getSurveyAgreements(token, survey.id);
      if (checkAndHandleError(agreementResponse)) {
        updateAgreements(agreementResponse.data.data);
      }
    };

    if (!abridged) loadAgreements();
  }, [token, abridged, survey]);

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
      updatedDeleted(true);
      const userResponse = await getUser("me", token);
      if (checkAndHandleError(userResponse)) {
        updateUser(userResponse.data.data);
      }
    }
  };

  const agreeHandler = async (agree) => {
    const agreeParams = { agree };
    let response;
    if (agreement) {
      response = await patchSurveyAgreement(token, survey.id, agreeParams);
    } else {
      response = await postSurveyAgreement(token, survey.id, agreeParams);
    }

    if (checkAndHandleError(response)) {
      updateAgreements(response.data.data);
      getAndUpdateSurvey();
    }
  };

  const agreeCount = () => {
    if (abridged) return null;
    return (
      <h1>
        <span id={`${survey.id}agree-count`}>
          {survey.totalAgree ? survey.totalAgree : 0}
        </span>
        {` agree, `}
        <span id={`${survey.id}disagree-count`}>
          {survey.totalDisagree ? survey.totalDisagree : 0}
        </span>
        {` disagree`}
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

  const timeAgoInWords = (time) => {
    const postedTime = new Date(time);

    // If < 30 days, return time in days.
    if (Date.now() - postedTime < 2592000000)
      return `${Math.floor((Date.now() - postedTime) / 86400000)} days ago.`;

    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(time).toLocaleDateString("en-US", options);
  };

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
      <p className="comment-detail">{`posted ${timeAgoInWords(
        survey.createdTime
      )}`}</p>
    );
  };

  const flagHandler = () => {
    const response = flagSurvey(token, survey.id);

    if (checkAndHandleError(response)) {
      getAndUpdateSurvey();
    }
  };

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

  const agree = () => {
    if (survey.userID === currUser.id) return null;
    return (
      <>
        <button
          type="button"
          className="inline-button"
          onClick={() => agreeHandler(true)}
        >
          Agree
        </button>
        &ensp;
        <button
          type="button"
          className="inline-button"
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
              {" Flag for moderator attention"}
            </button>
          </span>
        ) : null}
      </>
    );
  };

  const surveyText = () => {
    let truncatedsurvey = survey.comment;
    if (survey.comment.length > 145)
      truncatedsurvey = survey.comment.substring(0, 145);
    if (abridged) {
      return (
        <div className="survey-text">
          {truncatedsurvey}
          {survey.comment.length > 145 ? (
            <div>
              <a href={`/factrak/professors/${survey.professorID}`}>
                ...See More
              </a>
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

  if (isDeleted) return null;

  return (
    <div id={`comment${survey.id}`} className="comment">
      <div className="comment-content">
        <h1>
          {showProf ? (
            <Link
              routeName="factrak.professors"
              routeParams={{ profID: survey.professorID }}
            >
              {`${survey.professor.name} `}
            </Link>
          ) : null}
          {showProf && survey.course ? ` | ` : ""}
          <Link
            routeName="factrak.courses"
            routeParams={{ courseID: survey.courseID }}
          >
            {survey.course
              ? `${survey.course.areaOfStudy.abbreviation} ${survey.course.number}`
              : ""}
          </Link>
        </h1>

        {agreeCount()}
        {currUser.factrakSurveyDeficit === 0 ||
        survey.userID === currUser.id ? (
          surveyText()
        ) : (
          <div className="blurred">Please do your Factrak surveys.</div>
        )}

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
