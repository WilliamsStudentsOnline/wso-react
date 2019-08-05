// React imports
import React from "react";
import PropTypes from "prop-types";

// Component Imports
import "./stylesheets/Application.css";
import Layout from "./Layout";
import Homepage from "./Homepage";
import About from "./About";
import Listserv from "./Listserv";
import Scheduler from "./Scheduler";
import FacebookMain from "./views/Facebook/FacebookMain";
import DormtrakIndex from "./DormtrakIndex";
import FactrakMain from "./views/Factrak/FactrakMain";
import Login from "./Login";

// Redux/routing
import { connect } from "react-redux";
import { createRouteNodeSelector, actions } from "redux-router5";
import BuildingHours from "./BuildingHours";
import { getToken, getExpiry } from "../selectors/auth";
import { doRemoveCreds } from "../actions/auth";

// Additional Imports
import wordFile from "../constants/words.json";
import { tokenExpiryHandler } from "../api/auth";

const App = ({ route, navigateTo, token, removeCreds }) => {
  const randomWSO = () => {
    if (wordFile) {
      let w = wordFile.w[Math.floor(Math.random() * wordFile.w.length)];
      let s = wordFile.s[Math.floor(Math.random() * wordFile.s.length)];
      let o = wordFile.o[Math.floor(Math.random() * wordFile.o.length)];

      return "WSO: " + w + " " + s + "  " + o;
    } else return "WSO: Williams Students Online";
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
        return <DormtrakIndex />;
      case "factrak":
        return <FactrakMain />;
      case "login":
        return <Login />;
      case "logout":
        removeCreds();
        navigateTo("home");
        return;
      default:
        return (
          <header>
            <h1>Whoops! Page not found!</h1> 404. Run. Hide. Cease and Desist.
          </header>
        );
    }
  };

  const initialize = async (token, expiry) => {
    if (!token || !expiry) return;
    const response = await tokenExpiryHandler(token, expiry);
    console.log(response);
  };

  initialize();
  document.title = randomWSO();

  return <Layout bodyClass="front dormtrak facebook">{mainBody()}</Layout>;
};

App.propTypes = {
  route: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
