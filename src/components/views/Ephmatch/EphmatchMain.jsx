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

import { format } from "timeago.js";

// Additional Imports
import {
  scopes,
  containsScopes,
  checkAndHandleError,
} from "../../../lib/general";
import {
  // getSelfEphmatchProfile,
  getEphmatchMatches,
  getEphmatchAvailability,
} from "../../../api/ephmatch";

const EphmatchMain = ({ route, token, navigateTo }) => {
  // const [ephmatchProfile, updateEphmatchProfile] = useState(profile);
  // const [hasQueriedProfile, updateHasQueriedProfile] = useState(false);
  const [availability, updateAvailability] = useState(null);
  const [matches, updateMatches] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadAvailability = async () => {
      const availabilityResp = await getEphmatchAvailability(token);
      if (checkAndHandleError(availabilityResp) && isMounted) {
        updateAvailability(availabilityResp.data.data);
      }
    };

    // Check if there is an ephmatch profile for the user
    /*
    const loadEphmatchProfile = async () => {
      const ownProfile = await getSelfEphmatchProfile(token);
      if (checkAndHandleError(ownProfile) && isMounted) {
        updateEphmatchProfile(ownProfile.data.data);
      }
      updateHasQueriedProfile(true);
    };
    */
    const loadMatches = async () => {
      const ephmatchersResponse = await getEphmatchMatches(token);
      if (checkAndHandleError(ephmatchersResponse)) {
        updateMatches(ephmatchersResponse.data.data);
      }
    };

    loadAvailability();

    loadMatches();

    // loadEphmatchProfile();

    return () => {
      isMounted = false;
    };
  }, [token, route]);

  /*
  const hasValidEphmatchProfile = () => {
    return ephmatchProfile && !ephmatchProfile.deleted;
  };
  */

  const EphmatchBody = () => {
    // if (hasQueriedProfile && !hasValidEphmatchProfile()) {
    // If token doesnt have access to matches or profiles, must mean they need to create a new account
    if (
      !containsScopes(token, [
        scopes.ScopeEphmatchMatches,
        scopes.ScopeEphmatchProfiles,
      ])
    ) {
      navigateTo("ephmatch", null, { replace: true });
      return <EphmatchOptIn />;
    }

    const splitRoute = route.name.split(".");
    if (splitRoute.length === 1) {
      // If token doesnt have access to profiles, must mean that ephmatch is closed for the year
      //  || new Date() < ephmatchEndDate
      if (
        containsScopes(token, [scopes.ScopeEphmatchProfiles]) &&
        availability &&
        availability.available
      ) {
        return <EphmatchHome />;
      }

      return (
        <h1 className="no-matches-found">
          {availability && !availability.available && (
            <>
              {availability.nextOpenTime ? (
                <>
                  Ephmatch has officially closed.
                  <br />
                  Will open again {format(availability.nextOpenTime)}.
                </>
              ) : (
                <>Ephmatch has officially closed for this year.</>
              )}
            </>
          )}
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
      <EphmatchLayout
        token={token}
        matches={matches}
        availability={availability}
      >
        {EphmatchBody()}
      </EphmatchLayout>
    );
  }

  navigateTo("login");
  return null;
};

EphmatchMain.propTypes = {
  route: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

// EphmatchMain.defaultProps = { profile: null };

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
