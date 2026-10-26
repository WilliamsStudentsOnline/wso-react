import React, { ReactElement } from "react";
import { ServiceHeader, ContentPane } from "../../ui";
import { adminNavTabs } from "./adminSections";
import "./Admin.css";

const AdminLayout = ({ children }: { children: ReactElement }) => {
  return (
    <div className="admin-console">
      <ServiceHeader
        title="Admin"
        titleTo="/admin"
        tabs={adminNavTabs()}
        className="admin-console__header"
      />
      <ContentPane variant="article" className="admin-console__body">
        {children}
      </ContentPane>
    </div>
  );
};

export default AdminLayout;
