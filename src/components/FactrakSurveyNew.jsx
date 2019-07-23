// React imports
import React from 'react';
import PropTypes from 'prop-types';
import FactrakSurvey from './FactrakSurvey';
import FactrakLayout from './FactrakLayout';

const FactrakSurveyNew = ({
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
            <FactrakSurvey
              survey={survey}
              prof={prof}
              authToken={authToken}
              edit={false}
            />
          </article>
        </section>
      </div>
    </FactrakLayout>
  );
};

FactrakSurveyNew.propTypes = {
  survey: PropTypes.object.isRequired,
  prof: PropTypes.object.isRequired,
  authToken: PropTypes.string.isRequired,
  currentUser: PropTypes.object.isRequired,
  notice: PropTypes.string,
  warning: PropTypes.string,
};

FactrakSurveyNew.defaultProps = {
  notice: '',
  warning: '',
};

export default FactrakSurveyNew;
