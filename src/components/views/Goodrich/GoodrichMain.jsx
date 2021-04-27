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
import GoodrichLayout from "./GoodrichLayout";
import GoodrichHome from "./GoodrichHome";
import GoodrichManager from "./GoodrichManager";

const GoodrichMain = ({ route, token }) => {
  const goodrichBody = () => {
    if (!containsOneOfScopes(token, [scopes.ScopeGoodrich])) {
      return <Redirect to="403" />;
    }

    if (
      route.name === "goodrich.manager" &&
      !containsOneOfScopes(token, [scopes.ScopeGoodrichManager])
    ) {
      return <Redirect to="403" />;
    }

    const splitRoute = route.name.split(".");
    if (splitRoute.length === 1) return <GoodrichHome />;

    switch (splitRoute[1]) {
      case "manager":
        return <GoodrichManager />;
      /* case "order":
        return <GoodrichOrder />; */
      default:
        return <GoodrichHome />;
    }
  };

  return <GoodrichLayout token={token}>{goodrichBody()}</GoodrichLayout>;
};

GoodrichMain.propTypes = {
  route: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

GoodrichMain.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("goodrich");

  return (state) => ({
    token: getAPIToken(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(GoodrichMain);
