// React imports
import React from 'react';
import PropTypes from 'prop-types';

// Component imports
import BulletinBox from './BulletinBox';
import SearchBox from './SearchBox';
import './stylesheets/Homepage.css';
import Layout from './Layout';

const Homepage = ({ bulletins, authToken, notice, warning, currentUser }) => {
  return (
    <Layout
      bodyClass="front"
      notice={notice}
      warning={warning}
      currentUser={currentUser}
    >
      <div className="home">
        <div className="full-width">
          <div id="join-header">
            <a href="https://forms.gle/RYeBrHvi776F24sE9">Join us today!</a>
          </div>

          <header>
            <h2 align="center">WSO</h2>
            <h4 align="center">By Students, For Students!</h4>
            <br />
            <SearchBox authToken={authToken} />
          </header>
          <article>
            <section>
              <div className="bulletin-list">
                {bulletins.map(bulletin => {
                  return <BulletinBox bulletin={bulletin} />;
                })}
              </div>
            </section>
          </article>
        </div>
      </div>
    </Layout>
  );
};

Homepage.propTypes = {
  bulletins: PropTypes.arrayOf(PropTypes.array).isRequired,
  authToken: PropTypes.string.isRequired,
  notice: PropTypes.string,
  warning: PropTypes.string,
  currentUser: PropTypes.object,
};

Homepage.defaultProps = {
  currentUser: {},
  notice: '',
  warning: '',
};

export default Homepage;
