import React from "react";
import { Navigate } from "react-router";

const DiscussionsNew = () => (
  <Navigate to="/bulletin/new?type=discussions" replace />
);

export default DiscussionsNew;
