import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import AdminTasks from "./AdminTasks";
import AdminBanner from "./AdminBanner";
import Error404 from "../Errors/Error404";

const AdminMain = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminTasks />} />
        <Route path="banner" element={<AdminBanner />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminMain;
