// React Imports
import React from "react";

// Component Imports
import FacebookLayout from "./FacebookLayout";
import FacebookHome from "./FacebookHome";
import FacebookHelp from "./FacebookHelp";

// Redux Imports
import { connect } from "react-redux";

// External Imports
import { createRouteNodeSelector } from "redux-router5";

const FacebookMain = ({ route }) => {
  const facebookBody = () => {
    const splitRoute = route.name.split(".");
    if (splitRoute.length === 1) return <FacebookHome />;

    console.log(splitRoute[1]);
    switch (splitRoute[1]) {
      case "help":
        return <FacebookHelp />;

      default:
        return <FacebookHome />;
    }
  };

  return <FacebookLayout>{facebookBody()}</FacebookLayout>;
};

const mapStateToProps = (state) => {
  const routeNodeSelector = createRouteNodeSelector("factrak");

  return (state) => ({
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(FacebookMain);
