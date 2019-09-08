// React imports
import React from "react";
import PropTypes from "prop-types";

// Additional imports
import { Link } from "react-router5";

const DiscussionLayout = ({ children }) => {
  return (
    <>
      <header>
        <div className="page-head">
          <h1>Discussions</h1>
          <ul>
            <li>
              <Link routeName="discussions">Home</Link>
            </li>
            <li>
              <Link routeName="discussions.new">New</Link>
            </li>
          </ul>
        </div>
      </header>
      <article className="main-table">{children}</article>
    </>
  );
};

DiscussionLayout.propTypes = {
  children: PropTypes.object.isRequired,
};

DiscussionLayout.defaultProps = {};

export default DiscussionLayout;
