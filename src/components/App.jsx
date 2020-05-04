// React imports
import React, { Suspense, lazy, useState, useEffect } from "react";
import PropTypes from "prop-types";

// Component Imports
import "./stylesheets/Application.css";
import Layout from "./Layout";
import Homepage from "./Homepage";

// Redux/routing
import { connect } from "react-redux";
import { createRouteNodeSelector, actions } from "redux-router5";
import { getToken, getExpiry, getCurrUser, getAPI } from "../selectors/auth";
import {
  doRemoveCreds,
  doUpdateToken,
  doUpdateUser,
  doUpdateAPI,
} from "../actions/auth";

// Additional Imports
import { SimpleAuthentication } from "wso-api-client";

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
  currUser,
  navigateTo,
  removeCreds,
  route,
  token,
  updateAPI,
  updateToken,
  updateUser,
}) => {
  const [didGetToken, updateDidGetToken] = useState(false);

  // returns API based on IP address
  const getIPAPI = async () => {
    try {
      const tokenResponse = await api.authService.loginV1({ useIP: true });
      const newToken = tokenResponse.data;
      const updatedAuth = new SimpleAuthentication(newToken);

      updateAPI(api.updateAuth(updatedAuth));
      updateToken(newToken);
      // eslint-disable-next-line no-empty
    } catch {}
  };

  useEffect(() => {
    const randomWSO = async () => {
      if (document.title === "WSO: Williams Students Online") {
        try {
          const wsoResponse = await api.miscService.getWords();
          document.title = `WSO: ${wsoResponse.data}`;
        } catch {
          // eslint-disable-next-line no-empty
        }
      }
    };

    // TODO update the case where there is a token
    // Refreshes the token
    const initialize = async () => {
      if (token && didGetToken) return;

      if (token && !didGetToken) {
        try {
          const updatedTokenResponse = await api.authService.updateTokenV1(
            token
          );

          updateDidGetToken(true);
          updateToken(updatedTokenResponse.data);
          const updatedUserResponse = await api.userService.getUser("me");

          updateUser(updatedUserResponse.data);
        } catch {
          // eslint-disable-next-line no-empty
        }
        return;
      }

      // If we're here, it must mean that the user is not authenticated.
      await getIPAPI();
    };

    initialize();
    randomWSO();
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
        if (!currUser) {
          return <Login />;
        }
        navigateTo("home");
        return null;
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
        getIPAPI();
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
  currUser: PropTypes.object,
  navigateTo: PropTypes.func.isRequired,
  removeCreds: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  updateAPI: PropTypes.func.isRequired,
  updateToken: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
};

App.defaultProps = {
  currUser: null,
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("");

  return (state) => ({
    token: getToken(state),
    expiry: getExpiry(state),
    currUser: getCurrUser(state),
    api: getAPI(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location) => dispatch(actions.navigateTo(location)),
  removeCreds: () => dispatch(doRemoveCreds()),
  updateToken: (token) => dispatch(doUpdateToken(token)),
  updateUser: (user) => dispatch(doUpdateUser(user)),
  updateAPI: (api) => dispatch(doUpdateAPI(api)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
