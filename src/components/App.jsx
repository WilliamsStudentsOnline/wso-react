// React imports
import React from "react";
import PropTypes from "prop-types";

// Component Imports
import "./stylesheets/Application.css";
import Layout from "./Layout";
import Homepage from "./Homepage";
import About from "./About";
import Listserv from "./Listserv";

// Redux/routing
import { connect } from "react-redux";
import { createRouteNodeSelector } from "redux-router5";
import BuildingHours from "./BuildingHours";

// Additional Imports
import wordFile from "../constants/words.json";

const App = ({ notice, warning, currentUser, route }) => {
  const randomWSO = () => {
    if (wordFile) {
      let w = wordFile.w[Math.floor(Math.random() * wordFile.w.length)];
      let s = wordFile.s[Math.floor(Math.random() * wordFile.s.length)];
      let o = wordFile.o[Math.floor(Math.random() * wordFile.o.length)];

      return "WSO: " + w + " " + s + "  " + o;
    } else return "WSO: Williams Students Online";

    /*
    words_file = Rails.application.config.words_file
    if File.exist?(words_file)
      words = YAML.load_file(words_file)
      "#{words[:w][rand(words[:w].size)]} #{words[:s][rand(words[:s].size)]} #{words[:o][rand(words[:o].size)]}"
    else
      'Williams Students Online'
    end */
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
      default:
        return <div>whoops</div>;
    }
  };

  document.title = randomWSO();

  return (
    <Layout
      bodyClass="front"
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
  route: PropTypes.object.isRequired
};

App.defaultProps = {
  notice: "",
  warning: "",
  currentUser: {}
};

export default connect(createRouteNodeSelector(""))(App);
