// React imports
import React from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { getCurrUser } from "../../../selectors/auth";

// Additional imports
import { Link } from "react-router5";

const EphmatchLayout = ({ currUser, children }) => {
  return (
    <>
      <header>
        <div className="page-head">
          <h1>
            <Link routeName="Ephmatch">Ephmatch</Link>
          </h1>
          <ul>
            <li>
              <Link routeName="Ephmatch">Home</Link>
            </li>
            <li>
              <Link routeName="Ephmatch.matches">Matches</Link>
              {currUser.ephmatches && currUser.ephmatches.length > 0 ? (
                <span className="Ephmatch-badge" title="Matches!">
                  {currUser.ephmatches.length}
                </span>
              ) : null}
            </li>
            <li>
              <Link routeName="Ephmatch.optout">Opt Out</Link>
            </li>
          </ul>
        </div>
      </header>
      {children}
    </>
  );
};

EphmatchLayout.propTypes = {
  currUser: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
};

EphmatchLayout.defaultProps = {};

const mapStateToProps = (state) => ({
  currUser: getCurrUser(state),
});

export default connect(mapStateToProps)(EphmatchLayout);
