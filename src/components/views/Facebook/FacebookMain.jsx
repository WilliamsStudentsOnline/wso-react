// React Imports
import React from "react";
import PropTypes from "prop-types";

// Component Imports
import FacebookLayout from "./FacebookLayout";
import FacebookHome from "./FacebookHome";
import FacebookHelp from "./FacebookHelp";
import FacebookEdit from "./FacebookEdit";
import FacebookUser from "./FacebookUser";

// Redux Imports
import { connect } from "react-redux";
import { getCurrUser } from "../../../selectors/auth";

// External Imports
import { createRouteNodeSelector, actions } from "redux-router5";

const FacebookMain = ({ route, currUser, navigateTo }) => {
  const facebookBody = () => {
    const splitRoute = route.name.split(".");
    if (splitRoute.length === 1) return <FacebookHome />;

    switch (splitRoute[1]) {
      case "help":
        return <FacebookHelp />;
      case "users":
        return <FacebookUser />;
      case "edit":
        return <FacebookEdit />;
      default:
        return <FacebookHome />;
    }
  };

  if (!currUser) {
    navigateTo("403");
    return null;
  }

  return <FacebookLayout>{facebookBody()}</FacebookLayout>;
};

FacebookMain.propTypes = {
  route: PropTypes.object.isRequired,
  currUser: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

FacebookMain.defaultProps = {};

const mapStateToProps = () => {
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
