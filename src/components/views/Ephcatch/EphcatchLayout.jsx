// React imports
import React from "react";
import PropTypes from "prop-types";
import Layout from "../../Layout";

const EphcatchLayout = ({ currentUser, children, notice, warning }) => {
  return (
    <Layout
      bodyClass="facebook"
      notice={notice}
      warning={warning}
      currentUser={currentUser}
    >
      <header>
        <div className="page-head">
          <h1>
            <a href="/ephcatch">Ephcatch</a>
          </h1>
          <ul>
            <li>
              <a href="/ephcatch">Home</a>
            </li>
            <li>
              <a href="/ephcatch/matches">Matches</a>
              {currentUser.ephcatch_unseen_matches.length > 0 ? (
                <span className="ephcatch-badge" title="New matches!">
                  {currentUser.ephcatch_unseen_matches.length}
                </span>
              ) : null}
            </li>
            <li>
              <a href="/ephcatch/opt_out">Opt Out</a>
            </li>
          </ul>
        </div>
      </header>
      {children}
    </Layout>
  );
};

EphcatchLayout.propTypes = {
  notice: PropTypes.string,
  warning: PropTypes.string,
  currentUser: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
};

EphcatchLayout.defaultProps = {
  notice: "",
  warning: "",
};

export default EphcatchLayout;
