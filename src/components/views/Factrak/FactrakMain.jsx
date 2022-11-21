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
import { getCurrUser, getAPIToken } from "../../../reducers/authSlice";
import { Routes, Route, useNavigate } from "react-router-dom";

// Additional Imports
import { scopes, containsOneOfScopes } from "../../../lib/general";
import { userTypeStudent } from "../../../constants/general";

const FactrakMain = () => {
  const currUser = useAppSelector(getCurrUser);
  const token = useAppSelector(getAPIToken);
  const navigateTo = useNavigate();

  // If the user is not a student - navigate to 403
  if (currUser?.type !== userTypeStudent) {
    navigateTo("/403");
  }

  // TODO: this is smart, maybe also apply this to DormtrakMain
  // Returns body only if the user has the respective scopes
  if (
    !containsOneOfScopes(token, [
      scopes.ScopeFactrakLimited,
      scopes.ScopeFactrakFull,
    ])
  ) {
    return (
      <FactrakLayout>
        <FactrakPolicy />
      </FactrakLayout>
    );
  }

  return (
    <FactrakLayout>
      <Routes>
        <Route index element={<FactrakHome />} />
        <Route path="policy" element={<FactrakPolicy />} />
        <Route path="surveys" element={<FactrakSurveyIndex />} />
        <Route
          path="surveys/new/:profID"
          element={<FactrakSurvey edit={false} />}
        />
        <Route path="surveys/edit/:surveyID" element={<FactrakSurvey edit />} />
        <Route path="moderate" element={<FactrakModerate />} />
        <Route path="areasOfStudy/:area" element={<FactrakAOS />} />
        <Route path="courses/:courseID" element={<FactrakCourse />} />
        <Route path="courses/:courseID/:profID" element={<FactrakCourse />} />
        <Route path="professors/:profID" element={<FactrakProfessor />} />
        <Route path="search" element={<FactrakSearch />} />
        <Route path="rankings" element={<FactrakRankings />} />
        <Route path="rankings/:aos" element={<FactrakRankings />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </FactrakLayout>
  );
};

export default FactrakMain;
