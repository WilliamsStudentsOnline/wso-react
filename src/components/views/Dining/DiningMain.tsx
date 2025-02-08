// React Imports
import React from "react";

// External Imports
import { Routes, Route } from "react-router-dom";
import DiningHome from "./DiningHome";
import DiningWhitmans from "./DiningWhitmans";
import DiningDriscoll from "./DiningDriscoll";
import DiningMission from "./DiningMission";
import DiningHours from "./DiningHours";

const DiningMain = () => {
  return (
    <DiningHome>
      <Routes>
        <Route index element={<DiningHours />} />
        <Route path="whitmans" element={<DiningWhitmans />} />
        <Route path="driscoll" element={<DiningDriscoll />} />
        <Route path="mission" element={<DiningMission />} />
      </Routes>
    </DiningHome>
  );
};

export default DiningMain;
