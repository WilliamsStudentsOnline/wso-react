// React Imports
import React from 'react';
import PropTypes from 'prop-types';
import FacebookLayout from './FacebookLayout';

const Facebook = ({
  results,
  currentUser,
  authToken,
  searched,
  notice,
  warning,
}) => {
  const ListView = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th className="unix-column">Unix</th>
            <th>Room/Office</th>
          </tr>
        </thead>
        <tbody>
          {results.map(user => {
            return (
              <tr key={user.id}>
                <td>
                  <a href={`/facebook/users/${user.id}`}>{user.name}</a>
                </td>
                <td>{user.unix_id}</td>
                <td>
                  {user.room && (user.type !== 'Student' || user.dorm_visible)
                    ? user.room
                    : ''}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const GridView = () => {
    return (
      <div className="grid-wrap">
        {results.map(user => {
          return (
            <aside key={user.id}>
              <div className="third">
                <div className="profile-photo">
                  <a href={`/facebook/users/${user.id}`}>
                    <img src={`/pic/${user.unix_id}`} alt="avatar" />
                  </a>
                </div>
              </div>
              <div className="two-third">
                <h4>
                  <a href={`/facebook/users/${user.id}`}>{user.name}</a>
                </h4>
                <ul>
                  {user.unix_id ? (
                    <>
                      <li className="list-headers">UNIX</li>
                      <li className="list-contents">{user.unix_id}</li>
                    </>
                  ) : null}
                  {user.room &&
                  (user.type !== 'Student' || user.dorm_visible) ? (
                    <>
                      <li className="list-headers">
                        {user.type === 'Student' ? 'Room' : 'Office'}
                      </li>
                      <li className="list-contents">{user.room}</li>
                    </>
                  ) : null}
                </ul>
              </div>
            </aside>
          );
        })}
      </div>
    );
  };

  const FacebookResults = () => {
    if (results.length > 6) return ListView();
    return GridView();
  };

  return (
    <FacebookLayout
      currentUser={currentUser}
      authToken={authToken}
      notice={notice}
      warning={warning}
    >
      {searched && searched.length !== 0 ? (
        <article className="facebook-results">
          <section>
            {results ? (
              FacebookResults()
            ) : (
              <>
                <br />
                <h1 className="no-matches-found">No matches were found.</h1>
              </>
            )}
          </section>
        </article>
      ) : null}
    </FacebookLayout>
  );
};

Facebook.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object),
  currentUser: PropTypes.object.isRequired,
  authToken: PropTypes.string.isRequired,
  searched: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.bool,
  ]),
  notice: PropTypes.string,
  warning: PropTypes.string,
};
Facebook.defaultProps = {
  searched: [],
  notice: '',
  warning: '',
  results: [],
};
export default Facebook;
