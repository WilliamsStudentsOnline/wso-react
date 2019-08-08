// React imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import FactrakHome from "./FactrakHome";
import FactrakPolicy from "./FactrakPolicy";
import FactrakModerate from "./FactrakModerate";
import FactrakSurveyIndex from "./FactrakSurveyIndex";
import FactrakSurvey from "./FactrakSurvey";
import FactrakLayout from "./FactrakLayout";
import FactrakAOS from "./FactrakAOS";
import FactrakCourse from "./FactrakCourse";
import FactrakProfessor from "./FactrakProfessor";

// Redux imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

// External Imports
import { createRouteNodeSelector } from "redux-router5";

const FactrakMain = ({ route }) => {
  const factrakBody = () => {
    const splitRoute = route.name.split(".");
    if (splitRoute.length === 1) return <FactrakHome />;

    switch (splitRoute[1]) {
      case "policy":
        return <FactrakPolicy />;
      case "surveys":
        return <FactrakSurveyIndex />;
      case "newSurvey":
        return <FactrakSurvey edit={false} />;
      case "editSurvey":
        return <FactrakSurvey edit />;
      case "moderate":
        return <FactrakModerate />;
      case "areasOfStudy":
        return <FactrakAOS />;
      case "courses":
        return <FactrakCourse />;
      case "professors":
        return <FactrakProfessor />;
      default:
        return <FactrakHome />;
    }
  };

  return <FactrakLayout>{factrakBody()}</FactrakLayout>;
};

FactrakMain.propTypes = {
  route: PropTypes.object.isRequired,
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("factrak");

  return (state) => ({
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(FactrakMain);
