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
import styles from "./FactrakComment.module.scss";

// Elastic Imports
import { EuiButton, EuiBadge, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";

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
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiBadge
              iconType="faceHappy"
              color="#78dca0"
              className={styles.agreeCount}
            >
              <span>{survey.totalAgree ? survey.totalAgree : 0}</span>
            </EuiBadge>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiBadge
              iconType="faceSad"
              color="#dc3c32"
              className={styles.agreeCount}
            >
              <span>{survey.totalDisagree ? survey.totalDisagree : 0}</span>
            </EuiBadge>
          </EuiFlexItem>
          <EuiFlexItem grow={7} />
        </EuiFlexGroup>
      </h1>
    );
  };

  // Generates all the survey details
  const surveyDetail = () => {
    return (
      <p className={styles.commentDetail}>{`posted about ${format(
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
          <br />I <strong>would</strong> take another course with this professor
        </>
      );
    return (
      <>
        <br />I <strong>would not</strong> take another course with this
        professor
      </>
    );
  };

  // Generate the would recommend field.
  const wouldRecommend = () => {
    if (survey.wouldRecommendCourse === null) return null;
    if (survey.wouldRecommendCourse)
      return (
        <>
          <br />I <strong>would</strong> recommend this course to a friend
        </>
      );
    return (
      <>
        <br />I <strong>would not</strong> recommend this course to a friend
      </>
    );
  };

  // Generate the agree/disagree buttons.
  const agree = () => {
    if (survey.lorem || survey.userID === currUser.id) {
      return (
        <EuiFlexGroup>
          <EuiFlexItem>{agreeCount()}</EuiFlexItem>
          <EuiFlexItem grow={6} />
          <EuiFlexItem>
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiButton
                  onClick={() =>
                    navigateTo("factrak.editSurvey", {
                      surveyID: survey.id,
                    })
                  }
                  size="s"
                  fill
                >
                  Edit
                </EuiButton>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiButton onClick={deleteHandler} size="s" fill>
                  Delete
                </EuiButton>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      );
    }

    return (
      <>
        <EuiFlexGroup>
          <EuiFlexItem grow={8} />
          <EuiFlexItem className={styles.agreeButton}>
            <Button
              className={
                survey.clientAgreement !== undefined && survey.clientAgreement
                  ? "inlineButtonInverted"
                  : "inlineButton"
              }
              onClick={() => agreeHandler(true)}
            >
              <EuiBadge
                iconType="faceHappy"
                color="#78dca0"
                className={styles.agreeCount}
              >
                <span>{survey.totalAgree ? survey.totalAgree : 0}</span>
              </EuiBadge>
            </Button>
          </EuiFlexItem>
          <EuiFlexItem className={styles.agreeButton}>
            <Button
              className={
                survey.clientAgreement !== undefined && !survey.clientAgreement
                  ? "inlineButtonInverted"
                  : "inlineButton"
              }
              onClick={() => agreeHandler(false)}
            >
              <EuiBadge
                iconType="faceSad"
                color="#dc3c32"
                className={styles.agreeCount}
              >
                <span>{survey.totalDisagree ? survey.totalDisagree : 0}</span>
              </EuiBadge>
            </Button>
          </EuiFlexItem>
          {!abridged && !survey.flagged && (
            <EuiFlexItem className={styles.agreeButton}>
              <Button onClick={flagHandler}>
                <EuiBadge iconType="flag">
                  <span title="Flagged for moderator attention">
                    {survey.flagged && <>&#10071;</>}
                  </span>
                </EuiBadge>
              </Button>
            </EuiFlexItem>
          )}
        </EuiFlexGroup>
      </>
    );
  };

  // Generate the survey text.
  const surveyText = () => {
    if (abridged) {
      if (survey.comment.length > 145) {
        return (
          <div className={styles.surveyText}>
            {`${survey.comment.substring(0, 145)}`}
            <div>
              <Link
                routeName="factrak.professors"
                routeParams={{ profID: survey.professorID }}
              >
                <p className={styles.seeMore}>See More...</p>
              </Link>
            </div>
          </div>
        );
      }

      return <div className={styles.surveyText}>{survey.comment}</div>;
    }

    return (
      <div className={styles.surveyText}>
        {survey.comment}
        <br />
        {wouldTakeAnother()}
        {wouldRecommend()}
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
      <div className>
        <div className>
          <h1>
            {showProf && (
              <Link routeName="factrak" className={styles.transparent}>
                Ephraiem Williams
              </Link>
            )}
          </h1>

          <h1>
            <span className={styles.transparent}>0</span>
            &nbsp;agree&emsp;
            <span className={styles.transparent}>0</span>
            &nbsp;disagree
          </h1>

          {surveyText()}
          <p className={styles.commentDetail}>
            posted about <span>1793</span>
          </p>
        </div>
      </div>
    );

  return (
    <div>
      <div className={styles.commentContent}>
        <h1 className={styles.commentHeader}>
          {profName()}
          {courseLink()}
        </h1>
        {surveyText()}
        {surveyDetail()}
        {agree()}
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
