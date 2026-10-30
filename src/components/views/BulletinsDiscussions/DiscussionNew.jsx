import React from "react";
import { Navigate } from "react-router-dom";

/** Create discussions via the unified new-post form. */
const DiscussionsNew = () => (
  <Navigate to="/bulletins/new?type=discussions" replace />
);

export default DiscussionsNew;
