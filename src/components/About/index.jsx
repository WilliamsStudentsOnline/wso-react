// React imports
import React from "react";
import PropTypes from "prop-types";
import AboutHome from "./AboutHome";
import AboutLayout from "./AboutLayout";
import AboutTeam from "./AboutTeam";

// Redux/Routing imports
import { connect } from "react-redux";
import { createRouteNodeSelector } from "redux-router5";

const AboutMain = ({ route }) => {
  const AboutBody = () => {
    switch (route.name) {
      case "about.team":
        return <AboutTeam />;
      default:
        return <AboutHome />;
    }
  };

  return <AboutLayout>{AboutBody()}</AboutLayout>;
};

AboutMain.propTypes = {
  route: PropTypes.object.isRequired,
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("about");

  return (state) => ({
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(AboutMain);
