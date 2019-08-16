// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Component imports
import "../../stylesheets/BulletinBox.css";

// API imports
import { getBulletins, getDiscussions, getRides } from "../../../api/bulletins";

import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

import { checkAndHandleError } from "../../../lib/general";

const BulletinBox = ({ token, type }) => {
  const [threads, updateThreads] = useState([]);

  useEffect(() => {
    const typeMap = new Map([
      ["Announcements", "Announcement"],
      ["Exchanges", "Exchange"],
      ["Lost And Found", "LostFound"],
      ["Jobs", "Job"],
    ]);

    const loadDiscussions = async () => {
      const loadParams = {
        offset: new Date(),
        limit: 5,
      };
      const discussionsResponse = await getDiscussions(token, loadParams);
      if (checkAndHandleError(discussionsResponse)) {
        updateThreads(discussionsResponse.data.data);
      } else updateThreads([]);
    };

    const loadRides = async () => {
      const loadParams = {
        offset: new Date(),
        limit: 5,
      };
      const ridesResponse = await getRides(token, loadParams);
      if (checkAndHandleError(ridesResponse)) {
        updateThreads(ridesResponse.data.data);
      } else updateThreads([]);
    };

    const loadBulletins = async () => {
      const loadParams = {
        offset: new Date(),
        limit: 5,
        type: typeMap.get(type),
      };
      const bulletinsResponse = await getBulletins(token, loadParams);
      if (checkAndHandleError(bulletinsResponse)) {
        updateThreads(bulletinsResponse.data.data);
      } else updateThreads([]);
    };

    if (type === "Discussions") loadDiscussions();
    else if (type === "Rides") loadRides();
    else loadBulletins();
  }, [token, type]);

  const date = (showDate) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };

    return new Date(showDate).toLocaleString("en-US", options);
  };

  return (
    <div className="bulletin">
      <div className="bulletin-title">
        <a className="bulletin-link" href="/">
          {type}
        </a>
      </div>

      <div className="bulletin-children-container">
        {threads.map((thread) => {
          return (
            <div className="bulletin-children" key={thread.id}>
              <a className="thread-link" href={`${type}/${thread.id}`}>
                {thread.title}
              </a>

              <span className="list-date">
                {date(thread.startDate ? thread.startDate : thread.lastActive)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

BulletinBox.propTypes = {
  // No isRequired because authentication not necessary for going to the homepage.
  token: PropTypes.string,
  type: PropTypes.string.isRequired,
};

BulletinBox.defaultProps = {
  token: "",
};

const mapStateToProps = (state) => ({
  token: getToken(state),
});

export default connect(mapStateToProps)(BulletinBox);
