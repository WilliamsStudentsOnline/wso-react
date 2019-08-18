// React imports
import React from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getCurrUser } from "../../../selectors/auth";

const EphcatchLayout = ({ currUser, children }) => {
  return (
    <>
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
              {currUser.ephcatches && currUser.ephcatches.length > 0 ? (
                <span className="ephcatch-badge" title="Matches!">
                  {currUser.ephcatches.length}
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
