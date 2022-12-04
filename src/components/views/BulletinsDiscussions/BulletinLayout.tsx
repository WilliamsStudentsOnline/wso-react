// React imports
import React, { ReactNode } from "react";

// Redux and Routing imports
import { Link } from "react-router-dom";

// Additional imports
import { PostType, PostTypeName } from "../../../lib/types";

const BulletinLayout = ({
  children,
  type,
}: {
  children: ReactNode;
  type: PostType;
}) => {
  // specialized title for Lost + Found
  const titleGenerator = (type: PostType): string => {
    if (type === PostType.LostAndFound) {
      return "Lost + Found";
    }
    return PostTypeName.get(type) ?? "Bulletin";
  };

  // Generator for bulletin links
  const bulletinLinkGenerator = (bulletinType: PostType) => {
    return (
      <li>
        <Link to={`/bulletins/${bulletinType}`}>
          {titleGenerator(bulletinType)}
        </Link>
      </li>
    );
  };

  return (
    <>
      <header>
        <div className="page-head">
          <h1>
            <Link to={`/bulletins/${type}`}>{PostTypeName.get(type)}</Link>
          </h1>
          <ul>
            <li>
              <Link to={`/bulletins/${type}/new`}>
                {`New ${titleGenerator(type)} Post`}
              </Link>
            </li>
            {/* // Generate links for all bulletin types */}
            {bulletinLinkGenerator(PostType.Announcements)}
            {bulletinLinkGenerator(PostType.Exchanges)}
            {bulletinLinkGenerator(PostType.LostAndFound)}
            {bulletinLinkGenerator(PostType.Jobs)}
            {bulletinLinkGenerator(PostType.Rides)}
          </ul>
        </div>
      </header>
      <article className="main-table">{children}</article>
    </>
  );
};

export default BulletinLayout;
