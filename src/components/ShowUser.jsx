// React Imports
import React from 'react';
import PropTypes from 'prop-types';
import FacebookLayout from './FacebookLayout';

const ShowUser = ({ authToken, currentUser, viewPerson, notice, warning }) => {
  const displayRoom = () => {
    if (viewPerson.room) {
      if (viewPerson.type === 'Student' && viewPerson.dorm_visible) {
        return (
          <>
            <h5>Room:</h5>
            <h4>{viewPerson.room}</h4>
            <br />
          </>
        );
      }
      return (
        <>
          <h5>Office:</h5>
          <h4>{viewPerson.room}</h4>
          <br />
        </>
      );
    }
    return null;
  };

  return (
    <FacebookLayout
      currentUser={currentUser}
      authToken={authToken}
      notice={notice}
      warning={warning}
    >
      <article className="facebook-profile">
        <section>
          <aside className="picture">
            <img src={`/pic/${viewPerson.unix_id}`} alt="avatar" />
          </aside>

          <aside className="info">
            <h3>
              {viewPerson.name_string}
              {currentUser.id === viewPerson.id ? (
                <span>&nbsp;(me)</span>
              ) : null}
            </h3>

            {viewPerson.type === 'Student' ? (
              <h5>Student</h5>
            ) : (
              <h5>
                {viewPerson.title ? viewPerson.title : null}
                <br />
                {viewPerson.department}
              </h5>
            )}

            {viewPerson.pronoun ? (
              <h5>{`Pronouns: ${viewPerson.pronoun}`}</h5>
            ) : null}

            <br />
            {viewPerson.unix_id ? (
              <>
                <h5>Unix:</h5>
                <h4>{viewPerson.unix_id}</h4>
                <br />
              </>
            ) : null}

            {(viewPerson.type === 'Student' || viewPerson.type === 'Alumni') &&
            viewPerson.tags[0] ? (
              <>
                <h5>Tags:</h5>
                <ul>
                  {viewPerson.tags.map((tag, index) => {
                    return (
                      <li className="view-tag" key={tag.name}>
                        <a
                          href={`/facebook?search=${tag.name
                            .split(' ')
                            .join('+')}`}
                        >
                          {tag.name}
                        </a>
                        {index < viewPerson.tags.length - 1 ? (
                          <span>,&nbsp;</span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
                <br />
              </>
            ) : null}

            {viewPerson.type === 'Student' ? (
              <>
                <h5>SU Box:</h5>
                <h4>{viewPerson.su_box || 'None listed'}</h4>
                <br />
              </>
            ) : null}

            {displayRoom()}

            {viewPerson.home_visible &&
            viewPerson.hometown &&
            viewPerson.type === 'Student' ? (
              <>
                <h5>Hometown:</h5>
                <h4>{viewPerson.hometown}</h4>
              </>
            ) : null}
          </aside>
        </section>
      </article>
    </FacebookLayout>
  );
};

ShowUser.propTypes = {
  currentUser: PropTypes.object.isRequired,
  viewPerson: PropTypes.object.isRequired,
  authToken: PropTypes.string.isRequired,
  notice: PropTypes.string,
  warning: PropTypes.string,
};

ShowUser.defaultProps = {
  notice: '',
  warning: '',
};

export default ShowUser;
