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
import {
  bulletinTypeLostAndFound,
  bulletinTypeJob,
  bulletinTypeRide,
  bulletinTypeExchange,
  bulletinTypeAnnouncement,
} from "../../constants/general";
// import { getAPIToken } from "../selectors/auth";

const PostBoardMain = ({ route }) => {
  const PostBoardBody = () => {
    return <PostBoardIndex />;
    // const splitRoute = route.name.split(".");

    // if (splitRoute.length < 2) {
    //   return <PostBoardIndex type={postBoardType} />;
    // }

    // switch (splitRoute[1]) {
    //   case "show":
    //     return <PostBoardShow />;
    //   case "new":
    //   case "edit":
    //     return <PostBoardForm />;
    //   default:
    //     return <PostBoardIndex type={postBoardType} />;
    // }
  };

  // Check that the type is valid
  const validPostBoardTypes = [
    bulletinTypeLostAndFound,
    bulletinTypeJob,
    bulletinTypeRide,
    bulletinTypeExchange,
    bulletinTypeAnnouncement,
  ];

  if (
    validPostBoardTypes.indexOf(route.params?.type) !== -1 ||
    route.name === "discussions"
  ) {
    return <PostBoardLayout>{PostBoardBody()}</PostBoardLayout>;
  }

  return null;
};

PostBoardMain.propTypes = {
  route: PropTypes.object.isRequired,
};

PostBoardMain.defaultProps = {};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("bulletins");

  return (state) => ({
    // token: getAPIToken(state),
    ...routeNodeSelector(state),
  });
};

export default connect(mapStateToProps)(PostBoardMain);
