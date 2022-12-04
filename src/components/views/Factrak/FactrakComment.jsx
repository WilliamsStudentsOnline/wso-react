// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Paragraph, Line } from "../../Skeleton";
import Button from "../../Components";

// Redux/ Router imports
import { useAppSelector, useAppDispatch } from "../../../lib/store";
import { getWSO, getCurrUser, updateUser } from "../../../lib/authSlice";

// Additional Imports
import { Link, useNavigate } from "react-router-dom";
import { format } from "timeago.js";

const FactrakComment = ({ abridged, comment, showProf }) => {
  const dispatch = useAppDispatch();
  const currUser = useAppSelector(getCurrUser);
  const wso = useAppSelector(getWSO);
  const navigateTo = useNavigate();

  const [survey, updateSurvey] = useState(comment);
  const [isDeleted, updateDeleted] = useState(false);

  // Get the survey and update it after editing.
  const getAndUpdateSurvey = async () => {
    try {
      const surveyResponse = await wso.factrakService.getSurvey(survey.id);
      updateSurvey(surveyResponse.data);
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
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
      dispatch(updateUser(userResponse.data));
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
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
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
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
          <Button
            onClick={() => navigateTo(`/factrak/surveys/edit/${survey.id}`)}
            className="inline-button"
          >
            Edit
          </Button>

          <Button onClick={deleteHandler} className="inline-button">
            Delete
          </Button>
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
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
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
              ? "inline-button-inverted"
              : "inline-button"
          }
          onClick={() => agreeHandler(true)}
        >
          Agree
        </Button>
        &ensp;
        <Button
          className={
            survey.clientAgreement !== undefined && !survey.clientAgreement
              ? "inline-button-inverted"
              : "inline-button"
          }
          onClick={() => agreeHandler(false)}
        >
          Disagree
        </Button>
        {!abridged && !survey.flagged && (
          <span>
            <Button className="inline-button" onClick={flagHandler}>
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
              <Link to={`/factrak/professors/${survey.professorID}`}>
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
        <Link to={`/factrak/professors/${survey.professorID}`}>
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
        <Link to={`/factrak/courses/${survey.courseID}`}>
          {survey.course
            ? `${survey.course.areaOfStudy.abbreviation} ${survey.course.number}`
            : ""}
        </Link>
      </>
    );
  };

  // Generate semester info
  const semesterInfo = () => {
    if (survey.semesterSeason) {
      let season;
      switch (survey.semesterSeason) {
        case "spring":
          season = "Spring";
          break;
        case "winter-study":
          season = "Winter Study";
          break;
        case "fall":
          season = "Fall";
          break;
        default:
          season = "Unknown";
      }

      return (
        <>
          {" "}
          &mdash; {season} {survey.semesterYear}
        </>
      );
    }
    return null;
  };

  // Generate course format
  const courseFormat = () => {
    if (survey.courseFormat) {
      let cFormat;
      switch (survey.courseFormat) {
        case "in-person":
          cFormat = "In Person";
          break;
        case "hybrid":
          cFormat = "Hybrid";
          break;
        case "remote":
          cFormat = "Remote";
          break;
        default:
          cFormat = "Unknown";
      }

      return <> ({cFormat})</>;
    }
    return null;
  };

  if (isDeleted) return null;

  if (survey.lorem)
    return (
      <div className="comment">
        <div className="comment-content blurred">
          <h1>
            {showProf && (
              <Link to="/factrak" style={{ color: "transparent" }}>
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
          {semesterInfo()}
          {courseFormat()}
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
  comment: PropTypes.object,
  showProf: PropTypes.bool.isRequired,
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

export default FactrakComment;
export { FactrakCommentSkeleton };
