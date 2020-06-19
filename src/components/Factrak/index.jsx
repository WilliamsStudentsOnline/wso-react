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
import FactrakSearch from "./FactrakSearch";
import Redirect from "../common/Redirect";

// Redux/ Router imports
import { connect } from "react-redux";
import { createRouteNodeSelector } from "redux-router5";
import { getAPIToken, getCurrUser } from "../../selectors/auth";

// Additional Imports
import { scopes, containsOneOfScopes } from "../../lib/general";
import { userTypeStudent } from "../../constants/general";

const FactrakMain = ({ currUser, route, token }) => {
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
      case "search":
        return <FactrakSearch />;
      default:
        return <FactrakHome />;
    }
  };

  // If the user is not a student - navigate to 403
  if (currUser?.type !== userTypeStudent) {
    return <Redirect to="403" />;
  }

  // Returns body only if the user has the respective scopes
  if (!containsOneOfScopes(token, [scopes.ScopeFactrakFull])) {
    return (
      <FactrakLayout>
        <FactrakPolicy />
      </FactrakLayout>
    );
  }

  return <FactrakLayout>{factrakBody()}</FactrakLayout>;
};

FactrakMain.propTypes = {
  currUser: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("factrak");

  return (state) => ({
    currUser: getCurrUser(state),
    token: getAPIToken(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(FactrakMain);
