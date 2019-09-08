// React imports
import React from "react";
import PropTypes from "prop-types";
import DiscussionLayout from "./DiscussionLayout";
import DiscussionShow from "./DiscussionShow";
import DiscussionPost from "./DiscussionPost";
import DiscussionIndex from "./DiscussionIndex";

// Redux imports
import { connect } from "react-redux";

// External Imports
import { createRouteNodeSelector, actions } from "redux-router5";
import DiscussionNew from "./DiscussionNew";

const DiscussionMain = ({ route, navigateTo }) => {
  const DiscussionBody = () => {
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
};

DiscussionMain.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("discussions");

  return (state) => ({
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
