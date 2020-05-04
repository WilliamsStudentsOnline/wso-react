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
import { actions, createRouteNodeSelector } from "redux-router5";
import { getAPI, getToken } from "../../../selectors/auth";

// Additional Imports
import { scopes, containsScopes } from "../../../lib/general";

const EphmatchMain = ({ api, route, token, navigateTo, profile }) => {
  const [ephmatchProfile, updateEphmatchProfile] = useState(profile);
  const [hasQueriedProfile, updateHasQueriedProfile] = useState(false);
  const [matches, updateMatches] = useState([]);
  const ephmatchEndDate = new Date(2020, 2, 17, 23, 59, 59, 99);

  useEffect(() => {
    let isMounted = true;
    // Check if there is an ephmatch profile for the user
    const loadEphmatchProfile = async () => {
      try {
        const ownProfile = await api.ephmatchService.getSelfProfile();
        if (isMounted) {
          updateEphmatchProfile(ownProfile.data);
        }
      } catch {
        // eslint-disable-next-line no-empty
      }
      updateHasQueriedProfile(true);
    };
    const loadMatches = async () => {
      try {
        const ephmatchersResponse = await api.ephmatchService.listMatches();
        updateMatches(ephmatchersResponse.data);
      } catch {
        // eslint-disable-next-line no-empty
      }
    };

    loadMatches();

    loadEphmatchProfile();

    return () => {
      isMounted = false;
    };
  }, [api, route]);

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
      if (new Date() < ephmatchEndDate) {
        return <EphmatchHome />;
      }

      return (
        <h1 className="no-matches-found">
          Ephmatch has officially closed for this year.
        </h1>
      );
    }

    switch (splitRoute[1]) {
      case "profile":
        return <EphmatchProfile />;
      case "matches":
        return <EphmatchMatch matches={matches} />;
      case "optOut":
        return <EphmatchOptOut />;
      default:
        navigateTo("ephmatch");
        return null;
    }
  };

  if (containsScopes(token, [scopes.ScopeEphmatch])) {
    return (
      <EphmatchLayout matches={matches} ephmatchEndDate={ephmatchEndDate}>
        {EphmatchBody()}
      </EphmatchLayout>
    );
  }

  navigateTo("login");
  return null;
};

EphmatchMain.propTypes = {
  api: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  profile: PropTypes.object,
  route: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

EphmatchMain.defaultProps = { profile: null };

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("ephmatch");

  return (state) => ({
    api: getAPI(state),
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EphmatchMain);
