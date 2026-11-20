// React imports
import React, { ReactNode } from "react";

import { ServiceHeader, ContentPane } from "../../ui";

export interface DiscussionLayoutProps {
  children: ReactNode;
}

const DiscussionLayout = ({ children }: DiscussionLayoutProps) => {
  return (
    <>
      <ServiceHeader
        title="Discussions"
        titleTo="/discussions"
        tabs={[
          { to: "/discussions", label: "Home", end: true },
          { to: "/discussions/new", label: "New" },
        ]}
      />
      <ContentPane variant="main-table">{children}</ContentPane>
    </>
  );
};

export default DiscussionLayout;
