import React from "react";
import { Navigate } from "react-router-dom";

/** Discussions live in the unified bulletin feed. */
const DiscussionIndex = () => (
  <Navigate to="/bulletins?types=discussions" replace />
);

export default DiscussionIndex;
