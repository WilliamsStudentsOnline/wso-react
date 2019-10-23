// React imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import DiscussionLayout from "./DiscussionLayout";
import DiscussionShow from "./DiscussionShow";
import DiscussionPost from "./DiscussionPost";
import DiscussionIndex from "./DiscussionIndex";
import DiscussionNew from "./DiscussionNew";

// Redux/Routing imports
import { connect } from "react-redux";
import { createRouteNodeSelector, actions } from "redux-router5";

// External Imports
import { getToken } from "../../../selectors/auth";
import { scopes, containsScopes } from "../../../lib/general";

const DiscussionMain = ({ route, navigateTo, token }) => {
  const DiscussionBody = () => {
    const splitRoute = route.name.split(".");

    if (splitRoute.length < 2) {
      return <DiscussionIndex />;
    }

    switch (splitRoute[1]) {
      case "show":
        return <DiscussionShow />;
      case "posts":
        return <DiscussionPost />;
      case "new":
        return <DiscussionNew />;
      default:
        navigateTo("discussion");
        return null;
    }
  };

  if (
    containsScopes(token, [scopes.ScopeBulletin]) &&
    containsScopes(token, [scopes.ScopeUsers])
  ) {
    return (
      <DiscussionLayout type={route.params.type}>
        {DiscussionBody(route.params.type)}
      </DiscussionLayout>
    );
  }

  navigateTo("login");
  return null;
};

DiscussionMain.propTypes = {
  route: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

DiscussionMain.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("discussions");

  return (state) => ({
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionMain);
