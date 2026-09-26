// React imports
import React, { ReactNode } from "react";

// Additional imports
import { PostType, PostTypeName } from "../../../lib/types";
import { ServiceHeader, ContentPane, ServiceTab } from "../../ui";

const BulletinLayout = ({
  children,
  type,
}: {
  children: ReactNode;
  type: PostType;
}) => {
  const titleGenerator = (bulletinType: PostType): string => {
    if (bulletinType === PostType.LostAndFound) {
      return "Lost + Found";
    }
    return PostTypeName.get(bulletinType) ?? "Bulletin";
  };

  const tabs: ServiceTab[] = [
    {
      to: `/bulletins/${type}/new`,
      label: `New ${titleGenerator(type)} Post`,
    },
    {
      to: `/bulletins/${PostType.Announcements}`,
      label: titleGenerator(PostType.Announcements),
    },
    {
      to: `/bulletins/${PostType.Exchanges}`,
      label: titleGenerator(PostType.Exchanges),
    },
    {
      to: `/bulletins/${PostType.LostAndFound}`,
      label: titleGenerator(PostType.LostAndFound),
    },
    {
      to: `/bulletins/${PostType.Jobs}`,
      label: titleGenerator(PostType.Jobs),
    },
    {
      to: `/bulletins/${PostType.Rides}`,
      label: titleGenerator(PostType.Rides),
    },
  ];

  return (
    <>
      <ServiceHeader
        title={PostTypeName.get(type)}
        titleTo={`/bulletins/${type}`}
        tabs={tabs}
      />
      <ContentPane variant="main-table">{children}</ContentPane>
    </>
  );
};

export default BulletinLayout;
