// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Paragraph, Line } from "../../common/Skeleton";
import Button from "../../common/Button";

// Redux/ Router imports
import { connect } from "react-redux";
import { getWSO, getCurrUser } from "../../../selectors/auth";
import { doUpdateUser } from "../../../actions/auth";
import { actions } from "redux-router5";

// Additional Imports
import { Link } from "react-router5";
import { format } from "timeago.js";
// import styles from "./FactrakComment.module.scss";

// Elastic Imports
import { EuiFlexGroup, EuiFlexItem } from "@elastic/eui";

const FactrakComment = ({
  abridged,
  wso,
  comment,
  currUser,
  navigateTo,
  showProf,
  updateUser,
}) => {
  const [survey, updateSurvey] = useState(comment);
  const [isDeleted, updateDeleted] = useState(false);

  // Get the survey and update it after editing.
  const getAndUpdateSurvey = async () => {
    try {
      const surveyResponse = await wso.factrakService.getSurvey(survey.id);
      updateSurvey(surveyResponse.data);
    } catch {
      navigateTo("500");
    }
  };

  const deleteHandler = async () => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      await wso.factrakService.deleteSurvey(survey.id);
      updateDeleted(true);
      const userResponse = await wso.userService.getUser();
      updateUser(userResponse.data);
    } catch {
      navigateTo("500");
    }
  };

  // Handles survey agreement
  const agreeHandler = async (agree) => {
    const agreeParams = { agree };

    try {
      if (survey && survey.clientAgreement !== undefined) {
        if (survey.clientAgreement === agree) {
          await wso.factrakService.deleteSurveyAgreement(survey.id);
        } else {
          await wso.factrakService.updateSurveyAgreement(
            survey.id,
            agreeParams
          );
        }
      } else {
        await wso.factrakService.createSurveyAgreement(survey.id, agreeParams);
      }

      getAndUpdateSurvey();
    } catch {
      navigateTo("500");
    }
  };

  // Generates the agree count
  const agreeCount = () => {
    if (abridged) return null;

    return (
      <h1>
        <span>{survey.totalAgree ? survey.totalAgree : 0}</span>
        &nbsp;agree&emsp;
        <span>{survey.totalDisagree ? survey.totalDisagree : 0}</span>
        &nbsp;disagree
        <span className="factrak-flag" title="Flagged for moderator attention">
          {survey.flagged && <>&#10071;</>}
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
          <EuiFlexGroup>
            <EuiFlexItem>
              <Button
                onClick={() =>
                  navigateTo("factrak.editSurvey", {
                    surveyID: survey.id,
                  })
                }
                className="inlineButton"
              >
                Edit
              </Button>
            </EuiFlexItem>

            <EuiFlexItem>
              <Button onClick={deleteHandler} className="inlineButton">
                Delete
              </Button>
            </EuiFlexItem>
          </EuiFlexGroup>
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
    try {
      await wso.factrakService.flagSurvey(survey.id);

      getAndUpdateSurvey();
    } catch {
      navigateTo("500");
    }
  };

  // Generates the would take another sentence.
  const wouldTakeAnother = () => {
    if (survey.wouldTakeAnother === null) return null;

    // True versus false check.
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
    if (survey.lorem || survey.userID === currUser.id) return null;

    return (
      <>
        <Button
          className={
            survey.clientAgreement !== undefined && survey.clientAgreement
              ? "inlineButtonInverted"
              : "inlineButton"
          }
          onClick={() => agreeHandler(true)}
        >
          Agree
        </Button>
        &ensp;
        <Button
          className={
            survey.clientAgreement !== undefined && !survey.clientAgreement
              ? "inlineButtonInverted"
              : "inlineButton"
          }
          onClick={() => agreeHandler(false)}
        >
          Disagree
        </Button>
        {!abridged && !survey.flagged && (
          <span>
            <Button className="inlineButton" onClick={flagHandler}>
              Flag for moderator attention
            </Button>
          </span>
        )}
      </>
    );
  };

  // Generate the survey text.
  const surveyText = () => {
    if (abridged) {
      if (survey.comment.length > 145) {
        return (
          <div className="survey-text">
            {`${survey.comment.substring(0, 145)}...`}
            <div>
              <Link
                routeName="factrak.professors"
                routeParams={{ profID: survey.professorID }}
              >
                See More
              </Link>
            </div>
          </div>
        );
      }

      return <div className="survey-text">{survey.comment}</div>;
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

  if (survey.lorem)
    return (
      <div className="comment">
        <div className="comment-content blurred">
          <h1>
            {showProf && (
              <Link routeName="factrak" style={{ color: "transparent" }}>
                Ephraiem Williams
              </Link>
            )}
          </h1>

          <h1>
            <span style={{ color: "transparent" }}>0</span>
            &nbsp;agree&emsp;
            <span style={{ color: "transparent" }}>0</span>
            &nbsp;disagree
          </h1>

          {surveyText()}
          <p className="comment-detail">
            posted about <span className="blurred">1793</span>
          </p>
        </div>
      </div>
    );

  return (
    <div className="comment">
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
  abridged: PropTypes.bool.isRequired,
  wso: PropTypes.object.isRequired,
  comment: PropTypes.object,
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  showProf: PropTypes.bool.isRequired,
  updateUser: PropTypes.func.isRequired,
};

FactrakComment.defaultProps = {
  comment: {
    id: 1,
    comment:
      "Hi! Good job on using the web inspector to attempt to find out what the survey is. Consider joining WSO!",
    lorem: true,
    professorID: 1,
    wouldRecommendCourse: true,
    wouldTakeAnother: false,
    userID: -1,
    Button,
  },
};

const FactrakCommentSkeleton = () => (
  <div className="comment">
    <Line width="30%" />
    <Paragraph numRows={3} />
    <Line width="25%" />
    <br />
    <Line width="30%" />
  </div>
);

const mapStateToProps = (state) => ({
  wso: getWSO(state),
  currUser: getCurrUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
  updateUser: (updatedUser) => dispatch(doUpdateUser(updatedUser)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FactrakComment);
export { FactrakCommentSkeleton };
