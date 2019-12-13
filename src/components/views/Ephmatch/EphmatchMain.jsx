// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import EphmatchHome from "./EphmatchHome";
import EphmatchLayout from "./EphmatchLayout";
import EphmatchMatch from "./EphmatchMatch";
import EphmatchProfile from "./EphmatchProfile";

// Redux/Routing imports
import { connect } from "react-redux";
import { createRouteNodeSelector, actions } from "redux-router5";
import { getToken } from "../../../selectors/auth";

// Additional Imports
import {
  scopes,
  containsScopes,
  checkAndHandleError,
} from "../../../lib/general";
import { getSelfEphmatchProfile } from "../../../api/ephmatch";

const EphmatchMain = ({ route, token, navigateTo }) => {
  const [ephmatchProfile, updateEphmatchProfile] = useState(null);

  useEffect(() => {
    // Check if there is an ephmatch profile for the user
    const loadEphmatchProfile = async () => {
      const ownProfile = await getSelfEphmatchProfile(token);
      if (checkAndHandleError(ownProfile)) {
        updateEphmatchProfile(ownProfile.data.data);
      }
    };

    loadEphmatchProfile();
  }, [token]);

  const EphmatchBody = () => {
    if (!ephmatchProfile) return <EphmatchProfile />;

    const splitRoute = route.name.split(".");
    if (splitRoute.length === 1) return <EphmatchHome />;

    switch (splitRoute[1]) {
      case "profile":
        return <EphmatchProfile />;
      case "matches":
        return <EphmatchMatch />;
      default:
        return <EphmatchHome />;
    }
  };

  if (containsScopes(token, [scopes.ScopeUsers])) {
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
