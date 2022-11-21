// React Imports
import React from "react";

// Component Imports
import FacebookLayout from "./FacebookLayout";
import FacebookHome from "./FacebookHome";
import FacebookHelp from "./FacebookHelp";
import FacebookEdit from "./FacebookEdit";
import FacebookUser from "./FacebookUser";
import Error404 from "../Errors/Error404";

// External Imports
import { Routes, Route } from "react-router-dom";

const FacebookMain = () => {
  return (
    <FacebookLayout>
      <Routes>
        <Route index element={<FacebookHome />} />
        <Route path="help" element={<FacebookHelp />} />
        <Route path="users/:userID" element={<FacebookUser />} />
        <Route path="edit" element={<FacebookEdit />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </FacebookLayout>
  );
};

export default FacebookMain;
