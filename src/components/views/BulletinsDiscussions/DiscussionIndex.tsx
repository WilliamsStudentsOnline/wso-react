import React from "react";
import { Navigate } from "react-router-dom";

const DiscussionIndex = () => (
  <Navigate to="/bulletin?types=discussions" replace />
);

export default DiscussionIndex;
