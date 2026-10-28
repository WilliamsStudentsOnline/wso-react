// React imports
import React, { ReactNode } from "react";

// Additional imports
import { ServiceHeader, ContentPane, ServiceTab } from "../../ui";

const BulletinLayout = ({ children }: { children: ReactNode }) => {
  const tabs: ServiceTab[] = [
    {
      to: "/bulletins",
      label: "All",
      end: true,
    },
    {
      to: "/bulletins/new",
      label: "New Post",
    },
  ];

  return (
    <>
      <ServiceHeader title="Bulletin" titleTo="/bulletins" tabs={tabs} />
      <ContentPane variant="main-table">{children}</ContentPane>
    </>
  );
};

export default BulletinLayout;
