// React imports
import React from 'react';
import PropTypes from 'prop-types';
import BulletinLayout from './BulletinLayout';

const BulletinShow = ({ bulletin, currentUser, notice, warning }) => {
  return (
    <BulletinLayout notice={notice} currentUser={currentUser} warning={warning}>
      <article className="list-creation">
        <section>
          <div className="field">
            <h3>
              <br />
              {bulletin.title}
              <br />
              <br />
            </h3>
            {bulletin.type === 'Ride' ? (
              <div>
                <b>{new Date(bulletin.start_date).toDateString()}</b>
              </div>
            ) : null}
            {`Posted ${new Date(bulletin.created_at).toDateString()} by `}
            {bulletin.user.unix_id ? (
              <a href={`/facebook/users/${bulletin.user.id}`}>
                {bulletin.user.name}
              </a>
            ) : (
              bulletin.user.name
            )}
            {currentUser.id === bulletin.user.id || currentUser.admin ? (
              <>
                &nbsp;[&nbsp;
                <a href={`${window.location.href}/edit`}>Edit</a>
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

            <br />
            <br />
            {bulletin.body}
          </div>
          <br />
        </section>
      </article>
    </BulletinLayout>
  );
};

BulletinShow.propTypes = {
  bulletin: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  notice: PropTypes.string,
  warning: PropTypes.object,
};

BulletinShow.defaultProps = {
  notice: '',
  warning: '',
  currentUser: {},
};

export default BulletinShow;
