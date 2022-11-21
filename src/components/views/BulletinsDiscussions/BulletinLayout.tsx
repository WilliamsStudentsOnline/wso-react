// React imports
import React, { ReactNode } from "react";
import PropTypes from "prop-types";

// Redux and Routing imports
import { Link } from "react-router-dom";

// Additional imports
import { capitalize } from "../../../lib/general";
import {
  bulletinTypeAnnouncement,
  bulletinTypeExchange,
  bulletinTypeLostAndFound,
  bulletinTypeJob,
  bulletinTypeRide,
} from "../../../constants/general";

const BulletinLayout = ({
  children,
  type,
}: {
  children: ReactNode;
  type: string;
}) => {
  if (!type) return null;

  // Generator for bulletin links
  const bulletinLinkGenerator = (bulletinType: string, title: string) => {
    return (
      <li>
        <Link to={`/bulletins/${bulletinType}`}>{title}</Link>
      </li>
    );
  };

  return (
    <>
      <header>
        <div className="page-head">
          <h1>
            <Link to={`/bulletins/${type}`}>
              {type === bulletinTypeLostAndFound
                ? "Lost + Found"
                : capitalize(type)}
            </Link>
          </h1>
          <ul>
            <li>
              <Link to={`/bulletins/${type}/new`}>
                {type === bulletinTypeLostAndFound
                  ? "New Lost + Found Post"
                  : `New ${type} Post`}
              </Link>
            </li>
            {bulletinLinkGenerator(bulletinTypeAnnouncement, "Announcements")}
            {bulletinLinkGenerator(bulletinTypeExchange, "Exchanges")}
            {bulletinLinkGenerator(bulletinTypeLostAndFound, "Lost + Found")}
            {bulletinLinkGenerator(bulletinTypeJob, "Jobs")}
            {bulletinLinkGenerator(bulletinTypeRide, "Rides")}
          </ul>
        </div>
      </header>
      <article className="main-table">{children}</article>
    </>
  );
};

BulletinLayout.propTypes = {
  children: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};

BulletinLayout.defaultProps = {};

export default BulletinLayout;
