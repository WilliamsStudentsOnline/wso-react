// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getCurrUser, getToken } from "../../../selectors/auth";

// External Imports
import axios from "axios";
import {
  getSurveyAgreements,
  postSurveyAgreement,
  patchSurveyAgreement,
  getProfessor,
  getSurvey,
} from "../../../api/factrak";

// @TODO: investigate survey deficit
const FactrakComment = ({ comment, showProf, abridged, currUser, token }) => {
  const [flagged, setFlagged] = useState(comment.flagged);
  const [agreement, updateAgreements] = useState({});
  const [survey, updateSurvey] = useState(comment);
  const [professor, updateProfessor] = useState({});

  // Equivalent to ComponentDidMount
  useEffect(() => {
    console.log(survey);
    const loadAgreements = async () => {
      const agreementData = await getSurveyAgreements(token, survey.id);
      if (agreementData) {
        updateAgreements(agreementData);
      } else {
        // @TODO: Error handling?
      }
    };

    const loadProfs = async () => {
      const profData = await getProfessor(token, survey.professorID);
      if (profData) {
        updateProfessor(profData);
      } else {
        // @TODO: Error handling?
      }
    };

    if (!abridged) loadAgreements();
    loadProfs();
  }, [token]);

  const getAndUpdateSurvey = async () => {
    const surveyData = await getSurvey(token, survey.id);
    if (surveyData) {
      updateSurvey(surveyData);
    } else {
      // @TODO: Error handling?
    }
  };

  const agreeHandler = async (agree) => {
    // @TODO: check if agreements
    const agreeParams = { agree };
    let response;
    if (agreement) {
      response = await patchSurveyAgreement(token, survey.id, agreeParams);
    } else {
      response = await postSurveyAgreement(token, survey.id, agreeParams);
    }

    if (response) {
      // @TODO: update counter
      const agreementData = await getSurveyAgreements(token, survey.id);
      if (agreementData) {
        updateAgreements(agreementData);
        getAndUpdateSurvey();
      } else {
        // @TODO: Error handling?
      }
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
        {/* Mark this survey as flagged if it is. The span is always here,
            but it is only filled when it is actually flagged */}
        <span
          id={`${survey.id}flagged`}
          className="factrak-flag"
          title="Flagged for moderator attention"
        >
          {flagged ? <>&#10071;</> : null}
        </span>
      </h1>
    );
  };
  // @TODO: write this algorithm properly
  // const timeAgoInWords = (time) => {
  //   return new Date(time).toDateString();
  // };

  const surveyDetail = () => {
    return (
      <p className="survey-detail">
        {currUser.id === survey.userID ? (
          <>
            <a href={`/factrak/surveys/${survey.id}/edit`}>Edit</a>
            &nbsp;|&nbsp;
            <a
              data-confirm="Are you sure you want to destroy your review?"
              rel="nofollow"
              data-method="delete"
              href={`/factrak/surveys/${survey.id}`}
            >
              Delete
            </a>
          </>
        ) : (
          `posted ${
            survey.createdTime /* @TODO timeAgoInWords(survey.created_at) */
          }.`
        )}
      </p>
    );
  };

  const flagHandler = () => {
    axios({
      url: `/factrak/flag/?id=${survey.id}`,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    }).then((response) => {
      setFlagged(response.data.flagged);
    });
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
        {!abridged && !flagged ? (
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
        {survey.survey}
        <br />
        {wouldTakeAnother()}
        {wouldRecommend()}
        <br />
        {agree()}
      </div>
    );
  };

  return (
    <div id={`comment${survey.id}`} className="comment">
      <div className="comment-content">
        <h1>
          {showProf ? (
            <a href={`/factrak/professors/${survey.professorID}`}>
              {`${professor.name} | `}
            </a>
          ) : null}
          <a href={`/factrak/courses/${survey.courseID}`}>
            {/* @TODO survey.course.name */}
            {`${survey.course.areaOfStudy.abbreviation} ${survey.course.number}`}
          </a>
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
};

FactrakComment.defaultProps = {};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
  token: getToken(state),
});

export default connect(mapStateToProps)(FactrakComment);
