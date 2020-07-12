// React imports
import React, { Suspense, lazy, useEffect, useState } from "react";
import PropTypes from "prop-types";

// Component Imports
import Layout from "./Layout/Layout";
import Homepage from "./Homepage";

// Redux/routing
import { connect } from "react-redux";
import { createRouteNodeSelector, actions } from "redux-router5";
import {
  getWSO,
  getExpiry,
  getIdentityToken,
  getAPIToken,
} from "../selectors/auth";
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
import { loadState } from "../stateStorage";
import configureInterceptors from "../lib/auth";
import jwtDecode from "jwt-decode";

// More component imports
const About = lazy(() => import("./About"));
const BulletinMain = lazy(() => import("./Bulletins"));
const DiscussionMain = lazy(() => import("./Discussions"));
const DormtrakMain = lazy(() => import("./Dormtrak"));
const FacebookMain = lazy(() => import("./Facebook"));
const FactrakMain = lazy(() => import("./Factrak"));
const EphmatchMain = lazy(() => import("./Ephmatch"));
const FiveOhOh = lazy(() => import("./Errors/FiveOhOh"));
const FourOhFour = lazy(() => import("./Errors/FourOhFour"));
const FourOhThree = lazy(() => import("./Errors/FourOhThree"));
const Login = lazy(() => import("./Login"));
const Scheduler = lazy(() => import("./CourseScheduler"));

const App = ({
  apiToken,
  identityToken,
  navigateTo,
  route,
  updateAPIToken,
  updateIdenToken,
  updateSchedulerState,
  updateUser,
  updateWSO,
  wso,
}) => {
  const [initialized, setInitialized] = useState(false);

  const getIPIdentityToken = async () => {
    try {
      const tokenResponse = await wso.authService.getIdentityToken({
        useIP: true,
      });
      const newIdenToken = tokenResponse.token;

      updateIdenToken(newIdenToken);
    } catch (error) {
      navigateTo("500");
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
      const persistedSchedulerOptions = loadState("schedulerOptions");
      updateSchedulerState(persistedSchedulerOptions);
      const persistedToken = loadState("state")?.authState?.identityToken;
      if (persistedToken) {
        updateIdenToken(persistedToken);
      } else {
        getIPIdentityToken();
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
    let isMounted = true;
    const updateAPI = async () => {
      if (identityToken !== "") {
        try {
          const apiTokenResponse = await wso.authService.getAPIToken(
            identityToken
          );
          const newAPIToken = apiTokenResponse.token;

          const auth = new SimpleAuthentication(newAPIToken);
          const updatedWSO = wso.updateAuth(auth);
          configureInterceptors(updatedWSO);

          if (isMounted) {
            updateAPIToken(newAPIToken);
            updateWSO(updatedWSO);
          }
        } catch (error) {
          navigateTo("500");
        }
      } else {
        getIPIdentityToken();
      }
    };

    if (initialized) {
      updateAPI();
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identityToken]);

  /**
   * Each time the authentication mechanism/ API is updated, see if we need to update the current
   * user information.
   */
  useEffect(() => {
    let isMounted = true;
    const updateUserInfo = async () => {
      if (apiToken !== "") {
        try {
          const decoded = jwtDecode(apiToken);
          if (decoded?.tokenLevel === 3) {
            const userResponse = await wso.userService.getUser("me");
            if (isMounted) {
              updateUser(userResponse.data);
            }
          }
        } catch (error) {
          navigateTo("500");
        }
      }
    };

    updateUserInfo();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wso]);

  const mainBody = () => {
    const topRouteName = route?.name?.split(".")[0];

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
      case "login":
        return <Login />;
      case "ephmatch":
        return <EphmatchMain />;
      case "bulletins":
        return <BulletinMain />;
      case "discussions":
        return <DiscussionMain />;
      case "403":
        return <FourOhThree />;
      case "404":
        return <FourOhFour />;
      case "500":
        return <FiveOhOh />;
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
  apiToken: PropTypes.string.isRequired,
  identityToken: PropTypes.string.isRequired,
  navigateTo: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
  updateAPIToken: PropTypes.func.isRequired,
  updateIdenToken: PropTypes.func.isRequired,
  updateSchedulerState: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  updateWSO: PropTypes.func.isRequired,
  wso: PropTypes.object.isRequired,
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("");

  return (state) => ({
    apiToken: getAPIToken(state),
    expiry: getExpiry(state),
    identityToken: getIdentityToken(state),
    wso: getWSO(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
  removeCreds: () => dispatch(doRemoveCreds()),
  updateAPIToken: (token) => dispatch(doUpdateAPIToken(token)),
  updateSchedulerState: (newState) =>
    dispatch(doUpdateSchedulerState(newState)),
  updateIdenToken: (token) => dispatch(doUpdateIdentityToken(token)),
  updateUser: (newUser) => dispatch(doUpdateUser(newUser)),
  updateWSO: (wso) => dispatch(doUpdateWSO(wso)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
