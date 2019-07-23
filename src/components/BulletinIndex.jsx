// React imports
import React from 'react';
import PropTypes from 'prop-types';
import BulletinLayout from './BulletinLayout';

const BulletinIndex = ({ bulletins, currentUser, notice, warning }) => {
  return (
    <BulletinLayout notice={notice} currentUser={currentUser} warning={warning}>
      <article className="main-table">
        <section>
          {bulletins.length === 0 ? (
            <h1 className="no-posts">No Posts</h1>
          ) : (
            <table>
              <thead>
                <tr>
                  <th className="col-60">Summary</th>
                  <th className="col-6020">Posted by</th>
                  <th className="col-20">Date Posted</th>
                </tr>
              </thead>
              <tbody>
                {bulletins.map(bulletin => (
                  <tr key={bulletin.id}>
                    <td className="col-60">
                      <a href={`${window.location.href}/${bulletin.id}`}>
                        {bulletin.title}
                      </a>
                      {currentUser.id === bulletin.user.id ||
                      currentUser.admin ? (
                        <>
                          &nbsp;[&nbsp;
                          <a
                            href={`${window.location.href}/${bulletin.id}/edit`}
                          >
                            Edit
                          </a>
                          &nbsp;|&nbsp;
                          <a
                            data-confirm="Are you sure?"
                            rel="nofollow"
                            data-method="delete"
                            href={`/bulletins/${bulletin.id}`}
                          >
                            Delete
                          </a>
                          &nbsp;]
                        </>
                      ) : null}
                    </td>
                    <td className="col-20">{bulletin.user.name}</td>
                    <td className="col-20">
                      {new Date(bulletin.start_date).toDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </article>
    </BulletinLayout>
  );
};

BulletinIndex.propTypes = {
  bulletins: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentUser: PropTypes.object,
  notice: PropTypes.string,
  warning: PropTypes.object,
};

BulletinIndex.defaultProps = {
  notice: '',
  warning: '',
  currentUser: {},
};

export default BulletinIndex;
