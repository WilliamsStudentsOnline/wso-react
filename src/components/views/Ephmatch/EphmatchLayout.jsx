// React imports
import React from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";

// Additional imports
import { Link } from "react-router5";

const EphmatchLayout = ({ children }) => {
  return (
    <>
      <header>
        <div className="page-head">
          <h1>
            <Link routeName="ephmatch">Ephmatch</Link>
          </h1>
          <ul>
            <li>
              <Link routeName="ephmatch">Home</Link>
            </li>
            <li>
              <Link routeName="ephmatch.matches">Matches</Link>
            </li>
            <li>
              <Link routeName="ephmatch.profile">Profile</Link>
            </li>
          </ul>
        </div>
      </header>
      {children}
    </>
  );
};

EphmatchLayout.propTypes = {
  children: PropTypes.object.isRequired,
};

EphmatchLayout.defaultProps = {};

// TODO remove if uneeded
const mapStateToProps = () => ({});

export default connect(mapStateToProps)(EphmatchLayout);
