// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// External Imports

const FactrakSurvey = ({ survey, prof, authToken, edit }) => {
  let defaultQuery = "";
  if (survey.course) defaultQuery = survey.course.department;
  const [query, setQuery] = useState(defaultQuery);
  const [suggestions, setSuggestions] = useState([]);

  /**
   * For autocompleting departments in the survey form
   */
  const factrakDeptAutocomplete = (event) => {
    setQuery(event.target.value);
    axios({
      url: "/factrak/find_depts_autocomplete",
      params: { q: event.target.value },
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    }).then((response) => {
      return setSuggestions(response.data);
    });
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

                      setQuery(suggestion);
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

  const optionBuilder = (type) => {
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
          />
        </React.Fragment>
      );
    });
  };
  return (
    <>
      <div id="errors">
        {survey.errors
          ? survey.errors.full_messages.map((msg) => <p key={msg}>{msg}</p>)
          : null}
      </div>

      <form
        id={edit ? `edit_factrak_survey_${survey.id}` : "new_factrak_survey"}
        className={edit ? "edit_factrak_survey" : "new_factrak_survey"}
        action={edit ? `/factrak/surveys/${survey.id}` : "/factrak/surveys"}
        acceptCharset="UTF-8"
        method="post"
      >
        <input name="utf8" type="hidden" value="✓" />
        {edit ? <input type="hidden" name="_method" value="patch" /> : null}
        <input type="hidden" name="authenticity_token" value={authToken} />

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
                    value={query}
                  />
                  {deptSuggestions()}
                  <input
                    placeholder="NUMBER"
                    autoComplete="off"
                    type="text"
                    name="factrak_survey[course_num]"
                    id="factrak_survey_course_num"
                    defaultValue={survey.course ? survey.course.number : ""}
                  />
                </div>
              </td>
            </tr>

            <tr>
              <td align="left">
                <strong>Would you recommend this course to a friend?</strong>
              </td>
              <td align="left">
                Yes&nbsp;
                <input
                  type="radio"
                  value="true"
                  name="factrak_survey[would_recommend_course]"
                  id="factrak_survey_would_recommend_course_true"
                  defaultChecked={survey.would_recommend_course}
                />
                No&nbsp;
                <input
                  type="radio"
                  value="false"
                  name="factrak_survey[would_recommend_course]"
                  id="factrak_survey_would_recommend_course_false"
                  defaultChecked={
                    survey.would_recommend_course !== null
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
                  defaultChecked={survey.would_take_another}
                />
                No&nbsp;
                <input
                  type="radio"
                  value="false"
                  name="factrak_survey[would_take_another]"
                  id="factrak_survey_would_take_another_false"
                  defaultChecked={
                    survey.would_take_another !== null
                      ? survey.would_take_another === false
                      : false
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
              <td align="left">{optionBuilder("course_workload")}</td>
            </tr>

            <tr>
              <td align="left">
                <strong>How approachable was this professor?</strong>
              </td>
              <td align="left">{optionBuilder("approachability")}</td>
            </tr>

            <tr>
              <td align="left">
                <strong>
                  If applicable, how effective was this professor at lecturing?
                </strong>
              </td>
              <td align="left">{optionBuilder("lead_lecture")}</td>
            </tr>

            <tr>
              <td align="left">
                <strong>
                  If applicable, how effective was this professor at promoting
                  discussion?
                </strong>
              </td>
              <td align="left">{optionBuilder("promote_discussion")}</td>
            </tr>

            <tr>
              <td align="left">
                <strong>
                  How helpful was this professor outside of class?
                </strong>
              </td>
              <td align="left">{optionBuilder("outside_helpfulness")}</td>
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
    </>
  );
};

FactrakSurvey.propTypes = {
  survey: PropTypes.object.isRequired,
  prof: PropTypes.object.isRequired,
  authToken: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
};

export default FactrakSurvey;
