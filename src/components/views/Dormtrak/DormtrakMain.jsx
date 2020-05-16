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

// Redux/ Routing imports
import { connect } from "react-redux";
import { createRouteNodeSelector } from "redux-router5";
import { getAPIToken } from "../../../selectors/auth";

// Additional Imports
import { containsScopes, scopes } from "../../../lib/general";

const DormtrakMain = ({ route, token }) => {
  const dormtrakBody = () => {
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

  if (
    !containsScopes(token, [
      scopes.ScopeDormtrak,
      scopes.ScopeDormtrakWrite,
      scopes.ScopeAdminAll,
    ])
  ) {
    return (
      <DormtrakLayout>
        <DormtrakPolicy />
      </DormtrakLayout>
    );
  }
  return <DormtrakLayout>{dormtrakBody()}</DormtrakLayout>;
};

DormtrakMain.propTypes = {
  route: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

DormtrakMain.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("dormtrak");

  return (state) => ({
    token: getAPIToken(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(DormtrakMain);
