import React from "react";
import { ServiceHeader } from "../../ui";

const AdminLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="facebook">
      <ServiceHeader title="Admin" titleTo="/admin" />
      {children}
    </div>
  );
};

export default AdminLayout;
