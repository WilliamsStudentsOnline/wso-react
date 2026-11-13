// React imports
import React, { ReactNode } from "react";

// Additional imports
import { ServiceHeader, ContentPane, ServiceTab } from "../../ui";

const BulletinLayout = ({ children }: { children: ReactNode }) => {
  const tabs: ServiceTab[] = [
    {
      to: "/bulletin",
      label: "All",
      end: true,
    },
    {
      to: "/bulletin/new",
      label: "New Post",
    },
  ];

  return (
    <>
      <ServiceHeader title="Bulletin" titleTo="/bulletin" tabs={tabs} />
      <ContentPane variant="main-table">{children}</ContentPane>
    </>
  );
};

export default BulletinLayout;
