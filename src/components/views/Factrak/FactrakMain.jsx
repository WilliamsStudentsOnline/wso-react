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

// Redux/ Router imports
import { connect } from "react-redux";
import { createRouteNodeSelector, actions } from "redux-router5";
import { getAPIToken } from "../../../selectors/auth";

// Additional Imports
import { scopes, containsScopes } from "../../../lib/general";

const FactrakMain = ({ route, token }) => {
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

  // Returns body only if the user has the respective scopes
  if (
    !containsScopes(token, [
      scopes.ScopeFactrakFull,
      scopes.ScopeFactrakAdmin,
      scopes.ScopeFactrakLimited,
    ])
  ) {
    return (
      <FactrakLayout>
        <FactrakPolicy />
      </FactrakLayout>
    );
  }

  return <FactrakLayout>{factrakBody()}</FactrakLayout>;
};

FactrakMain.propTypes = {
  route: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("factrak");

  return (state) => ({
    token: getAPIToken(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FactrakMain);
