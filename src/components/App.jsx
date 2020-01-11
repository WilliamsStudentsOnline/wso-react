// React imports
import React, { Suspense, lazy, useState } from "react";
import PropTypes from "prop-types";

// Component Imports
import "./stylesheets/Application.css";
import Layout from "./Layout";
import Homepage from "./Homepage";

// Redux/routing
import { connect } from "react-redux";
import { createRouteNodeSelector, actions } from "redux-router5";
import { getToken, getExpiry, getCurrUser } from "../selectors/auth";
import { doRemoveCreds, doUpdateToken, doUpdateUser } from "../actions/auth";

// Additional Imports
import { updateTokenAPI, getCampusToken } from "../api/auth";
import { getUser } from "../api/users";
import { getRandomWSO } from "../api/misc";
import { checkAndHandleError } from "../lib/general";

// More component imports
const Scheduler = lazy(() => import("./views/CourseScheduler/Scheduler"));
const About = lazy(() => import("./views/Misc/About"));
const FAQ = lazy(() => import("./views/Misc/FAQ"));
const FacebookMain = lazy(() => import("./views/Facebook/FacebookMain"));
const DormtrakMain = lazy(() => import("./views/Dormtrak/DormtrakMain"));
const FactrakMain = lazy(() => import("./views/Factrak/FactrakMain"));
const EphcatchMain = lazy(() => import("./views/Ephcatch/EphcatchMain"));
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
  route,
  navigateTo,
  removeCreds,
  updateToken,
  token,
  currUser,
  updateUser,
}) => {
  const [didGetToken, updateDidGetToken] = useState(false);

  const randomWSO = async () => {
    if (document.title !== "WSO: Williams Students Online") {
      const wsoResponse = await getRandomWSO();

      if (checkAndHandleError(wsoResponse)) {
        document.title = `WSO: ${wsoResponse.data.data}`;
      }
      // Return default if there is an error in the response.
      else document.title = "WSO: Williams Students Online";
    }
  };

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
      case "ephcatch":
        return <EphcatchMain />;
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
        navigateTo("home");
        return null;
      case "403":
        return <FourOhThree />;
      default:
        return <FourOhFour />;
    }
  };

  // Refreshes the token
  const initialize = async () => {
    if (token && didGetToken) return;

    if (token && !didGetToken) {
      const updatedTokenResponse = await updateTokenAPI(token);
      console.log(updatedTokenResponse);
      updateDidGetToken(true);
      if (checkAndHandleError(updatedTokenResponse)) {
        updateToken(updatedTokenResponse.data.data);
        const updatedUserResponse = await getUser(token);
        console.log(updatedUserResponse);
        if (checkAndHandleError(updatedUserResponse)) {
          updateUser(updatedUserResponse.data.data);
        }
      }
    }

    // If the token does not exist, get a token based on whether user is on campus.
    const campusResponse = await getCampusToken();

    if (checkAndHandleError(campusResponse)) {
      updateToken(campusResponse.data.data);
      updateUser(null);
    }
  };

  initialize();
  randomWSO();

  return (
    <Layout>
      <Suspense fallback={<div>&nbsp;</div>}>{mainBody()}</Suspense>
    </Layout>
  );
};

App.propTypes = {
  route: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  removeCreds: PropTypes.func.isRequired,
  updateToken: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  currUser: PropTypes.object,
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
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location) => dispatch(actions.navigateTo(location)),
  removeCreds: () => dispatch(doRemoveCreds()),
  updateToken: (token) => dispatch(doUpdateToken(token)),
  updateUser: (user) => dispatch(doUpdateUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
