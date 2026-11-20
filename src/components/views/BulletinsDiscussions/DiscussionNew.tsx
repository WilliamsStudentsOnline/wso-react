import React from "react";
import { Navigate } from "react-router-dom";

const DiscussionsNew = () => (
  <Navigate to="/bulletin/new?type=discussions" replace />
);

export default DiscussionsNew;
