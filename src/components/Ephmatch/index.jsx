// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Component imports
import EphmatchEdit from "./EphmatchEdit";
import EphmatchHome from "./EphmatchHome";
import EphmatchLayout from "./EphmatchLayout";
import EphmatchMatches from "./EphmatchMatches";
import EphmatchProfile from "./EphmatchProfile";
import EphmatchOptIn from "./EphmatchOptIn";
import Redirect from "../common/Redirect";
import "./Ephmatch.scss";

// Redux/Routing imports
import { connect } from "react-redux";
import { actions, createRouteNodeSelector } from "redux-router5";
import { getAPIToken, getWSO } from "../../selectors/auth";
import { containsOneOfScopes, scopes } from "../../lib/general";

import { format } from "timeago.js";

const EphmatchMain = ({ navigateTo, route, token, wso }) => {
  const [availability, updateAvailability] = useState(null);
  const [matches, updateMatches] = useState([]);
  const [matchesTotalCount, updateMatchesTotalCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadAvailability = async () => {
      try {
        const availabilityResp = await wso.ephmatchService.getAvailability();
        if (isMounted) {
          updateAvailability(availabilityResp.data);
        }
      } catch {
        navigateTo("500");
      }
    };

    const loadMatches = async () => {
      try {
        const ephmatchersResponse = await wso.ephmatchService.listMatches();
        if (isMounted) {
          updateMatches(ephmatchersResponse.data);
        }
      } catch {
        navigateTo("500");
      }
    };

    const loadMatchesCount = async () => {
      try {
        const ephmatchersCountResponse = await wso.ephmatchService.countMatches();
        if (isMounted) {
          updateMatchesTotalCount(ephmatchersCountResponse.data.total);
        }
      } catch {
        // Handle it by not doing anything - users can decide to refresh or not.
      }
    };

    if (
      containsOneOfScopes(token, [
        scopes.ScopeEphmatch,
        scopes.ScopeEphmatchMatches,
        scopes.ScopeEphmatchProfiles,
      ])
    ) {
      loadAvailability();
      loadMatchesCount();
      loadMatches();
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigateTo, route, wso]);

  const EphmatchBody = () => {
    // If token doesnt have access to matches or profiles, must mean they need to create a new account
    if (
      !containsOneOfScopes(token, [
        scopes.ScopeEphmatchMatches,
        scopes.ScopeEphmatchProfiles,
      ])
    ) {
      return <EphmatchOptIn />;
    }

    const splitRoute = route.name.split(".");
    if (splitRoute.length === 1) {
      // If token doesnt have access to profiles, must mean that ephmatch is closed for the year
      //  || new Date() < ephmatchEndDate
      if (
        containsOneOfScopes(token, [scopes.ScopeEphmatchProfiles]) &&
        availability?.available
      ) {
        return <EphmatchHome />;
      }

      return (
        <article className="facebook-results">
          <section>
            <h1 className="no-matches-found">
              {availability?.nextOpenTime ? (
                <>
                  Ephmatch has officially closed.
                  <br />
                  Will open again {format(availability.nextOpenTime)}.
                </>
              ) : (
                <>Ephmatch has officially closed for this year.</>
              )}
            </h1>
          </section>
        </article>
      );
    }

    switch (splitRoute[1]) {
      case "profile":
        return <EphmatchProfile />;
      case "matches":
        return <EphmatchMatches matches={matches} />;
      case "settings":
        return <EphmatchEdit />;
      default:
        navigateTo("ephmatch");
        return null;
    }
  };

  if (
    !containsOneOfScopes(token, [
      scopes.ScopeEphmatch,
      scopes.ScopeEphmatchMatches,
      scopes.ScopeEphmatchProfiles,
    ])
  ) {
    return <Redirect to="403" />;
  }

  return (
    <EphmatchLayout
      matchesTotalCount={matchesTotalCount}
      available={availability?.available}
      closingTime={availability?.closingTime}
      token={token}
    >
      {EphmatchBody()}
    </EphmatchLayout>
  );
};

EphmatchMain.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  wso: PropTypes.object.isRequired,
};

// EphmatchMain.defaultProps = { profile: null };

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("ephmatch");

  return (state) => ({
    token: getAPIToken(state),
    wso: getWSO(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EphmatchMain);
