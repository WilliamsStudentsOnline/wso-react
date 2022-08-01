// React imports
import React from "react";
import PropTypes from "prop-types";

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
import RequireScope from "../../../router-permissions";

const DiscussionMain = ({ token }) => {
  return (
    <DiscussionLayout>
      <Routes>
        <Route
          index
          element={
            <RequireScope token={token} name="discussions">
              <DiscussionIndex />
            </RequireScope>
          }
        />
        <Route path="threads/:discussionID" element={<DiscussionShow />} />
        <Route
          path="new"
          element={
            <RequireScope token={token} name="discussions.new">
              <DiscussionNew />
            </RequireScope>
          }
        />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </DiscussionLayout>
  );
};

DiscussionMain.propTypes = {
  token: PropTypes.string.isRequired,
};

DiscussionMain.defaultProps = {};

const mapStateToProps = () => {
  return (state) => ({
    token: getAPIToken(state),
  });
};

export default connect(mapStateToProps)(DiscussionMain);
