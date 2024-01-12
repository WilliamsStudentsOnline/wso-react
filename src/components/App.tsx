// React imports
import React, { Suspense, lazy, useEffect, useState } from "react";

// Component Imports
import "./stylesheets/Application.css";
import Layout from "./Layout";
import Homepage from "./Homepage";

// Redux/routing
import { getWSO, getIdentityToken, getAPIToken } from "../lib/authSlice";
import {
  removeCredentials,
  updateAPIToken,
  updateIdentityToken,
  updateUser,
} from "../lib/authSlice";
import { useAppSelector, useAppDispatch } from "../lib/store";

import { Routes, Route, useNavigate } from "react-router-dom";

// Additional Imports
import { tokenIsExpired } from "../lib/axiosAuth";
import jwtDecode from "jwt-decode";
import RequireScope from "../router-permissions";
import usePageTracking from "../lib/usePageTracking";
import { WSOToken } from "../lib/types";

// More component imports
const Scheduler = lazy(() => import("./views/CourseScheduler/Scheduler"));
const About = lazy(() => import("./views/Misc/About"));
const Dashboard = lazy(() => import("./views/AdminTools/dashboard"));

const FAQ = lazy(() => import("./views/Misc/FAQ"));
const Team = lazy(() => import("./views/Misc/Team"));
const MobilePrivacyPolicy = lazy(
  () => import("./views/Misc/MobilePrivacyPolicy")
);
const FacebookMain = lazy(() => import("./views/Facebook/FacebookMain"));
const DormtrakMain = lazy(() => import("./views/Dormtrak/DormtrakMain"));
const FactrakMain = lazy(() => import("./views/Factrak/FactrakMain"));
const EphmatchMain = lazy(() => import("./views/Ephmatch/EphmatchMain"));
const Error404 = lazy(() => import("./views/Errors/Error404"));
const Login = lazy(() => import("./Login"));
const Error403 = lazy(() => import("./views/Errors/Error403"));
const Error500 = lazy(() => import("./views/Errors/Error500"));
const Error = lazy(() => import("./views/Errors/Error"));
const BulletinMain = lazy(
  () => import("./views/BulletinsDiscussions/BulletinMain")
);
const DiscussionMain = lazy(
  () => import("./views/BulletinsDiscussions/DiscussionMain")
);

const App = () => {
  const dispatch = useAppDispatch();
  const apiToken = useAppSelector(getAPIToken);
  const identityToken = useAppSelector(getIdentityToken);
  const wso = useAppSelector(getWSO);

  const navigateTo = useNavigate();
  const [initialized, setInitialized] = useState(false);
  usePageTracking();

  const getIPIdentityToken = async () => {
    try {
      const tokenResponse = await wso.authService.getIdentityToken({
        useIP: true,
      });
      const newIdenToken = tokenResponse.token;
      dispatch(updateIdentityToken(newIdenToken));
    } catch (error) {
      navigateTo("/error", { replace: true, state: { error } });
    }
  };

  const updateAPI = async () => {
    if (identityToken !== "") {
      try {
        const apiTokenResponse = await wso.authService.getAPIToken(
          identityToken
        );
        const newAPIToken = apiTokenResponse.token;
        dispatch(updateAPIToken(newAPIToken));
      } catch (error) {
        // possibly expired token, clear and report error to user
        dispatch(removeCredentials());
        // TODO: should we redirect to login page or get new based on IP?
        navigateTo("/error", { replace: true, state: { error } });
      }
    }
  };

  useEffect(() => {
    const randomWSO = async () => {
      if (document.title === "WSO: Williams Students Online") {
        try {
          const wsoResponse = await wso.miscService.getWords();
          document.title = `WSO: ${wsoResponse.data}`;
        } catch {
          // Do nothing - it's fine to gracefully handle this with the default title
        }
      }
    };

    const initialize = async () => {
      if (identityToken === "" || tokenIsExpired(identityToken)) {
        await getIPIdentityToken();
      }

      setInitialized(true);
    };

    initialize();
    randomWSO();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Each time identityToken is updated, we query for the new API token, update the API and
   * authentication that we use.
   */
  useEffect(() => {
    if (initialized) {
      updateAPI();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identityToken, initialized]);

  /**
   * Each time the authentication mechanism/ API is updated, see if we need to update the current
   * user information.
   */
  useEffect(() => {
    let isMounted = true;
    const updateUserInfo = async () => {
      if (apiToken !== "") {
        try {
          const decoded = jwtDecode<WSOToken>(apiToken);
          if (decoded?.tokenLevel === 3) {
            const userResponse = await wso.userService.getUser("me");
            if (isMounted) {
              dispatch(updateUser(userResponse.data));
            }
          }
        } catch (error) {
          navigateTo("/error", { replace: true, state: { error } });
        }
      }
    };

    updateUserInfo();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wso]);

  return (
    <Layout>
      <Suspense fallback={null}>
        <Routes>
          <Route index element={<Homepage />} />
          {/* Various modules */}
          <Route
            path="facebook/*"
            element={
              <RequireScope token={apiToken} name="facebook">
                <FacebookMain />
              </RequireScope>
            }
          />
          <Route path="bulletins/:type/*" element={<BulletinMain />} />
          <Route path="discussions/*" element={<DiscussionMain />} />
          <Route
            path="factrak/*"
            element={
              <RequireScope token={apiToken} name="factrak">
                <FactrakMain />
              </RequireScope>
            }
          />
          <Route
            path="dormtrak/*"
            element={
              <RequireScope token={apiToken} name="dormtrak">
                <DormtrakMain />
              </RequireScope>
            }
          />
          <Route
            path="ephmatch/*"
            element={
              <RequireScope token={apiToken} name="ephmatch">
                <EphmatchMain />
              </RequireScope>
            }
          />

          <Route path="schedulecourses" element={<Scheduler />} />
          {/* Static Content Pages */}

          <Route path="about" element={<About />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="team" element={<Team />} />
          <Route
            path="admin"
            element={
              <RequireScope token={apiToken} name="admin.dashboard">
                <Dashboard />
              </RequireScope>
            }
          />

          <Route
            path="mobile-privacy-policy"
            element={<MobilePrivacyPolicy />}
          />

          <Route path="login" element={<Login />} />
          {/* Error-handling Pages */}
          <Route path="403" element={<Error403 />} />
          <Route path="404" element={<Error404 />} />
          <Route path="500" element={<Error500 />} />
          <Route path="error" element={<Error />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
