// React imports
import React from 'react';
import PropTypes from 'prop-types';
import Layout from './Layout';

const BulletinLayout = ({ children, notice, warning, currentUser }) => {
  const pageClass = window.location.href.split('/')[3];
  const capitalize = string => {
    if (string === 'lost_and_found') return 'Lost + Found';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const bulletinLink = type => {
    if (type !== pageClass) {
      if (type === 'lost_and_found')
        return (
          <li>
            <a href="/lost_and_found">Lost + Found</a>
          </li>
        );
      return (
        <li key={type}>
          <a href={`/${type}`}>{`${type}`}</a>
        </li>
      );
    }
    return null;
  };
  return (
    <Layout
      bodyClass="announcement"
      notice={notice}
      warning={warning}
      currentUser={currentUser}
    >
      <header>
        <div className="page-head">
          <h1>
            <a href={`/${pageClass}`}>{capitalize(pageClass)}</a>
          </h1>
          <ul>
            <li>
              <a href={`/${pageClass}/new`}>
                {`New ${capitalize(pageClass)} Post`}
              </a>
            </li>
            {[
              'announcements',
              'exchanges',
              'lost_and_found',
              'jobs',
              'rides',
            ].map(type => bulletinLink(type))}
          </ul>
        </div>
      </header>
      <article className="main-table">{children}</article>
    </Layout>
  );
};

BulletinLayout.propTypes = {
  children: PropTypes.object.isRequired,
  notice: PropTypes.string,
  warning: PropTypes.object,
  currentUser: PropTypes.object,
};

BulletinLayout.defaultProps = {
  currentUser: {},
  notice: '',
  warning: '',
};

export default BulletinLayout;
