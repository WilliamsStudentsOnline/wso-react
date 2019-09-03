// React imports
import React from "react";
import PropTypes from "prop-types";
import EphcatchHome from "./EphcatchHome";
import EphcatchLayout from "./EphcatchLayout";
import EphcatchMatch from "./EphcatchMatch";

// Redux imports
import { connect } from "react-redux";

// External Imports
import { createRouteNodeSelector } from "redux-router5";
import EphcatchOptOut from "./EphcatchOptOut";

const EphcatchMain = ({ route }) => {
  const EphcatchBody = () => {
    const splitRoute = route.name.split(".");
    if (splitRoute.length === 1) return <EphcatchHome />;

    switch (splitRoute[1]) {
      case "optout":
        return <EphcatchOptOut />;
      case "matches":
        return <EphcatchMatch />;
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
