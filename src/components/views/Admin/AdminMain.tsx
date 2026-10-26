import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminHome from "./AdminHome";
import AdminBanner from "./AdminBanner";
import Error404 from "../Errors/Error404";

const AdminMain = () => {
  return (
    <Routes>
      <Route index element={<AdminHome />} />
      <Route path="banner" element={<AdminBanner />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default AdminMain;
