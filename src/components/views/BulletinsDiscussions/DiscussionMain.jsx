// React imports
import React from "react";

// Component imports
import DiscussionLayout from "./DiscussionLayout";
import DiscussionShow from "./DiscussionShow";
import DiscussionIndex from "./DiscussionIndex";
import DiscussionNew from "./DiscussionNew";
import Error404 from "../Errors/Error404";

// Redux/Routing imports
import { useAppSelector } from "../../../lib/store";
import { getAPIToken } from "../../../lib/authSlice";
import { Routes, Route } from "react-router-dom";

// External Imports
import RequireScope from "../../../router-permissions";

const DiscussionMain = () => {
  const token = useAppSelector(getAPIToken);

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
        <Route
          path="threads/:discussionID"
          element={
            <RequireScope token={token} name="discussions">
              <DiscussionShow />
            </RequireScope>
          }
        />
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

export default DiscussionMain;
