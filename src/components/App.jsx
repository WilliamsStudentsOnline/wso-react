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
import Factrak from "./Factrak";

// Redux/routing
import { connect } from "react-redux";
import { createRouteNodeSelector } from "redux-router5";
import BuildingHours from "./BuildingHours";

// Additional Imports
import wordFile from "../constants/words.json";
import { initializeToken } from "../api/utils";
import { getAllUsers } from "../api/users";

const App = ({ notice, warning, currentUser, route }) => {
  initializeToken();
  getAllUsers();

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
        return <Factrak />;
      default:
        return <div>whoops</div>;
    }
  };

  document.title = randomWSO();

  return (
    <Layout
      bodyClass="front dormtrak facebook"
      notice={notice}
      warning={warning}
      currentUser={currentUser}
    >
      {mainBody()}
    </Layout>
  );
};

App.propTypes = {
  notice: PropTypes.string,
  warning: PropTypes.string,
  currentUser: PropTypes.object,
  route: PropTypes.object.isRequired,
};

App.defaultProps = {
  notice: "",
  warning: "",
  currentUser: {},
};

export default connect(createRouteNodeSelector(""))(App);
