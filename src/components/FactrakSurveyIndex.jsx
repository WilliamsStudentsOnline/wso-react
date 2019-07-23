// React imports
import React from 'react';
import PropTypes from 'prop-types';
import FactrakComment from './FactrakComment';
import FactrakLayout from './FactrakLayout';

const FactrakSurveyIndex = ({
  surveys,
  currentUser,
  authToken,
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
            {surveys.length > 0 ? (
              <>
                <h3>Your Reviews</h3>
                <br />
                <br />
                {surveys.map(survey => (
                  <FactrakComment
                    comment={survey}
                    showProf
                    abridged={false}
                    currentUser={currentUser}
                  />
                ))}
              </>
            ) : (
              <h1 className="no-matches-found">No reviews yet.</h1>
            )}
          </article>
        </section>
      </div>
    </FactrakLayout>
  );
};

FactrakSurveyIndex.propTypes = {
  surveys: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  authToken: PropTypes.string.isRequired,
  notice: PropTypes.string,
  warning: PropTypes.string,
};

FactrakSurveyIndex.defaultProps = {
  notice: '',
  warning: '',
};

export default FactrakSurveyIndex;
