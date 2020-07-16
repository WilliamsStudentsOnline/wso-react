// React imports
import React from "react";
import PropTypes from "prop-types";
import PostBoardLayout from "./PostBoardLayout";
import PostBoardIndex from "./PostBoardIndex";
// import PostBoardIndex from "./PostBoardIndex";
// import PostBoardShow from "./PostBoardShow";
// import PostBoardForm from "./PostBoardForm";

// Redux imports
import { connect } from "react-redux";

// External Imports
import { createRouteNodeSelector } from "redux-router5";
import DiscussionShow from "../Discussions/DiscussionShow";
// import { getAPIToken } from "../selectors/auth";

const PostBoardMain = ({ route }) => {
  console.log("hi");
  const PostBoardBody = () => {
    const splitRoute = route.name.split(".");

    if (splitRoute.length < 2) {
      return <PostBoardIndex />;
    }

    console.log(route.name);
    if (route.name === "discussions.show") {
      console.log("hey");
      return <DiscussionShow />;
    }

    return <PostBoardIndex />;
  };

  return <PostBoardLayout>{PostBoardBody()}</PostBoardLayout>;
};

PostBoardMain.propTypes = {
  route: PropTypes.object.isRequired,
};

PostBoardMain.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("");
  const routeNodeSelectorD = createRouteNodeSelector("discussions");

  return (state) => ({
    // token: getAPIToken(state),
    ...routeNodeSelector(state),
    ...routeNodeSelectorD(state),
  });
};

export default connect(mapStateToProps)(PostBoardMain);
