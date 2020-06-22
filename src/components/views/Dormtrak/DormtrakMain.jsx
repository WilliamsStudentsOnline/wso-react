// React imports
import React from "react";
import PropTypes from "prop-types";
import DormtrakHome from "./DormtrakHome";
import DormtrakLayout from "./DormtrakLayout";
import DormtrakPolicy from "./DormtrakPolicy";
import DormtrakShow from "./DormtrakShow";
import DormtrakSearch from "./DormtrakSearch";
import DormtrakNeighborhood from "./DormtrakNeighborhood";
import DormtrakReviewForm from "./DormtrakReviewForm";
import Redirect from "../../Redirect";

// Redux/ Routing imports
import { connect } from "react-redux";
import { createRouteNodeSelector } from "redux-router5";
import { getAPIToken, getCurrUser } from "../../../selectors/auth";

// Additional Imports
import { containsOneOfScopes, scopes } from "../../../lib/general";
import { userTypeStudent } from "../../../constants/general";

const DormtrakMain = ({ currUser, route, token }) => {
  const dormtrakBody = () => {
    if (
      route.name !== "dormtrak.policy" &&
      !containsOneOfScopes(token, [
        scopes.ScopeDormtrak,
        scopes.ScopeDormtrakWrite,
      ])
    ) {
      return <Redirect to="dormtrak.policy" />;
    }

    const splitRoute = route.name.split(".");
    if (splitRoute.length === 1) return <DormtrakHome />;

    switch (splitRoute[1]) {
      case "policy":
        return <DormtrakPolicy />;
      case "neighborhoods":
        return <DormtrakNeighborhood />;
      case "dorms":
        return <DormtrakShow />;
      case "newReview":
        return <DormtrakReviewForm edit={false} />;
      case "editReview":
        return <DormtrakReviewForm edit />;
      case "search":
        return <DormtrakSearch />;
      default:
        return <DormtrakHome />;
    }
  };

  // If the user is not a student - navigate to 403
  if (currUser?.type !== userTypeStudent) {
    return <Redirect to="403" />;
  }

  return <DormtrakLayout>{dormtrakBody()}</DormtrakLayout>;
};

DormtrakMain.propTypes = {
  currUser: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

DormtrakMain.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("dormtrak");

  return (state) => ({
    currUser: getCurrUser(state),
    token: getAPIToken(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(DormtrakMain);
