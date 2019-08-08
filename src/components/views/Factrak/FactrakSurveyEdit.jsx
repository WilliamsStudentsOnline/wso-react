// React imports
import React from "react";
import PropTypes from "prop-types";
import FactrakSurvey from "./FactrakSurvey";

const FactrakSurveyEdit = ({ survey, prof }) => {
  return (
    <div className="article">
      <section>
        <article>
          <h3>
            Editing review on
            {survey.course ? ` ${survey.course.name} with ` : " "}
            {prof.name}
          </h3>
          <a
            data-confirm="Are you sure you want to delete your review?"
            rel="nofollow"
            data-method="delete"
            href={`/factrak/surveys/${survey.id}`}
          >
            Delete Review
          </a>
          <FactrakSurvey survey={survey} prof={prof} edit />
        </article>
      </section>
    </div>
  );
};

FactrakSurveyEdit.propTypes = {
  survey: PropTypes.object.isRequired,
  prof: PropTypes.object.isRequired,
};

FactrakSurveyEdit.defaultProps = {};

export default FactrakSurveyEdit;
