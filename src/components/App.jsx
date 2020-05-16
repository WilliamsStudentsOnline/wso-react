// React imports
import React, { Suspense, lazy, useEffect } from "react";
import PropTypes from "prop-types";

// Component Imports
import "./stylesheets/Application.css";
import Layout from "./Layout";
import Homepage from "./Homepage";

// Redux/routing
import { connect } from "react-redux";
import { createRouteNodeSelector, actions } from "redux-router5";
import { getWSO, getExpiry } from "../selectors/auth";
import {
  doRemoveCreds,
  doUpdateAPIToken,
  doUpdateIdentityToken,
  doUpdateUser,
  doUpdateWSO,
} from "../actions/auth";
import { doUpdateSchedulerState } from "../actions/schedulerUtils";

// Additional Imports
import { SimpleAuthentication } from "wso-api-client";
import { loadState, removeStateFromStorage } from "../stateStorage";
import configureInterceptors from "../lib/auth";

// More component imports
const Scheduler = lazy(() => import("./views/CourseScheduler/Scheduler"));
const About = lazy(() => import("./views/Misc/About"));
const FAQ = lazy(() => import("./views/Misc/FAQ"));
const FacebookMain = lazy(() => import("./views/Facebook/FacebookMain"));
const DormtrakMain = lazy(() => import("./views/Dormtrak/DormtrakMain"));
const FactrakMain = lazy(() => import("./views/Factrak/FactrakMain"));
const EphmatchMain = lazy(() => import("./views/Ephmatch/EphmatchMain"));
const FourOhFour = lazy(() => import("./views/Errors/FourOhFour"));
const Login = lazy(() => import("./Login"));
const FourOhThree = lazy(() => import("./views/Errors/FourOhThree"));
const BulletinMain = lazy(() =>
  import("./views/BulletinsDiscussions/BulletinMain")
);
const DiscussionMain = lazy(() =>
  import("./views/BulletinsDiscussions/DiscussionMain")
);

const App = ({
  wso,
  navigateTo,
  removeCreds,
  route,
  updateAPIToken,
  updateIdenToken,
  updateSchedulerState,
  updateUser,
  updateWSO,
}) => {
  // returns wso based on IP address
  const loadIPAPI = async () => {
    try {
      const tokenResponse = await wso.authService.getIdentityToken({
        useIP: true,
      });
      const newIdenToken = tokenResponse.token;

      const apiTokenResponse = await wso.authService.getAPIToken(newIdenToken);
      const newAPIToken = apiTokenResponse.token;

      const updatedAuth = new SimpleAuthentication(newAPIToken);
      const updatedWSO = wso.updateAuth(updatedAuth);
      configureInterceptors(updatedWSO);

      updateIdenToken(newIdenToken);
      updateAPIToken(newAPIToken);
      updateWSO(updateWSO);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  /**
   * Loads the user information into the store based on the token. The
   * loading process will only be complete if we are able to get the user information,
   * and will be abandoned otherwise.
   * This is made into an async function to be a non-blocking operation for the rest
   * of the screen rendering.
   * @param {string} identityToken user identity token
   */
  const loadUserInfo = async (identityToken) => {
    // Only update the token and user if we are able to get the user response;
    try {
      // update default WSO wso with the persisted token,
      // and update the persisted token to extend expiry
      const apiTokenResponse = await wso.authService.getAPIToken(identityToken);
      const newAPIToken = apiTokenResponse.token;

      const auth = new SimpleAuthentication(newAPIToken);
      const updatedWSO = wso.updateAuth(auth);
      configureInterceptors(updatedWSO);

      const userResponse = await updatedWSO.userService.getUser("me");
      updateUser(userResponse.data);
      updateAPIToken(newAPIToken);
      updateWSO(updatedWSO);
    } catch (error) {
      // do nothing
    }
  };

  useEffect(() => {
    const randomWSO = async () => {
      if (document.title === "WSO: Williams Students Online") {
        try {
          const wsoResponse = await wso.miscService.getWords();
          document.title = `WSO: ${wsoResponse.data}`;
        } catch {
          // do nothing
        }
      }
    };

    const initialize = async () => {
      const persistedSchedulerOptions = loadState("schedulerOptions");
      updateSchedulerState(persistedSchedulerOptions);

      const persistedToken = loadState("state").authState.identityToken;
      if (persistedToken) {
        await loadUserInfo(persistedToken);
      } else {
        await loadIPAPI();
      }
    };

    initialize();
    randomWSO();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mainBody = () => {
    if (!route) {
      return null;
    }

    const topRouteName = route.name.split(".")[0];

    switch (topRouteName) {
      case "home":
        return <Homepage />;
      case "about":
        return <About />;
      case "scheduler":
        return <Scheduler />;
      case "facebook":
        return <FacebookMain />;
      case "dormtrak":
        return <DormtrakMain />;
      case "factrak":
        return <FactrakMain />;
      case "faq":
        return <FAQ />;
      case "login":
        return <Login />;
      case "ephmatch":
        return <EphmatchMain />;
      case "bulletins":
        return <BulletinMain />;
      case "discussions":
        return <DiscussionMain />;
      case "logout":
        removeCreds();
        // Remove credentials from localStorage, since after logging out the edits will be done in
        // sessionStorage instead.
        removeStateFromStorage("state");
        loadIPAPI();
        navigateTo("home");
        return null;
      case "403":
        return <FourOhThree />;
      case "404":
        return <FourOhFour />;
      default:
        return <FourOhFour />;
    }
  };

  return (
    <Layout>
      <Suspense fallback={null}>{mainBody()}</Suspense>
    </Layout>
  );
};

App.propTypes = {
  wso: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  removeCreds: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
  updateAPIToken: PropTypes.func.isRequired,
  updateIdenToken: PropTypes.func.isRequired,
  updateSchedulerState: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  updateWSO: PropTypes.func.isRequired,
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("");

  return (state) => ({
    wso: getWSO(state),
    expiry: getExpiry(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location) => dispatch(actions.navigateTo(location)),
  removeCreds: () => dispatch(doRemoveCreds()),
  updateAPIToken: (token) => dispatch(doUpdateAPIToken(token)),
  updateSchedulerState: (newState) =>
    dispatch(doUpdateSchedulerState(newState)),
  updateIdenToken: (token) => dispatch(doUpdateIdentityToken(token)),
  updateUser: (newUser) => dispatch(doUpdateUser(newUser)),
  updateWSO: (wso) => dispatch(doUpdateWSO(wso)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
