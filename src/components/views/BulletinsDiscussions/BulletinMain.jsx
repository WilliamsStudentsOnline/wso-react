// React imports
import React from "react";
import PropTypes from "prop-types";
import BulletinLayout from "./BulletinLayout";
import BulletinIndex from "./BulletinIndex";
import BulletinShow from "./BulletinShow";
import BulletinForm from "./BulletinForm";

// Redux imports
import { connect } from "react-redux";

// External Imports
import { createRouteNodeSelector, actions } from "redux-router5";
import {
  bulletinTypeLostAndFound,
  bulletinTypeJob,
  bulletinTypeRide,
  bulletinTypeExchange,
  bulletinTypeAnnouncement,
} from "../../../constants/general";
import { scopes, containsScopes } from "../../../lib/general";
import { getToken } from "../../../selectors/auth";

const BulletinMain = ({ route, navigateTo, token }) => {
  const BulletinBody = (bulletinType) => {
    const splitRoute = route.name.split(".");

    if (splitRoute.length < 2) {
      return <BulletinIndex type={bulletinType} />;
    }

    switch (splitRoute[1]) {
      case "show":
        return <BulletinShow />;
      case "new":
      case "edit":
        return <BulletinForm />;
      default:
        return <BulletinIndex type={bulletinType} />;
    }
  };

  // Check that this is a valid route with 'type' params
  if (route.params && route.params.type) {
    // Check that the type is valid
    const validBulletinTypes = [
      bulletinTypeLostAndFound,
      bulletinTypeRide,
      bulletinTypeJob,
      bulletinTypeExchange,
      bulletinTypeAnnouncement,
    ];

    if (
      containsScopes(token, [scopes.ScopeBulletin]) &&
      containsScopes(token, [scopes.ScopeUser]) &&
      validBulletinTypes.indexOf(route.params.type) !== -1
    ) {
      return (
        <BulletinLayout type={route.params.type}>
          {BulletinBody(route.params.type)}
        </BulletinLayout>
      );
    }
  }

  navigateTo("login");
  return null;
};

BulletinMain.propTypes = {
  route: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

BulletinMain.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("bulletins");

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
)(BulletinMain);
