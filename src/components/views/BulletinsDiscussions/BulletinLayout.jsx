// React imports
import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router5";

import { capitalize } from "../../../lib/general";

const BulletinLayout = ({ children, type }) => {
  if (!type) return null;
  return (
    <>
      <header>
        <div className="page-head">
          <h1>
            <Link routeName="bulletins" routeParams={{ type }}>
              {type === "lostAndFound" ? "Lost + Found" : capitalize(type)}
            </Link>
          </h1>
          <ul>
            <li>
              <Link routeName="bulletins.new" routeParams={{ type }}>
                {type === "lostAndFound"
                  ? "New Lost + Found Post"
                  : `New ${type} Post`}
              </Link>
            </li>
            <li>
              <Link
                routeName="bulletins"
                routeParams={{ type: "announcement" }}
                routeOptions={{ reload: true }}
              >
                Announcements
              </Link>
            </li>
            <li>
              <Link
                routeName="bulletins"
                routeParams={{ type: "exchange" }}
                routeOptions={{ reload: true }}
              >
                Exchanges
              </Link>
            </li>
            <li>
              <Link
                routeName="bulletins"
                routeParams={{ type: "lostAndFound" }}
                routeOptions={{ reload: true }}
              >
                Lost + Found
              </Link>
            </li>
            <li>
              <Link
                routeName="bulletins"
                routeParams={{ type: "job" }}
                routeOptions={{ reload: true }}
              >
                Jobs
              </Link>
            </li>
            <li>
              <Link
                routeName="bulletins"
                routeParams={{ type: "ride" }}
                routeOptions={{ reload: true }}
              >
                Rides
              </Link>
            </li>
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
