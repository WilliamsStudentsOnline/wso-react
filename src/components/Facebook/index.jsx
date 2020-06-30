// React Imports
import React from "react";
import PropTypes from "prop-types";

// Component Imports
import FacebookLayout from "./FacebookLayout";
import FacebookHome from "./FacebookHome";
import FacebookHelp from "./FacebookHelp";
// import FacebookEdit from "./FacebookEdit";
import FacebookUser from "./FacebookUser";

// Redux Imports
import { connect } from "react-redux";

// External Imports
import { createRouteNodeSelector } from "redux-router5";

const FacebookMain = ({ route }) => {
  const facebookBody = () => {
    const splitRoute = route.name.split(".");
    if (splitRoute.length === 1) return <FacebookHome />;

    switch (splitRoute[1]) {
      case "help":
        return <FacebookHelp />;
      case "users":
        return <FacebookUser />;
      // case "edit":
      //   return <FacebookEdit />;
      default:
        return <FacebookHome />;
    }
  };

  return <FacebookLayout>{facebookBody()}</FacebookLayout>;
};

FacebookMain.propTypes = {
  route: PropTypes.object.isRequired,
};

FacebookMain.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("facebook");

  return (state) => ({
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(FacebookMain);
