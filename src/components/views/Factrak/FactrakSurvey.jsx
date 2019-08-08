// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

// External Imports
import axios from "axios";
import { createRouteNodeSelector, actions } from "redux-router5";
import { getProfessor, postSurvey, getSurvey } from "../../../api/factrak";

// @TODO: look into react form handlers
// @TODO: Client side form validation?
// @TODO: Error display

const FactrakSurvey = ({ token, route, navigateTo }) => {
  // const defaultQuery = "";
  // @TODO: if (survey.course) defaultQuery = survey.course.department;
  // const [query, setQuery] = useState(defaultQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [survey, updateSurvey] = useState(null);
  const [prof, updateProf] = useState(null);

  const edit = route.name.split(".")[1] === "editSurvey";

  const [comment, updateComment] = useState("");
  const [courseAOS, updateCourseAOS] = useState("");
  // Use string to accomodate tutorial course numbers
  // @TODO make these consistent with backend
  const [courseNumber, updateCourseNumber] = useState("");
  const [recommend, updateRecommend] = useState(null);
  const [takeAnother, updateTakeAnother] = useState(null);
  const [workload, updateWorkload] = useState(null);
  const [approachability, updateApprochability] = useState(null);
  const [lecture, updateLecture] = useState(null);
  const [discussion, updateDiscussion] = useState(null);
  const [helpful, updateHelpful] = useState(null);

  const professorParam = route.params.professorID;
  const surveyParam = route.params.surveyID;

  const submitHandler = (event) => {
    event.preventDefault();
    const surveyParams = {
      areaOfStudyAbbreviation: courseAOS,
      professorID: parseInt(professorParam, 10),
      courseNumber,
      comment,
      wouldRecommendCourse: recommend,
      wouldTakeAnother: takeAnother,
      courseWorkload: parseInt(workload, 10),
      approachability: parseInt(approachability, 10),
      leadLecture: parseInt(lecture, 10),
      promoteDiscussion: parseInt(discussion, 10),
      outsideHelpfulness: parseInt(helpful, 10),
    };

    const response = postSurvey(token, surveyParams);
    if (response) {
      navigateTo("factrak.surveys");
    } else {
      // `@TODO handle error
    }
  };
  // Equivalent to ComponentDidMount
  useEffect(() => {
    const loadProf = async (professorID) => {
      const profData = await getProfessor(token, professorID);
      if (profData) {
        updateProf(profData);
      } else {
        // @TODO: Error handling?
      }
    };

    const loadSurvey = async (surveyID) => {
      const surveyData = await getSurvey(token, surveyID);
      if (surveyData) {
        updateSurvey(surveyData);
      } else {
        // @TODO: Error handling?
      }
    };

    if (surveyParam) loadSurvey(surveyParam);
    if (professorParam) loadProf(professorParam);
  }, [route.params.professor, token, professorParam, surveyParam]);

  /**
   * For autocompleting departments in the survey form
   * @TODO add this functionality
   */
  const factrakDeptAutocomplete = (event) => {
    updateCourseAOS(event.target.value);
    // setQuery(event.target.value);
    // axios({
    //   url: "/factrak/find_depts_autocomplete",
    //   params: { q: event.target.value },
    //   headers: {
    //     "X-Requested-With": "XMLHttpRequest",
    //   },
    // }).then((response) => {
    //   return setSuggestions(response.data);
    // });
  };

  const deptSuggestions = () => {
    if (suggestions) {
      return (
        <table id="factrak_dept_suggestions">
          <tbody>
            {suggestions.map((suggestion) => (
              <tr key={suggestion}>
                <td>
                  <button
                    type="button"
                    className="autocomplete-option"
                    onClick={() => {
                      axios({
                        url: "/factrak/find_depts_autocomplete",
                        params: { q: suggestion.value },
                        headers: {
                          "X-Requested-With": "XMLHttpRequest",
                        },
                      }).then((response) => {
                        return setSuggestions(response.data);
                      });

                      // @TODO setQuery(suggestion);
                    }}
                  >
                    {suggestion}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return null;
  };

  const optionBuilder = (type, changeHandler) => {
    return [1, 2, 3, 4, 5, 6, 7].map((ans) => {
      return (
        <React.Fragment key={ans}>
          {ans}
          &nbsp;
          <input
            type="radio"
            value={ans}
            name={`factrak_survey[${type}]`}
            id={`factrak_survey_${type}_${ans}`}
            defaultChecked={edit ? survey[type] === ans : false}
            onChange={(event) => changeHandler(event.target.value)}
          />
        </React.Fragment>
      );
    });
  };
  return (
    <div className="article">
      <section>
        <article>
          {/* <div id="errors">
        {survey.errors
          ? survey.errors.full_messages.map((msg) => <p key={msg}>{msg}</p>)
          : null}
      </div> */}

          <form
            id={
              edit ? `edit_factrak_survey_${survey.id}` : "new_factrak_survey"
            }
            className={edit ? "edit_factrak_survey" : "new_factrak_survey"}
            action={edit ? `/factrak/surveys/${survey.id}` : "/factrak/surveys"}
            onSubmit={(event) => submitHandler(event)}
          >
            {prof ? (
              <>
                <h3>{`Review of ${prof.name}`}</h3>
                <input
                  value={prof.id}
                  type="hidden"
                  name="factrak_survey[professor_id]"
                  id="factrak_survey_professor_id"
                />
              </>
            ) : null}

            <table id="factrak-survey-table">
              {!prof ? <></> : null}

              <tbody>
                <tr>
                  <td align="left">
                    <strong>What course is this for?*</strong>
                  </td>
                  <td align="left">
                    <div className="survey_course_name">
                      <input
                        placeholder="DEPT"
                        onChange={factrakDeptAutocomplete}
                        autoComplete="off"
                        type="text"
                        name="factrak_survey[aos_abbrev]"
                        id="factrak_survey_aos_abbrev"
                        value={/* query */ courseAOS}
                      />
                      {deptSuggestions()}
                      <input
                        placeholder="NUMBER"
                        type="text"
                        name="factrak_survey[course_num]"
                        id="factrak_survey_course_num"
                        onChange={(event) =>
                          updateCourseNumber(event.target.value)
                        }
                        defaultValue={
                          survey && survey.course ? survey.course.number : ""
                        }
                      />
                    </div>
                  </td>
                </tr>

                <tr>
                  <td align="left">
                    <strong>
                      Would you recommend this course to a friend?
                    </strong>
                  </td>
                  <td align="left">
                    Yes&nbsp;
                    <input
                      type="radio"
                      value="true"
                      name="factrak_survey[would_recommend_course]"
                      id="factrak_survey_would_recommend_course_true"
                      defaultChecked={survey && survey.would_recommend_course}
                      onChange={(event) =>
                        updateRecommend(event.target.value === "true")
                      }
                    />
                    No&nbsp;
                    <input
                      type="radio"
                      value="false"
                      name="factrak_survey[would_recommend_course]"
                      id="factrak_survey_would_recommend_course_false"
                      onChange={(event) =>
                        updateRecommend(event.target.checked === "true")
                      }
                      defaultChecked={
                        survey && survey.would_recommend_course !== null
                          ? survey.would_recommend_course === false
                          : false
                      }
                    />
                  </td>
                </tr>

                <tr>
                  <td align="left">
                    <strong>
                      Would you take another course with this professor?
                    </strong>
                  </td>
                  <td align="left">
                    Yes&nbsp;
                    <input
                      type="radio"
                      value="true"
                      name="factrak_survey[would_take_another]"
                      id="factrak_survey_would_take_another_true"
                      defaultChecked={survey && survey.would_take_another}
                      onChange={(event) =>
                        updateTakeAnother(event.target.value === "true")
                      }
                    />
                    No&nbsp;
                    <input
                      type="radio"
                      value="false"
                      name="factrak_survey[would_take_another]"
                      id="factrak_survey_would_take_another_false"
                      defaultChecked={
                        survey && survey.would_take_another !== null
                          ? survey.would_take_another === false
                          : false
                      }
                      onChange={(event) =>
                        updateTakeAnother(event.target.value === "true")
                      }
                    />
                  </td>
                </tr>

                <tr>
                  <td align="left">
                    <strong>
                      How does the workload compare to other courses you&apos;ve
                      taken?
                    </strong>
                  </td>
                  <td align="left">
                    {optionBuilder("course_workload", updateWorkload)}
                  </td>
                </tr>

                <tr>
                  <td align="left">
                    <strong>How approachable was this professor?</strong>
                  </td>
                  <td align="left">
                    {optionBuilder("approachability", updateApprochability)}
                  </td>
                </tr>

                <tr>
                  <td align="left">
                    <strong>
                      If applicable, how effective was this professor at
                      lecturing?
                    </strong>
                  </td>
                  <td align="left">
                    {optionBuilder("lead_lecture", updateLecture)}
                  </td>
                </tr>

                <tr>
                  <td align="left">
                    <strong>
                      If applicable, how effective was this professor at
                      promoting discussion?
                    </strong>
                  </td>
                  <td align="left">
                    {optionBuilder("promote_discussion", updateDiscussion)}
                  </td>
                </tr>

                <tr>
                  <td align="left">
                    <strong>
                      How helpful was this professor outside of class?
                    </strong>
                  </td>
                  <td align="left">
                    {optionBuilder("outside_helpfulness", updateHelpful)}
                  </td>
                </tr>

                <tr>
                  <td colSpan="2">
                    <br />
                    <strong>Comments*</strong>
                    <textarea
                      style={{ minHeight: "100px" }}
                      placeholder="Minimum 100 characters"
                      name="factrak_survey[comment]"
                      id="factrak_survey_comment"
                      defaultValue={edit ? survey.comment : ""}
                      onChange={(event) => updateComment(event.target.value)}
                    />
                    <input
                      type="submit"
                      name="commit"
                      value="Save"
                      id="submit-survey"
                      data-disable-with="Save"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </article>
      </section>
    </div>
  );
};

FactrakSurvey.propTypes = {
  token: PropTypes.string.isRequired,
  route: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

FactrakSurvey.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("factrak.surveys");

  return (state) => ({
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location) => dispatch(actions.navigateTo(location)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FactrakSurvey);
