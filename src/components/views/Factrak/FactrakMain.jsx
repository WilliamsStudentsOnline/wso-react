// React imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import FactrakHome from "./FactrakHome";
import FactrakPolicy from "./FactrakPolicy";
import FactrakModerate from "./FactrakModerate";
import FactrakSurveyIndex from "./FactrakSurveyIndex";
import FactrakSurvey from "./FactrakSurvey";
import FactrakLayout from "./FactrakLayout";
import FactrakAOS from "./FactrakAOS";
import FactrakCourse from "./FactrakCourse";
import FactrakProfessor from "./FactrakProfessor";
import FactrakSearch from "./FactrakSearch";
import FactrakRankings from "./FactrakRankings";
import Error404 from "../Errors/Error404";

// Redux/ Router imports
import { useAppSelector } from "../../../lib/store";
import { getCurrUser, getAPIToken } from "../../../lib/authSlice";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Additional Imports
import { scopes, containsOneOfScopes } from "../../../lib/general";
import { userTypeStudent } from "../../../constants/general";

// Returns body only if the user has the respective scopes
const RequirePolicy = ({ token, children }) => {
  // only render children if API Token has the necessary scopes
  // by here token should not be empty (checked in App.jsx)
  if (
    containsOneOfScopes(token, [
      scopes.ScopeFactrakLimited,
      scopes.ScopeFactrakFull,
    ])
  ) {
    return children;
  }

  // otherwise, redirect to policy page
  return <Navigate to="/factrak/policy" replace />;
};

RequirePolicy.propTypes = {
  token: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const FactrakMain = () => {
  const currUser = useAppSelector(getCurrUser);
  const token = useAppSelector(getAPIToken);
  const navigateTo = useNavigate();

  // If the user is not a student - navigate to 403
  if (currUser?.type !== userTypeStudent) {
    navigateTo("/403");
  }

  return (
    <FactrakLayout>
      <Routes>
        <Route
          index
          element={
            <RequirePolicy token={token}>
              <FactrakHome />
            </RequirePolicy>
          }
        />
        <Route path="policy" element={<FactrakPolicy />} />
        <Route
          path="surveys"
          element={
            <RequirePolicy token={token}>
              <FactrakSurveyIndex />
            </RequirePolicy>
          }
        />
        <Route
          path="surveys/new/:profID"
          element={
            <RequirePolicy token={token}>
              <FactrakSurvey edit={false} />
            </RequirePolicy>
          }
        />
        <Route
          path="surveys/edit/:surveyID"
          element={
            <RequirePolicy token={token}>
              <FactrakSurvey edit />
            </RequirePolicy>
          }
        />
        <Route
          path="moderate"
          element={
            <RequirePolicy token={token}>
              <FactrakModerate />
            </RequirePolicy>
          }
        />
        <Route
          path="areasOfStudy/:area"
          element={
            <RequirePolicy token={token}>
              <FactrakAOS />
            </RequirePolicy>
          }
        />
        <Route
          path="courses/:courseID"
          element={
            <RequirePolicy token={token}>
              <FactrakCourse />
            </RequirePolicy>
          }
        />
        <Route
          path="courses/:courseID/:profID"
          element={
            <RequirePolicy token={token}>
              <FactrakCourse />
            </RequirePolicy>
          }
        />
        <Route
          path="professors/:profID"
          element={
            <RequirePolicy token={token}>
              <FactrakProfessor />
            </RequirePolicy>
          }
        />
        <Route
          path="search"
          element={
            <RequirePolicy token={token}>
              <FactrakSearch />
            </RequirePolicy>
          }
        />
        <Route
          path="rankings"
          element={
            <RequirePolicy token={token}>
              <FactrakRankings />
            </RequirePolicy>
          }
        />
        <Route
          path="rankings/:aos"
          element={
            <RequirePolicy token={token}>
              <FactrakRankings />
            </RequirePolicy>
          }
        />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </FactrakLayout>
  );
};

export default FactrakMain;
