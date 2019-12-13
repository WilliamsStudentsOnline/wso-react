// React imports
import React from "react";
import PropTypes from "prop-types";
import EphmatchHome from "./EphmatchHome";
import EphmatchLayout from "./EphmatchLayout";
import EphmatchMatch from "./EphmatchMatch";
import EphmatchOptOut from "./EphmatchOptOut";

// Redux/Routing imports
import { connect } from "react-redux";
import { createRouteNodeSelector, actions } from "redux-router5";
import { getToken } from "../../../selectors/auth";

// Additional Imports
import { scopes, containsScopes } from "../../../lib/general";

const EphmatchMain = ({ route, token, navigateTo }) => {
  const EphmatchBody = () => {
    const splitRoute = route.name.split(".");
    if (splitRoute.length === 1) return <EphmatchHome />;

    switch (splitRoute[1]) {
      case "optout":
        return <EphmatchOptOut />;
      case "matches":
        return <EphmatchMatch />;
      default:
        return <EphmatchHome />;
    }
  };

  if (containsScopes(token, [scopes.ScopeEphmatch, scopes.ScopeAdminAll])) {
    return <EphmatchLayout>{EphmatchBody()}</EphmatchLayout>;
  }

  navigateTo("login");
  return null;
};

EphmatchMain.propTypes = {
  route: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

EphmatchMain.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("ephmatch");

  return (state) => ({
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location) => dispatch(actions.navigateTo(location)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EphmatchMain);
