// React imports
import React from "react";
import PropTypes from "prop-types";

// Component Imports
import "./stylesheets/Application.css";
import Layout from "./Layout";
import Homepage from "./Homepage";
import About from "./views/Misc/About";
import Listserv from "./views/Misc/Listserv";
import Scheduler from "./views/CourseScheduler/Scheduler";
import FacebookMain from "./views/Facebook/FacebookMain";
import DormtrakMain from "./views/Dormtrak/DormtrakMain";
import FactrakMain from "./views/Factrak/FactrakMain";
import EphcatchMain from "./views/Ephcatch/EphcatchMain";
import FourOhFour from "./views/Errors/FourOhFour";
import Login from "./Login";
import FourOhThree from "./views/Errors/FourOhThree";
import BulletinMain from "./views/BulletinsDiscussions/BulletinMain";
import DiscussionMain from "./views/BulletinsDiscussions/DiscussionMain";
import BuildingHours from "./views/Misc/BuildingHours";

// Redux/routing
import { connect } from "react-redux";
import { createRouteNodeSelector, actions } from "redux-router5";
import { getToken, getExpiry, getCurrUser } from "../selectors/auth";
import { doRemoveCreds, doUpdateToken } from "../actions/auth";

// Additional Imports
import { tokenExpiryHandler, getCampusToken } from "../api/auth";
import { getRandomWSO } from "../api/misc";
import { checkAndHandleError } from "../lib/general";

const App = ({
  route,
  navigateTo,
  removeCreds,
  updateToken,
  token,
  expiry,
  currUser,
}) => {
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
      case "listserv":
        return <Listserv />;
      case "hours":
        return <BuildingHours />;
      case "scheduler":
        return <Scheduler />;
      case "facebook":
        return <FacebookMain />;
      case "dormtrak":
        return <DormtrakMain />;
      case "factrak":
        return <FactrakMain />;
      case "login":
        if (!currUser) {
          return <Login />;
        }
        navigateTo("home");
        return null;
      case "ephcatch":
        return <EphcatchMain />;
      case "bulletins":
        return <BulletinMain />;
      case "discussions":
        return <DiscussionMain />;
      case "logout":
        removeCreds();
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
    if (token && expiry) {
      // Checks if the token can be refreshed, refreshes if necessary
      const refresh = await tokenExpiryHandler(token, expiry);
      if (refresh) return;
    }

    // If the token does not exist, get a token based on whether user is on campus.
    const campusResponse = await getCampusToken();

    if (checkAndHandleError(campusResponse)) {
      updateToken(campusResponse.data.data);
    }
  };

  initialize();
  randomWSO();

  return <Layout>{mainBody()}</Layout>;
};

App.propTypes = {
  route: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  removeCreds: PropTypes.func.isRequired,
  updateToken: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  expiry: PropTypes.number.isRequired,
  currUser: PropTypes.object,
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
