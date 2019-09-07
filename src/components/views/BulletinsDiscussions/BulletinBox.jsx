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

import { Link } from "react-router5";

const BulletinBox = ({ token, type }) => {
  // @TODO: make "type" consistent throughout all bulletin-related pages
  const [threads, updateThreads] = useState([]);
  const linkMap = new Map([
    ["Announcements", "announcement"],
    ["Exchanges", "exchange"],
    ["Lost And Found", "lostAndFound"],
    ["Jobs", "job"],
    ["Rides", "ride"],
    ["Discussions", "discussions"],
  ]);

  useEffect(() => {
    const loadDiscussions = async () => {
      const loadParams = {
        limit: 5,
      };
      const discussionsResponse = await getDiscussions(token, loadParams);
      if (checkAndHandleError(discussionsResponse)) {
        updateThreads(discussionsResponse.data.data);
      } else updateThreads([]);
    };

    const loadRides = async () => {
      const loadParams = {
        limit: 5,
      };
      const ridesResponse = await getRides(token, loadParams);
      if (checkAndHandleError(ridesResponse)) {
        updateThreads(ridesResponse.data.data);
      } else updateThreads([]);
    };

    const loadBulletins = async () => {
      const loadParams = {
        limit: 5,
        type: linkMap.get(type),
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

  const threadTitle = (thread) => {
    if (type === "Rides") {
      const threadOffer = thread.offer ? "Offer" : "Request";
      return `${thread.source} to ${thread.destination} [${threadOffer}]`;
    }
    return thread.title;
  };

  const threadDate = (thread) => {
    if (type === "Rides") {
      return thread.date;
    }
    if (type === "Discussions") {
      return thread.lastActive;
    }
    return thread.startDate;
  };

  return (
    <div className="bulletin">
      <div className="bulletin-title">
        {type !== "Discussions" ? (
          <Link
            className="bulletin-link"
            routeName="bulletins"
            routeParams={{ type: linkMap.get(type) }}
          >
            {type}
          </Link>
        ) : (
          <Link className="bulletin-link" routeName="discussions">
            {type}
          </Link>
        )}
      </div>

      <div className="bulletin-children-container">
        {threads.map((thread) => {
          return (
            <div className="bulletin-children" key={thread.id}>
              <Link
                className="thread-link"
                routeName="bulletins.show"
                routeParams={{
                  type: linkMap.get(type),
                  bulletinID: thread.id,
                }}
              >
                {threadTitle(thread)}
              </Link>

              <span className="list-date">{date(threadDate(thread))}</span>
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
