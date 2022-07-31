// React imports
import React from "react";

// Component imports
import DiscussionLayout from "./DiscussionLayout";
import DiscussionShow from "./DiscussionShow";
import DiscussionIndex from "./DiscussionIndex";
import DiscussionNew from "./DiscussionNew";
import Error404 from "../Errors/Error404";

// Redux/Routing imports
import { connect } from "react-redux";
import { Routes, Route } from "react-router-dom";

// External Imports
import { getAPIToken } from "../../../selectors/auth";

const DiscussionMain = () => {
  return (
    <DiscussionLayout>
      <Routes>
        <Route index element={<DiscussionIndex />} />
        <Route path="threads/:discussionID" element={<DiscussionShow />} />
        <Route path="new" element={<DiscussionNew />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </DiscussionLayout>
  );
};

DiscussionMain.defaultProps = {};

const mapStateToProps = () => {
  return (state) => ({
    token: getAPIToken(state),
  });
};

export default connect(mapStateToProps)(DiscussionMain);
