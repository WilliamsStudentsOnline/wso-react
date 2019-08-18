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

// Redux/routing
import { connect } from "react-redux";
import { createRouteNodeSelector, actions } from "redux-router5";
import BuildingHours from "./views/Misc/BuildingHours";
import { getToken, getExpiry } from "../selectors/auth";
import { doRemoveCreds, doUpdateToken } from "../actions/auth";

// Additional Imports
import wordFile from "../constants/words.json";
import { tokenExpiryHandler, getCampusToken } from "../api/auth";
import { checkAndHandleError } from "../lib/general";

const App = ({
  route,
  navigateTo,
  removeCreds,
  updateToken,
  token,
  expiry,
}) => {
  const randomWSO = () => {
    if (wordFile) {
      const w = wordFile.w[Math.floor(Math.random() * wordFile.w.length)];
      const s = wordFile.s[Math.floor(Math.random() * wordFile.s.length)];
      const o = wordFile.o[Math.floor(Math.random() * wordFile.o.length)];

      return `WSO: ${w} ${s} ${o}`;
    }

    // Return default if wordFile not found
    return "WSO: Williams Students Online";
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
        return <Login />;
      case "ephcatch":
        return <EphcatchMain />;
      case "logout":
        removeCreds();
        navigateTo("home");
        return null;
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

    const campusResponse = await getCampusToken();

    if (checkAndHandleError(campusResponse)) {
      updateToken(campusResponse.data.data);
    }
  };

  initialize();
  document.title = randomWSO();

  return <Layout>{mainBody()}</Layout>;
};

App.propTypes = {
  route: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  removeCreds: PropTypes.func.isRequired,
  updateToken: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  expiry: PropTypes.string.isRequired,
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("");

  return (state) => ({
    token: getToken(state),
    expiry: getExpiry(state),
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
