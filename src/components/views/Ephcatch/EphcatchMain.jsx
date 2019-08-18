// React imports
import React from "react";
import PropTypes from "prop-types";
import EphcatchHome from "./EphcatchHome";
import EphcatchLayout from "./EphcatchLayout";

// Redux imports
import { connect } from "react-redux";

// External Imports
import { createRouteNodeSelector } from "redux-router5";

const EphcatchMain = ({ route }) => {
  const EphcatchBody = () => {
    const splitRoute = route.name.split(".");
    if (splitRoute.length === 1) return <EphcatchHome />;

    switch (splitRoute[1]) {
      default:
        return <EphcatchHome />;
    }
  };

  return <EphcatchLayout>{EphcatchBody()}</EphcatchLayout>;
};

EphcatchMain.propTypes = {
  route: PropTypes.object.isRequired,
};

EphcatchMain.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("ephcatch");

  return (state) => ({
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(EphcatchMain);
