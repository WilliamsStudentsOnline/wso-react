// React imports
import React from "react";
import PropTypes from "prop-types";
import PostBoardLayout from "./PostBoardLayout";
import PostBoardIndex from "./PostBoardIndex";
import PostBoardShow from "./PostBoardShow";
import Redirect from "../common/Redirect";
// import PostBoardForm from "./PostBoardForm";

// Redux imports
import { connect } from "react-redux";

// External Imports
import { createRouteNodeSelector } from "redux-router5";

const PostBoardMain = ({ route }) => {
  const PostBoardBody = () => {
    const splitRoute = route.name.split(".");

    if (splitRoute.length < 2) {
      return <PostBoardIndex />;
    }

    switch (splitRoute[1]) {
      case "show":
        return <PostBoardShow />;
      default:
        return <Redirect to="404" />;
    }
  };

  return <PostBoardLayout>{PostBoardBody()}</PostBoardLayout>;
};

PostBoardMain.propTypes = {
  route: PropTypes.object.isRequired,
};

PostBoardMain.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("bulletins");

  return (state) => ({
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(PostBoardMain);
