// React imports
import React, { useState, useEffect } from "react";
import EphmatchHome from "./EphmatchHome";
import EphmatchLayout from "./EphmatchLayout";
import EphmatchMatch from "./EphmatchMatch";
import EphmatchProfile from "./EphmatchProfile";
import EphmatchOptOut from "./EphmatchOptOut";
import EphmatchOptIn from "./EphmatchOptIn";

// Redux/Routing imports
import { useAppSelector } from "../../../lib/store";
import { getAPIToken, getWSO } from "../../../lib/authSlice";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { containsOneOfScopes, scopes } from "../../../lib/general";

import { format } from "timeago.js";

const EphmatchMain = () => {
  const wso = useAppSelector(getWSO);
  const token = useAppSelector(getAPIToken);

  const navigateTo = useNavigate();
  const location = useLocation();

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
      } catch (error) {
        navigateTo("/error", { replace: true, state: { error } });
      }
    };

    const loadMatches = async () => {
      try {
        const ephmatchersResponse = await wso.ephmatchService.listMatches();
        if (isMounted) {
          updateMatches(ephmatchersResponse.data);
        }
      } catch {
        // Handle it by not doing anything - users can decide to refresh or not,
        // and users without the ephmatch:matches scope should still be able to access.
      }
    };

    const loadMatchesCount = async () => {
      try {
        const ephmatchersCountResponse =
          await wso.ephmatchService.countMatches();
        if (isMounted) {
          updateMatchesTotalCount(ephmatchersCountResponse.data.total);
        }
      } catch {
        // Handle it by not doing anything - users can decide to refresh or not,
        // and users without the ephmatch:matches scope should still be able to access.
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
  }, [wso, location.pathname]);

  const EphmatchBody = () => {
    const Home = () => {
      // If token doesnt have access to matches, must mean they need to create a new account
      if (!containsOneOfScopes(token, [scopes.ScopeEphmatchMatches])) {
        return <Navigate to="/ephmatch/opt-in" />;
      }

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
                  Ephmatch will open again {format(availability.nextOpenTime)}.{" "}
                  {availability?.seniorOnly && <>For Seniors Only</>}
                </>
              ) : (
                <>Ephmatch has officially closed for this year.</>
              )}
            </h1>
          </section>
        </article>
      );
    };

    return (
      <Routes>
        <Route index element={<Home />} />
        <Route path="profile" element={<EphmatchProfile />} />
        <Route path="matches" element={<EphmatchMatch matches={matches} />} />
        <Route path="opt-out" element={<EphmatchOptOut />} />
        <Route path="opt-in" element={<EphmatchOptIn />} />
        <Route path="*" element={<Home />} />
      </Routes>
    );
  };

  if (
    !containsOneOfScopes(token, [
      scopes.ScopeEphmatch,
      scopes.ScopeEphmatchMatches,
      scopes.ScopeEphmatchProfiles,
    ])
  ) {
    return <Navigate to="/403" />;
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

export default EphmatchMain;
