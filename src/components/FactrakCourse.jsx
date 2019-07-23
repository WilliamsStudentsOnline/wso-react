// React imports
import React from 'react';
import PropTypes from 'prop-types';
import FactrakComment from './FactrakComment';
import FactrakLayout from './FactrakLayout';

const FactrakCourse = ({
  course,
  comments,
  currentUser,
  authToken,
  notice,
  warning,
}) => {
  const professorList = () => {
    if (course.professors.length === 0) return null;
    return (
      <div>
        View comments only for 
        {' '}
        <br />
        {course.professors.map(prof => (
          <a
            key={prof.name}
            href={`/factrak/courses/${course.id}?prof=${prof.id}`}
          >
            {prof.name}
          </a>
        ))}
      </div>
    );
  };

  const commentList = () => {
    if (comments.length === 0) return null;
    return (
      <div className="factrak-prof-comments">
        {comments.length === 0
          ? 'None yet.'
          : comments.map(comment => (
            <FactrakComment
              comment={comment}
              abridged={false}
              showProf
              currentUser={currentUser}
              key={comment.id}
            />
            ))}
      </div>
    );
  };

  // Original rails has additional code that never seem to run.
  return (
    <FactrakLayout
      currentUser={currentUser}
      authToken={authToken}
      notice={notice}
      warning={warning}
    >
      <article className="facebook-profile">
        <section className="info">
          <h3>{course.name}</h3>
          <br />
          {professorList()}
          <br />
          {commentList()}
        </section>
      </article>
    </FactrakLayout>
  );
};

FactrakCourse.propTypes = {
  currentUser: PropTypes.object,
  course: PropTypes.object.isRequired,
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  authToken: PropTypes.string.isRequired,
  notice: PropTypes.string,
  warning: PropTypes.string,
};

FactrakCourse.defaultProps = {
  notice: '',
  warning: '',
  currentUser: {},
};

export default FactrakCourse;
