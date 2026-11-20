import React from "react";
import { Navigate, useParams } from "react-router";

const DiscussionShow = () => {
  const { discussionID } = useParams();
  return <Navigate to={`/bulletin/discussions/${discussionID}`} replace />;
};

export default DiscussionShow;
