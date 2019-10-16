// React imports
import React from "react";
import PropTypes from "prop-types";

// Redux and Routing imports
import { Link } from "react-router5";

// Additional imports
import { capitalize } from "../../../lib/general";
import {
  bulletinTypeAnnouncement,
  bulletinTypeExchange,
  bulletinTypeLostAndFound,
  bulletinTypeJob,
  bulletinTypeRide,
} from "../../../constants/general";

const BulletinLayout = ({ children, type }) => {
  if (!type) return null;

  // Generator for bulletin links
  const bulletinLinkGenerator = (bulletinType, title) => {
    return (
      <li>
        <Link
          routeName="bulletins"
          routeParams={{ type: bulletinType }}
          routeOptions={{ reload: true }}
        >
          {title}
        </Link>
      </li>
    );
  };

  return (
    <>
      <header>
        <div className="page-head">
          <h1>
            <Link routeName="bulletins" routeParams={{ type }}>
              {type === bulletinTypeLostAndFound
                ? "Lost + Found"
                : capitalize(type)}
            </Link>
          </h1>
          <ul>
            <li>
              <Link routeName="bulletins.new" routeParams={{ type }}>
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
