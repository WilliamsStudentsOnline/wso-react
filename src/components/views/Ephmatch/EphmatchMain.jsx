// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import EphmatchHome from "./EphmatchHome";
import EphmatchLayout from "./EphmatchLayout";
import EphmatchMatch from "./EphmatchMatch";
import EphmatchProfile from "./EphmatchProfile";
import EphmatchOptOut from "./EphmatchOptOut";
import EphmatchOptIn from "./EphmatchOptIn";

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

const EphmatchMain = ({ route, token, navigateTo, profile }) => {
  const [ephmatchProfile, updateEphmatchProfile] = useState(profile);
  const [hasQueriedProfile, updateHasQueriedProfile] = useState(false);

  useEffect(() => {
    let isMounted = true;
    // Check if there is an ephmatch profile for the user
    const loadEphmatchProfile = async () => {
      const ownProfile = await getSelfEphmatchProfile(token);
      if (checkAndHandleError(ownProfile) && isMounted) {
        updateEphmatchProfile(ownProfile.data.data);
      }
      updateHasQueriedProfile(true);
    };

    loadEphmatchProfile();

    return () => {
      isMounted = false;
    };
  }, [token, route]);

  const hasValidEphmatchProfile = () => {
    return ephmatchProfile && !ephmatchProfile.deleted;
  };

  const EphmatchBody = () => {
    if (hasQueriedProfile && !hasValidEphmatchProfile()) {
      navigateTo("ephmatch", null, { replace: true });
      return <EphmatchOptIn />;
    }

    const splitRoute = route.name.split(".");
    if (splitRoute.length === 1) {
      return <EphmatchHome />;
    }

    switch (splitRoute[1]) {
      case "profile":
        return <EphmatchProfile />;
      case "matches":
        return <EphmatchMatch />;
      case "optOut":
        return <EphmatchOptOut />;
      default:
        navigateTo("ephmatch");
        return null;
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
  profile: PropTypes.object,
};

EphmatchMain.defaultProps = { profile: null };

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("ephmatch");

  return (state) => ({
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EphmatchMain);
