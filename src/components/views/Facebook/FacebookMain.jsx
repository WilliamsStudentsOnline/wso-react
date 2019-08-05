// React Imports
import React from "react";
import PropTypes from "prop-types";

// Component Imports
import FacebookLayout from "./FacebookLayout";
import FacebookHome from "./FacebookHome";
import FacebookHelp from "./FacebookHelp";

// Redux Imports
import { connect } from "react-redux";
import { getCurrUser } from "../../../selectors/auth";

// External Imports
import { createRouteNodeSelector, actions } from "redux-router5";

const FacebookMain = ({ route, currUser, navigateTo }) => {
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

  if (!currUser) {
    navigateTo("home");
    return null;
  }

  return <FacebookLayout>{facebookBody()}</FacebookLayout>;
};

FacebookMain.propTypes = {
  route: PropTypes.string.isRequired,
  currUser: PropTypes.object,
  navigateTo: PropTypes.func.isRequired,
};

FacebookMain.defaultProps = {
  currUser: {},
};

const mapStateToProps = (state) => {
  const routeNodeSelector = createRouteNodeSelector("facebook");

  return (state) => ({
    currUser: getCurrUser(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location) => dispatch(actions.navigateTo(location)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FacebookMain);
