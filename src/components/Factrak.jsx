// React imports
import React from 'react';
import PropTypes from 'prop-types';
import FactrakComment from './FactrakComment';
import FactrakLayout from './FactrakLayout';

const Factrak = ({
  areas,
  currentUser,
  comments,
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
      <article className="dormtrak">
        <div className="container">
          <aside className="sidebar">
            <article className="home">
              <h3>Departments</h3>
              <ul id="dept_list">
                {areas.map(area => (
                  <li key={area.name}>
                    <a href={`/factrak/areas_of_study/${area.id}`}>
                      {area.name}
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          </aside>

          <article className="main">
            <section className="lead">
              <h3>Recent Comments</h3>
              <br />
              {// Pluralize
              currentUser.factrak_survey_deficit > 0 ? (
                <>
                  <strong>
                    {`Write just ${currentUser.factrak_survey_deficit} reviews to
                  make the blur go away!`}
                  </strong>
                  <br />
                  To write a review, just search a prof&apos;s name directly
                  above, or click a department on the left to see a list of
                  profs in that department. Then click the link on the
                  prof&apos;s page to write a review!
                  <br />
                  <br />
                </>
              ) : null}

              {comments.map(comment => (
                <FactrakComment
                  comment={comment}
                  showProf
                  abridged
                  currentUser={currentUser}
                  key={comment.id}
                />
              ))}
            </section>
          </article>
        </div>
      </article>
    </FactrakLayout>
  );
};

Factrak.propTypes = {
  areas: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentUser: PropTypes.object,
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  authToken: PropTypes.string.isRequired,
  notice: PropTypes.string,
  warning: PropTypes.string,
};

Factrak.defaultProps = {
  notice: '',
  warning: '',
  currentUser: {},
};

export default Factrak;
