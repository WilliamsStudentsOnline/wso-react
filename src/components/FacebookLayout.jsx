// React imports
import React from 'react';
import PropTypes from 'prop-types';
import SearchBox from './SearchBox';
import Layout from './Layout';

const FacebookLayout = ({
  currentUser,
  authToken,
  children,
  notice,
  warning,
}) => {
  return (
    <Layout
      bodyClass="facebook"
      notice={notice}
      warning={warning}
      currentUser={currentUser}
    >
      <div className="facebook">
        <header>
          <div className="page-head">
            <h1>
              <a href="/facebook"> Facebook </a>
            </h1>
            <ul>
              <li>
                <a href="/facebook"> Search </a>
              </li>
              <li>
                <a href="/facebook/help"> Help </a>
              </li>

              {currentUser ? (
                <>
                  <li>
                    <a href={`/facebook/users/${currentUser.id}`}>View</a>
                  </li>
                  {' '}
                  <li>
                    <a href="/facebook/edit"> Edit </a>
                  </li>
                </>
              ) : null}
            </ul>
          </div>
          <SearchBox authToken={authToken} />
        </header>
        {children}
      </div>
    </Layout>
  );
};

FacebookLayout.propTypes = {
  currentUser: PropTypes.object.isRequired,
  authToken: PropTypes.string.isRequired,
  children: PropTypes.object,
  notice: PropTypes.string,
  warning: PropTypes.object,
};

FacebookLayout.defaultProps = {
  notice: '',
  warning: '',
  children: {},
};

export default FacebookLayout;
