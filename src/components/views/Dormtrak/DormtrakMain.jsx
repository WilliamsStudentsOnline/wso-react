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
import { createRouteNodeSelector, actions } from "redux-router5";
import { getToken } from "../../../selectors/auth";

// Additional Imports
import { containsScopes, scopes, getTokenLevel } from "../../../lib/general";

const DormtrakMain = ({ route, token, navigateTo }) => {
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
    containsScopes(token, [
      scopes.ScopeDormtrak,
      scopes.ScopeDormtrakWrite,
      scopes.ScopeAdminAll,
    ])
  ) {
    return <DormtrakLayout>{dormtrakBody()}</DormtrakLayout>;
  }

  if (getTokenLevel(token) > 2) {
    return (
      <DormtrakLayout>
        <DormtrakPolicy />
      </DormtrakLayout>
    );
  }

  navigateTo("login");
  return null;
};

DormtrakMain.propTypes = {
  route: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  navigateTo: PropTypes.func.isRequired,
};

DormtrakMain.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("dormtrak");

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
)(DormtrakMain);
