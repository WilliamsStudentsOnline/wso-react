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
import { getAPIToken, getWSO } from "../../../selectors/auth";
import { containsScopes, scopes } from "../../../lib/general";

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
        // eslint-disable-line no-empty
      }
    };

    const loadMatches = async () => {
      try {
        const ephmatchersResponse = await wso.ephmatchService.listMatches();
        if (isMounted) {
          updateMatches(ephmatchersResponse.data);
        }
      } catch {
        // eslint-disable-line no-empty
      }
    };

    const loadMatchesCount = async () => {
      try {
        const ephmatchersCountResponse = await wso.ephmatchService.countMatches();
        if (isMounted) {
          updateMatchesTotalCount(ephmatchersCountResponse.data.total);
        }
      } catch {
        // eslint-disable-line no-empty
      }
    };

    loadAvailability();
    loadMatchesCount();
    loadMatches();

    return () => {
      isMounted = false;
    };
  }, [wso, route]);

  const EphmatchBody = () => {
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
        return <EphmatchMatch matches={matches} />;
      case "optOut":
        return <EphmatchOptOut />;
      default:
        navigateTo("ephmatch");
        return null;
    }
  };

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
  wso: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
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
