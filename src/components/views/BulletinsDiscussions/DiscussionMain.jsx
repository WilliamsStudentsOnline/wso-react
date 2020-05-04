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
import { createRouteNodeSelector } from "redux-router5";

// External Imports
import { getToken } from "../../../selectors/auth";

const DiscussionMain = ({ route }) => {
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
        return <DiscussionIndex />;
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
};

DiscussionMain.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("discussions");

  return (state) => ({
    token: getToken(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(DiscussionMain);
