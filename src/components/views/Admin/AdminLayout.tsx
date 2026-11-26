import React from "react";
import { ServiceHeader } from "../../ui";
import "./Admin.css";

const tabs = [
  { to: "/admin", label: "Tasks", end: true },
  { to: "/admin/banner", label: "Banner" },
  { to: "/admin/feedback", label: "Feedback" },
  { to: "/admin/jobs", label: "Jobs" },
  { to: "/admin/users", label: "Users" },
];

const AdminLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="admin">
      <div className="admin-shell admin-shell--header">
        <ServiceHeader title="Admin Console" titleTo="/admin" tabs={tabs} />
      </div>
      <div className="admin-shell admin-shell--body">{children}</div>
    </div>
  );
};

export default AdminLayout;
