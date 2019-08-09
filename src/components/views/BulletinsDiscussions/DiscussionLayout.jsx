// React imports
import React from "react";
import PropTypes from "prop-types";
import Layout from "../../Layout";

const DiscussionLayout = ({ children, notice, warning, currentUser }) => {
  return (
    <Layout
      bodyClass="announcement"
      notice={notice}
      warning={warning}
      currentUser={currentUser}
    >
      <header>
        <div className="page-head">
          <h1>Discussions</h1>
          <ul>
            <li>
              <a href="/discussions">Home</a>
            </li>
            <li>
              <a href="/discussions/new">New</a>
            </li>
          </ul>
        </div>
      </header>
      <article className="main-table">{children}</article>
    </Layout>
  );
};

DiscussionLayout.propTypes = {
  children: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  notice: PropTypes.string,
  warning: PropTypes.string,
};

DiscussionLayout.defaultProps = {
  currentUser: {},
  notice: "",
  warning: "",
};

export default DiscussionLayout;
