// React imports
import React from "react";
import PropTypes from "prop-types";
import DormtrakHome from "./DormtrakHome";
import DormtrakLayout from "./DormtrakLayout";
import DormtrakPolicy from "./DormtrakPolicy";
import DormtrakShow from "./DormtrakShow";
import DormtrakSearch from "./DormtrakSearch";
import DormtrakNeighborhood from "./DormtrakNeighborhood";

// Redux imports
import { connect } from "react-redux";

// External Imports
import { createRouteNodeSelector, actions } from "redux-router5";
import DormtrakReviewForm from "./DormtrakReviewForm";
import { getToken } from "../../../api/auth";
import { containsScopes, scopes } from "../../../lib/general";

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
    containsScopes(token, [scopes.ScopeDormtrak, scopes.ScopeDormtrakWrite])
  ) {
    return <DormtrakLayout>{dormtrakBody()}</DormtrakLayout>;
  }

  navigateTo("403");
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
