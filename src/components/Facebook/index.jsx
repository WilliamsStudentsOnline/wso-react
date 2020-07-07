// React Imports
import React from "react";
import PropTypes from "prop-types";

// Component Imports
import FacebookAltLayout from "./FacebookAltLayout";
import FacebookEdit from "./FacebookEdit";
import FacebookHelp from "./FacebookHelp";
import FacebookHome from "./FacebookHome";
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
        return (
          <FacebookAltLayout>
            <FacebookHelp />
          </FacebookAltLayout>
        );
      case "users":
        return (
          <FacebookAltLayout>
            <FacebookUser />
          </FacebookAltLayout>
        );
      case "edit":
        return (
          <FacebookAltLayout>
            <FacebookEdit />
          </FacebookAltLayout>
        );
      default:
        return <FacebookHome />;
    }
  };

  return facebookBody();
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
