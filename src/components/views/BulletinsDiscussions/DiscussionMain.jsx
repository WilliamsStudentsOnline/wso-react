// React imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import DiscussionLayout from "./DiscussionLayout";
import DiscussionShow from "./DiscussionShow";
import DiscussionPost from "./DiscussionPost";
import DiscussionIndex from "./DiscussionIndex";
import DiscussionNew from "./DiscussionNew";

// Redux/Routing imports
import { connect } from "react-redux";
import { createRouteNodeSelector, actions } from "redux-router5";
import { getCurrUser } from "../../../selectors/auth";

const DiscussionMain = ({ route, navigateTo, currUser }) => {
  const DiscussionBody = () => {
    if (!currUser) {
      navigateTo("login");
      return null;
    }

    const splitRoute = route.name.split(".");

    if (splitRoute.length < 2) {
      return <DiscussionIndex />;
    }

    switch (splitRoute[1]) {
      case "show":
        return <DiscussionShow />;
      case "posts":
        return <DiscussionPost />;
      case "new":
        return <DiscussionNew />;
      default:
        navigateTo("discussion");
        return null;
    }
  };

  return (
    <DiscussionLayout type={route.params.type}>
      {DiscussionBody(route.params.type)}
    </DiscussionLayout>
  );
};

DiscussionMain.propTypes = {
  route: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  currUser: PropTypes.object.isRequired,
};

DiscussionMain.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("discussions");

  return (state) => ({
    currUser: getCurrUser(state),
    ...routeNodeSelector(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionMain);
