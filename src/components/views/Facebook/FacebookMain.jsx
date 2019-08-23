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
import { getToken } from "../../../selectors/auth";

// External Imports
import { createRouteNodeSelector, actions } from "redux-router5";
import { scopes, containsScopes } from "../../../lib/general";

const FacebookMain = ({ route, navigateTo, token }) => {
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

  if (containsScopes(token, [scopes.ScopeUsers])) {
    return <FacebookLayout>{facebookBody()}</FacebookLayout>;
  }

  navigateTo("403");
  return null;
};

FacebookMain.propTypes = {
  route: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

FacebookMain.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("facebook");

  return (state) => ({
    token: getToken(state),
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
