// React imports
import React from "react";
import PropTypes from "prop-types";
import EphcatchHome from "./EphcatchHome";
import EphcatchLayout from "./EphcatchLayout";
import EphcatchMatch from "./EphcatchMatch";
import EphcatchOptOut from "./EphcatchOptOut";

// Redux/Routing imports
import { connect } from "react-redux";
import { createRouteNodeSelector, actions } from "redux-router5";
import { getToken } from "../../../selectors/auth";

// Additional Imports
import { scopes, containsScopes } from "../../../lib/general";

const EphcatchMain = ({ route, token, navigateTo }) => {
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

  if (containsScopes(token, [scopes.ScopeEphcatch, scopes.ScopeAdminAll])) {
    return <EphcatchLayout>{EphcatchBody()}</EphcatchLayout>;
  }

  navigateTo("login");
  return null;
};

EphcatchMain.propTypes = {
  route: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

EphcatchMain.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("ephcatch");

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
)(EphcatchMain);
