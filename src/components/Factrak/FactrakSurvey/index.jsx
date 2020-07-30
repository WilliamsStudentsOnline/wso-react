// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles, { selectDept } from "./FactrakSurvey.module.scss";

// Redux/ Routing imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";
import { createRouteNodeSelector, actions } from "redux-router5";

// Elastic
import { EuiButton, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";

const FactrakSurvey = ({ wso, route, navigateTo }) => {
  const [survey, updateSurvey] = useState(null);
  const [prof, updateProf] = useState(null);
  // const [department, updateDepartment] = useState(null);

  const edit = route.name.split(".")[1] === "editSurvey";

  const [comment, updateComment] = useState("");
  const [courseAOS, updateCourseAOS] = useState("");
  const [errors, updateErrors] = useState([]);
  // Use string to accomodate tutorial course numbers
  const [courseNumber, updateCourseNumber] = useState("");
  const [wouldRecommendCourse, updateRecommend] = useState(null);
  const [wouldTakeAnother, updateTakeAnother] = useState(null);
  const [workload, updateWorkload] = useState(null);
  const [approachability, updateApprochability] = useState(null);
  const [lecture, updateLecture] = useState(null);
  const [discussion, updateDiscussion] = useState(null);
  const [helpful, updateHelpful] = useState(null);

  const professorParam = route.params.profID;
  const surveyParam = route.params.surveyID;
  const [areasOfStudy, updateAreasOfStudy] = useState([]);

  useEffect(() => {
    const loadProf = async (professorID) => {
      try {
        const profResponse = await wso.factrakService.getProfessor(professorID);
        const profData = profResponse.data;
        updateProf(profData);

        // const departmentResponse = await wso.factrakService.getDepartment(
        // profData.departmentID
        // );
        // updateDepartment(departmentResponse.data);
      } catch {
        navigateTo("500");
      }
    };

    const loadSurvey = async (surveyID) => {
      try {
        const surveyResponse = await wso.factrakService.getSurvey(surveyID);
        const surveyData = surveyResponse.data;

        // Could use a defaultSurvey and update that object, but will hardly save any lines.
        updateSurvey(surveyData);
        updateProf(surveyData.professor);
        updateCourseAOS(surveyData.course.areaOfStudy.abbreviation);
        updateRecommend(surveyData.wouldRecommendCourse);
        updateWorkload(surveyData.courseWorkload);
        updateApprochability(surveyData.approachability);
        updateLecture(surveyData.leadLecture);
        updateHelpful(surveyData.outsideHelpfulness);
        updateDiscussion(surveyData.promoteDiscussion);
        updateRecommend(surveyData.wouldRecommendCourse);
        updateTakeAnother(surveyData.wouldTakeAnother);
        updateComment(surveyData.comment);
      } catch {
        navigateTo("500");
      }
    };

    const loadAreasOfStudy = async () => {
      try {
        const areasOfStudyResponse = await wso.factrakService.listAreasOfStudy();
        updateAreasOfStudy(areasOfStudyResponse.data);
      } catch {
        navigateTo("500");
      }
    };

    if (surveyParam) loadSurvey(surveyParam);
    if (professorParam) loadProf(professorParam);
    loadAreasOfStudy();
  }, [navigateTo, professorParam, surveyParam, wso]);

  const submitHandler = async (event) => {
    event.preventDefault();

    // Some error checking
    if (courseAOS === "") {
      updateErrors(["Please choose a Course Prefix!"]);
      return;
    }

    if (courseNumber === "") {
      updateErrors(["Please enter a valid Course Number"]);
      return;
    }

    // Parse integers here rather than below to minimize the expensive operation
    const surveyParams = {
      areaOfStudyAbbreviation: courseAOS,
      professorID: prof.id,
      courseNumber,
      comment,
      wouldRecommendCourse,
      wouldTakeAnother,
      // Parse ints should work without errors here since users do not have access to these
      // variables
      courseWorkload: parseInt(workload, 10),
      approachability: parseInt(approachability, 10),
      leadLecture: parseInt(lecture, 10),
      promoteDiscussion: parseInt(discussion, 10),
      outsideHelpfulness: parseInt(helpful, 10),
    };

    try {
      if (edit) {
        await wso.factrakService.updateSurvey(survey.id, surveyParams);
      } else {
        await wso.factrakService.createSurvey(surveyParams);
      }
      navigateTo("factrak.surveys");
    } catch (error) {
      updateErrors([error.message]);
    }
  };

  // Generates the dropdown for the department
  const deptDropdown = () => {
    if (areasOfStudy.length === 0)
      return (
        <select className={selectDept}>
          <option>Loading...</option>
        </select>
      );
    return (
      <div className={styles.selectDeptContainer}>
        <select
          className={styles.selectDept}
          onChange={(event) => updateCourseAOS(event.target.value)}
          value={courseAOS}
        >
          <option value="" defaultValue disabled hidden>
            Course Prefix
          </option>
          {areasOfStudy.map((areaOfStudy) => (
            <option value={areaOfStudy.abbreviation} key={areaOfStudy.id}>
              {areaOfStudy.abbreviation}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Constructor which helps us build the option bubbles for each option
  const optionBuilder = (type, changeHandler, optional, string) => {
    return [1, 2, 3, 4, 5, "N/A"].map((ans) => {
      // Generates the optional N/A option
      if (ans === "N/A") {
        if (optional) {
          return (
            <EuiFlexItem grow={false} key={null}>
              <EuiFlexGroup
                direction="column"
                alignItems="center"
                gutterSize="s"
              >
                <EuiFlexItem>
                  <p className={styles.radioText}>N/A</p>
                </EuiFlexItem>
                <EuiFlexItem>
                  <label
                    className={styles.checkboxContainer}
                    htmlFor={`${string}na`}
                  >
                    <input
                      type="checkbox"
                      checked={!type}
                      onChange={() => {
                        changeHandler(null);
                      }}
                      id={`${string}na`}
                    />
                    <span className={styles.customCheckbox} />
                  </label>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
          );
        }
        return null;
      }
      return (
        <EuiFlexItem key={ans} grow={false} className={styles.radioFlexItem}>
          <EuiFlexGroup direction="column" alignItems="center" gutterSize="s">
            <EuiFlexItem>
              <p className={styles.radioText}>{ans}</p>
            </EuiFlexItem>
            <EuiFlexItem>
              <label
                className={styles.radioContainer}
                htmlFor={`${string}${ans}`}
              >
                <input
                  type="radio"
                  checked={type ? type === ans : false}
                  onChange={() => {
                    changeHandler(ans);
                  }}
                  id={`${string}${ans}`}
                />
                <span className={styles.customRadio} />
              </label>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      );
    });
  };

  const yesNoQuestion = (recommend) => {
    const option = recommend ? wouldRecommendCourse : wouldTakeAnother;
    return (
      <>
        <EuiFlexItem>
          {recommend
            ? "Would you recommend this course to a friend?"
            : "Would you take another course with this professor?"}
        </EuiFlexItem>
        <EuiFlexItem className={styles.yesNoContainer}>
          <EuiFlexGroup gutterSize="xs">
            <EuiFlexItem grow={false}>
              <label
                className={styles.radioContainerSmall}
                htmlFor={recommend ? "recommendYes" : "takeAnotherYes"}
              >
                <input
                  type="radio"
                  checked={option || false}
                  onChange={() =>
                    recommend ? updateRecommend(true) : updateTakeAnother(true)
                  }
                  id={recommend ? "recommendYes" : "takeAnotherYes"}
                />
                <span className={styles.customRadioSmall} />
              </label>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <p className={styles.yesNo}>Yes&nbsp;</p>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <label
                className={styles.radioContainerSmall}
                htmlFor={recommend ? "recommendNo" : "takeAnotherNo"}
              >
                <input
                  type="radio"
                  onChange={() =>
                    recommend
                      ? updateRecommend(false)
                      : updateTakeAnother(false)
                  }
                  checked={option !== null && option === false}
                  id={recommend ? "recommendNo" : "takeAnotherNo"}
                />
                <span className={styles.customRadioSmall} />
              </label>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <p className={styles.yesNo}>No&nbsp;</p>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </>
    );
  };

  return (
    <div>
      <section>
        <EuiFlexGroup direction="column" alignItems="center">
          <EuiFlexItem className={styles.surveyPage}>
            <form onSubmit={(event) => submitHandler(event)}>
              <EuiFlexGroup
                direction="column"
                className={styles.surveyForm}
                gutterSize="m"
              >
                <EuiFlexItem>
                  <EuiFlexGroup>
                    <EuiFlexItem grow={false}>
                      <h3>Review</h3>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      {errors
                        ? errors.map((msg) => (
                            <p key={msg} className={styles.errorMessage}>
                              {msg}
                            </p>
                          ))
                        : null}
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiFlexItem>
                <EuiFlexItem>{deptDropdown()}</EuiFlexItem>
                <EuiFlexItem>
                  <span className={styles.profName}>
                    <p>{prof?.name}</p>
                  </span>
                </EuiFlexItem>
                <EuiFlexItem>
                  <input
                    placeholder="Course Number"
                    type="text"
                    onChange={(event) => updateCourseNumber(event.target.value)}
                    defaultValue={
                      survey && survey.course ? survey.course.number : ""
                    }
                    className={styles.courseNumber}
                  />
                </EuiFlexItem>
                {yesNoQuestion(true)}
                {yesNoQuestion(false)}
                <EuiFlexItem>
                  <p className={styles.text}>
                    The following questions are asked on a scale of 1-5, 5 being
                    the most positive and 1 the most negative.
                    <br />
                    Some of these questions will include a ‘Not Applicable’
                    option if appropriate.
                  </p>
                </EuiFlexItem>
                <EuiFlexItem>
                  How effective was this professor at lecturing?
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFlexGroup gutterSize="xl">
                    {optionBuilder(lecture, updateLecture, true, "lecture")}
                  </EuiFlexGroup>
                </EuiFlexItem>
                <EuiFlexItem>
                  How effective was this professor as promoting discussion?
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFlexGroup gutterSize="xl">
                    {optionBuilder(
                      discussion,
                      updateDiscussion,
                      true,
                      "discussion"
                    )}
                  </EuiFlexGroup>
                </EuiFlexItem>
                <EuiFlexItem>
                  How does the workload compare to your other courses?
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFlexGroup gutterSize="xl">
                    {optionBuilder(workload, updateWorkload, false, "workload")}
                  </EuiFlexGroup>
                </EuiFlexItem>
                <EuiFlexItem>How approachable was this professor?</EuiFlexItem>
                <EuiFlexItem>
                  <EuiFlexGroup gutterSize="xl">
                    {optionBuilder(
                      approachability,
                      updateApprochability,
                      false,
                      "approachability"
                    )}
                  </EuiFlexGroup>
                </EuiFlexItem>
                <EuiFlexItem>
                  How helpful was this professor outside of class?
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFlexGroup gutterSize="xl">
                    {optionBuilder(helpful, updateHelpful, false, "helpful")}
                  </EuiFlexGroup>
                </EuiFlexItem>
                <EuiFlexItem>Comments</EuiFlexItem>
                <EuiFlexItem>
                  <textarea
                    placeholder=""
                    value={comment}
                    onChange={(event) => updateComment(event.target.value)}
                    className={styles.textArea}
                  />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButton
                    type="submit"
                    size="m"
                    fill
                    className={styles.submitButton}
                  >
                    Post Review
                  </EuiButton>
                </EuiFlexItem>
              </EuiFlexGroup>
            </form>
          </EuiFlexItem>
        </EuiFlexGroup>
      </section>
    </div>
  );
};

FactrakSurvey.propTypes = {
  wso: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
};

FactrakSurvey.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("factrak.surveys");

  return (state) => ({
    wso: getWSO(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FactrakSurvey);
