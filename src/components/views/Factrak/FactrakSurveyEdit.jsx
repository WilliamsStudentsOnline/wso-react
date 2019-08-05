// React imports
import React from "react";
import PropTypes from "prop-types";
import FactrakSurvey from "./FactrakSurvey";
import FactrakLayout from "./FactrakLayout";

const FactrakSurveyEdit = ({
  survey,
  prof,
  authToken,
  currentUser,
  notice,
  warning,
}) => {
  return (
    <FactrakLayout
      currentUser={currentUser}
      authToken={authToken}
      notice={notice}
      warning={warning}
    >
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
            <FactrakSurvey
              survey={survey}
              prof={prof}
              authToken={authToken}
              edit
            />
          </article>
        </section>
      </div>
    </FactrakLayout>
  );
};

FactrakSurveyEdit.propTypes = {
  survey: PropTypes.object.isRequired,
  prof: PropTypes.object.isRequired,
  authToken: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
  notice: PropTypes.string,
  warning: PropTypes.string,
};

FactrakSurveyEdit.defaultProps = {
  notice: "",
  warning: "",
  currentUser: {},
};

export default FactrakSurveyEdit;
