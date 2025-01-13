// React Imports
import React, { useEffect, useState } from "react";

// Component Imports
import Error404 from "../Errors/Error404";

// External Imports
import { Routes, Route } from "react-router-dom";
import DiningHome from "./DiningHome";
import DiningWhitmans from "./DiningWhitmans";
import DiningDriscoll from "./DiningDriscoll";
import DiningMission from "./DiningMission";

const DiningMain = () => {
  return (
    <DiningHome>
      <Routes>
        <Route path="whitmans" element={<DiningWhitmans />} />
        <Route path="driscoll" element={<DiningDriscoll />} />
        <Route path="mission" element={<DiningMission />} />
      </Routes>
    </DiningHome>
  );
};

export default DiningMain;
