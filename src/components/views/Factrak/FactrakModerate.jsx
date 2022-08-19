// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";

// Additional imports
import { Link, useNavigate } from "react-router-dom";

const FactrakModerate = ({ wso }) => {
  const navigateTo = useNavigate();
  const [flagged, updateFlagged] = useState([]);

  // Loads all the flagged courses on mount.
  useEffect(() => {
    const loadFlagged = async () => {
      try {
        const flaggedResponse =
          await wso.factrakService.listFlaggedSurveysAdmin({
            preload: ["professor", "course"],
            populateAgreements: true,
          });

        updateFlagged(flaggedResponse.data);
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    };

    loadFlagged();
  }, [wso]);

  // Unflag the survey
  const unflag = async (surveyID) => {
    try {
      await wso.factrakService.unflagSurveyAdmin(surveyID);
      updateFlagged(flagged.filter((survey) => survey.id !== surveyID));
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  // Handles the deletion of the survey
  const deleteHandler = async (surveyID) => {
    // eslint-disable-next-line no-restricted-globals
    const confirmDelete = confirm("Are you sure?"); // eslint-disable-line no-alert
    if (!confirmDelete) return;

    try {
      await wso.factrakService.deleteSurvey(surveyID);
      updateFlagged(flagged.filter((survey) => survey.id !== surveyID));
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  // Generate a flagged survey.
  const generateFlaggedSurvey = (f) => {
    return (
      <div className="comment" key={`comment${f.id}`} id={`comment${f.id}`}>
        <div>
          <span>
            <Link to={`/factrak/professors/${f.professorID}`}>
              {f.professor.name}
            </Link>
            &nbsp;
            <Link to={`/factrak/courses/${f.courseID}`}>
              {`${f.course.areaOfStudy.abbreviation} ${f.course.number}`}
            </Link>{" "}
            (+{f.totalAgree}, -{f.totalDisagree})
          </span>
          <p>{f.comment}</p>
          <button
            className="inline-button"
            type="button"
            onClick={() => unflag(f.id)}
          >
            Unflag
          </button>
          &ensp;
          <button
            className="inline-button"
            onClick={() => deleteHandler(f.id)}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  // Generate all flagged surveys
  const generateFlaggedSurveys = () => {
    return flagged.map((f) => generateFlaggedSurvey(f));
  };

  return (
    <article className="facebook-profile">
      <section className="margin-vertical-small">
        <h3>Moderation</h3>
        {generateFlaggedSurveys()}
      </section>
    </article>
  );
};

FactrakModerate.propTypes = {
  wso: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

export default connect(mapStateToProps)(FactrakModerate);
