// React imports
import React from "react";
import PropTypes from "prop-types";
import Redirect from "../../Redirect";

// Redux/ Routing imports
import { connect } from "react-redux";
import { createRouteNodeSelector } from "redux-router5";
import { getAPIToken } from "../../../selectors/auth";

// Additional Imports
import { containsOneOfScopes, scopes } from "../../../lib/general";
import GoodrichEditMenu from "./Manager/GoodrichEditMenu";
import ManageOrders from "./Manager/ManageOrders";

const GoodrichManager = ({ route, token }) => {
  const goodrichBody = () => {
    if (!containsOneOfScopes(token, [scopes.ScopeGoodrichManager])) {
      return <Redirect to="403" />;
    }

    const splitRoute = route.name.split(".");
    if (splitRoute.length <= 2) return <ManageOrders />;

    switch (splitRoute[2]) {
      case "orders":
        return <ManageOrders />;
      case "menu":
        return <GoodrichEditMenu />;
      default:
        return <ManageOrders />;
    }
  };

  return goodrichBody();
};

GoodrichManager.propTypes = {
  route: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

GoodrichManager.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("goodrich.manager");

  return (state) => ({
    token: getAPIToken(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(GoodrichManager);
