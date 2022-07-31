// React imports
import React from "react";
import PropTypes from "prop-types";

// Additional imports
import { Link } from "react-router-dom";

const DiscussionLayout = ({ children }) => {
  return (
    <>
      <header>
        <div className="page-head">
          <h1>
            <Link to="/discussions">Discussions</Link>
          </h1>
          <ul>
            <li>
              <Link to="/discussions">Home</Link>
            </li>
            <li>
              <Link to="/discussions/new">New</Link>
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
