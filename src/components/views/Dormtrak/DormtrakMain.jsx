// React imports
import React from "react";
import DormtrakHome from "./DormtrakHome";
import DormtrakLayout from "./DormtrakLayout";
import DormtrakPolicy from "./DormtrakPolicy";
import DormtrakShow from "./DormtrakShow";
import DormtrakSearch from "./DormtrakSearch";
import DormtrakNeighborhood from "./DormtrakNeighborhood";
import DormtrakReviewForm from "./DormtrakReviewForm";
import Error404 from "../Errors/Error404";

// Redux/ Routing imports
import { useAppSelector } from "../../../lib/store";
import { getCurrUser, getAPIToken } from "../../../lib/authSlice";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

// Additional Imports
import { containsOneOfScopes, scopes } from "../../../lib/general";
import { userTypeStudent } from "../../../constants/general";

const DormtrakMain = () => {
  const currUser = useAppSelector(getCurrUser);
  const token = useAppSelector(getAPIToken);
  const navigateTo = useNavigate();

  // Checks for scope. Redirects to policy page if user has not agreed to policy
  const guardedRender = (children) => {
    if (
      !containsOneOfScopes(token, [
        scopes.ScopeDormtrak,
        scopes.ScopeDormtrakWrite,
      ])
    ) {
      return <Navigate to="/dormtrak/policy" replace />;
    }
    return children;
  };

  // If the user is not a student - navigate to 403
  if (currUser?.type !== userTypeStudent) {
    navigateTo("/403");
  }

  return (
    <DormtrakLayout>
      <Routes>
        <Route index element={guardedRender(<DormtrakHome />)} />
        <Route path="policy" element={<DormtrakPolicy />} />
        <Route
          path="neighborhoods/:neighborhoodID"
          element={guardedRender(<DormtrakNeighborhood />)}
        />
        <Route path="dorms/:dormID" element={guardedRender(<DormtrakShow />)} />
        <Route
          path="reviews/new"
          element={guardedRender(<DormtrakReviewForm edit={false} />)}
        />
        <Route
          path="reviews/edit/:reviewID"
          element={guardedRender(<DormtrakReviewForm edit />)}
        />
        <Route path="search" element={guardedRender(<DormtrakSearch />)} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </DormtrakLayout>
  );
};

export default DormtrakMain;
