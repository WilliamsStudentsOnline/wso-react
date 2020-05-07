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
import { getAPI, getExpiry } from "../selectors/auth";
import {
  doRemoveCreds,
  doUpdateAPI,
  doUpdateToken,
  doUpdateUser,
} from "../actions/auth";
import { doUpdateSchedulerState } from "../actions/schedulerUtils";

// Additional Imports
import { SimpleAuthentication } from "wso-api-client";
import { loadState } from "../loadState";

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
  api,
  navigateTo,
  removeCreds,
  route,
  updateAPI,
  updateSchedulerState,
  updateToken,
  updateUser,
}) => {
  // returns API based on IP address
  const loadIPAPI = async () => {
    try {
      const tokenResponse = await api.authService.loginV1({ useIP: true });
      const newToken = tokenResponse.token;
      const updatedAuth = new SimpleAuthentication(newToken);

      updateAPI(api.updateAuth(updatedAuth));
      updateToken(newToken);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  /**
   * Loads the user information into the store based on the token. The
   * loading process will only be complete if we are able to get the user information,
   * and will be abandoned otherwise.
   * This is made into an async function to be a non-blocking operation for the rest
   * of the screen rendering.
   * @param {string} token user token
   */
  const loadUserInfo = async (token) => {
    // Only update the token and user if we are able to get the user response;
    try {
      // update default WSO API with the persisted token,
      // and update the persisted token to extend expiry
      const auth = new SimpleAuthentication(token);
      const currAPI = api.updateAuth(auth);
      const updatedTokenResponse = await currAPI.authService.updateTokenV1(
        token
      );
      const updatedToken = updatedTokenResponse.token;

      const updatedAuth = new SimpleAuthentication(updatedToken);
      const updatedAPI = currAPI.updateAuth(updatedAuth);
      const userResponse = await updatedAPI.userService.getUser("me");
      updateUser(userResponse.data);
      updateAPI(updatedAPI);
      updateToken(updatedToken);
    } catch (error) {
      // do nothing
    }
  };

  useEffect(() => {
    const randomWSO = async () => {
      if (document.title === "WSO: Williams Students Online") {
        try {
          const wsoResponse = await api.miscService.getWords();
          document.title = `WSO: ${wsoResponse.data}`;
        } catch {
          // do nothing
        }
      }
    };

    const initialize = async () => {
      const persistedSchedulerOptions = loadState("schedulerOptions");
      updateSchedulerState(persistedSchedulerOptions);

      const persistedToken = loadState("token");
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
        localStorage.removeItem("state");
        loadIPAPI();
        navigateTo("home");
        return null;
      case "403":
        return <FourOhThree />;
      default:
        return <FourOhFour />;
    }
  };

  return (
    <Layout>
      <Suspense fallback={<div>&nbsp;</div>}>{mainBody()}</Suspense>
    </Layout>
  );
};

App.propTypes = {
  api: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  removeCreds: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
  updateAPI: PropTypes.func.isRequired,
  updateToken: PropTypes.func.isRequired,
  updateSchedulerState: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("");

  return (state) => ({
    api: getAPI(state),
    expiry: getExpiry(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location) => dispatch(actions.navigateTo(location)),
  removeCreds: () => dispatch(doRemoveCreds()),
  updateAPI: (api) => dispatch(doUpdateAPI(api)),
  updateSchedulerState: (newState) =>
    dispatch(doUpdateSchedulerState(newState)),
  updateToken: (token) => dispatch(doUpdateToken(token)),
  updateUser: (newUser) => dispatch(doUpdateUser(newUser)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
