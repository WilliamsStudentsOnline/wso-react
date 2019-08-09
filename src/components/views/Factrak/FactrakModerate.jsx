// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

// External imports
import { getFlagged, unflagSurvey, deleteSurvey } from "../../../api/factrak";
import { checkAndHandleError } from "../../../lib/general";

const FactrakModerate = ({ token }) => {
  const [flagged, updateFlagged] = useState([]);

  // Equivalent to ComponentDidMount
  useEffect(() => {
    const loadFlagged = async () => {
      const flaggedResponse = await getFlagged(token);
      if (checkAndHandleError(flaggedResponse)) {
        updateFlagged(flaggedResponse.data.data);
      }
    };

    loadFlagged();
  }, [token]);

  const unflag = async (surveyID) => {
    const response = await unflagSurvey(token, surveyID);
    if (checkAndHandleError(response)) {
      updateFlagged(flagged.filter((survey) => survey.id !== surveyID));
    }
  };

  const deleteHandler = async (surveyID) => {
    // @TODO: write something to overcome this confirm
    // eslint-disable-next-line no-restricted-globals
    const confirmDelete = confirm("Are you sure?"); // eslint-disable-line no-alert
    if (!confirmDelete) return;

    const response = await deleteSurvey(token, surveyID);
    if (checkAndHandleError(response)) {
      updateFlagged(flagged.filter((survey) => survey.id !== surveyID));
    }
  };

  return (
    <article className="facebook-profile">
      <section className="margin-vertical-small">
        <h3>Moderation</h3>

        {flagged.map((f) => (
          <div className="comment" key={`comment${f.id}`} id={`comment${f.id}`}>
            <div>
              <span>
                <a href={`/facebook/users/${f.professorID}`}>
                  {f.professor.name}
                </a>
                &nbsp;
                <a href={`/factrak/courses/${f.course.id}`}>
                  {`${f.course.areaOfStudy.abbreviation} ${f.course.number}`}
                </a>
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
        ))}
      </section>
    </article>
  );
};

FactrakModerate.propTypes = {
  token: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  token: getToken(state),
});
export default connect(mapStateToProps)(FactrakModerate);
