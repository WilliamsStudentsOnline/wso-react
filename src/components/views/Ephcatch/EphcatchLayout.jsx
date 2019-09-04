// React imports
import React from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getCurrUser } from "../../../selectors/auth";

import { Link } from "react-router5";

const EphcatchLayout = ({ currUser, children }) => {
  return (
    <>
      <header>
        <div className="page-head">
          <h1>
            <Link routeName="ephcatch">Ephcatch</Link>
          </h1>
          <ul>
            <li>
              <Link routeName="ephcatch">Home</Link>
            </li>
            <li>
              <Link routeName="ephcatch.matches">Matches</Link>
              {currUser.ephcatches && currUser.ephcatches.length > 0 ? (
                <span className="ephcatch-badge" title="Matches!">
                  {currUser.ephcatches.length}
                </span>
              ) : null}
            </li>
            <li>
              <Link routeName="ephcatch.optout">Opt Out</Link>
            </li>
          </ul>
        </div>
      </header>
      {children}
    </>
  );
};

EphcatchLayout.propTypes = {
  currUser: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
};

EphcatchLayout.defaultProps = {};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
});

export default connect(mapStateToProps)(EphcatchLayout);
