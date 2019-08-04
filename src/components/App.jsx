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
import Facebook from "./Facebook";
import DormtrakIndex from "./DormtrakIndex";
import FactrakMain from "./FactrakMain";
import Login from "./Login";

// Redux/routing
import { connect } from "react-redux";
import { createRouteNodeSelector, actions } from "redux-router5";
import BuildingHours from "./BuildingHours";
import { getToken } from "../selectors/auth";

// Additional Imports
import wordFile from "../constants/words.json";
import { initializeSession, removeTokens } from "../api/utils";

const App = ({ route, navigateTo, token }) => {
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
        return <Facebook />;
      case "dormtrak":
        return <DormtrakIndex />;
      case "factrak":
        return <FactrakMain />;
      case "login":
        return <Login />;
      case "logout":
        removeTokens();
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

  const initialize = async () => {
    const response = await initializeSession();
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
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location) => dispatch(actions.navigateTo(location)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
