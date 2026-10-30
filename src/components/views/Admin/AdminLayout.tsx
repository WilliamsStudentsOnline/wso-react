import React from "react";
import { ServiceHeader } from "../../ui";
import "./Admin.css";

const tabs = [
  { to: "/admin", label: "Tasks", end: true },
  { to: "/admin/banner", label: "Banner" },
  { to: "/admin/feedback", label: "Feedback" },
];

const AdminLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="admin">
      <div className="admin-shell">
        <ServiceHeader title="Admin Console" titleTo="/admin" tabs={tabs} />
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
