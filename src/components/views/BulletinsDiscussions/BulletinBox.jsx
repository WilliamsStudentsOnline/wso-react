// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../stylesheets/BulletinBox.css";

// Redux/Routing imports
import { connect } from "react-redux";
import { getToken } from "../../../selectors/auth";

// API imports
import { getBulletins, getDiscussions, getRides } from "../../../api/bulletins";

// Additional imports
import { checkAndHandleError } from "../../../lib/general";
import { Link } from "react-router5";
import {
  bulletinTypeRide,
  bulletinTypeJob,
  discussionType,
  bulletinTypeLostAndFound,
  bulletinTypeExchange,
  bulletinTypeAnnouncement,
} from "../../../constants/general";

const BulletinBox = ({ token, typeWord }) => {
  const [threads, updateThreads] = useState([]);

  // Converts the typeWord to the type of bulletin/discussion to be obtained.
  const linkMap = new Map([
    ["Announcements", bulletinTypeAnnouncement],
    ["Exchanges", bulletinTypeExchange],
    ["Lost And Found", bulletinTypeLostAndFound],
    ["Jobs", bulletinTypeJob],
    ["Rides", bulletinTypeRide],
    ["Discussions", discussionType],
  ]);

  const type = linkMap.get(typeWord);

  // Load the appropriate discussionns/bulletins
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
        type,
      };
      const bulletinsResponse = await getBulletins(token, loadParams);
      if (checkAndHandleError(bulletinsResponse)) {
        updateThreads(bulletinsResponse.data.data);
      } else updateThreads([]);
    };

    if (type === discussionType) loadDiscussions();
    else if (type === bulletinTypeRide) loadRides();
    else loadBulletins();
  }, [token, type]);

  const formatDate = (showDate) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };

    return new Date(showDate).toLocaleString("en-US", options);
  };

  // Generates the threadTitle
  const threadTitle = (thread) => {
    if (type === bulletinTypeRide) {
      const threadOffer = thread.offer ? "Offer" : "Request";
      return `${thread.source} to ${thread.destination} [${threadOffer}]`;
    }
    return thread.title;
  };

  // Generates thread Date
  const threadDate = (thread) => {
    if (type === bulletinTypeRide) {
      return thread.date;
    }
    if (type === discussionType) {
      return thread.lastActive;
    }
    return thread.startDate;
  };

  // Generate bulletin title link
  const bulletinTitle = () => {
    if (type === discussionType) {
      return (
        <div className="bulletin-title">
          <Link className="bulletin-link" routeName="discussions">
            {typeWord}
          </Link>
        </div>
      );
    }

    return (
      <div className="bulletin-title">
        <Link
          className="bulletin-link"
          routeName="bulletins"
          routeParams={{ type }}
        >
          {typeWord}
        </Link>
      </div>
    );
  };

  const bulletinThreads = () => {
    return (
      <div className="bulletin-children-container">
        {threads.map((thread) => {
          return (
            <div className="bulletin-children" key={thread.id}>
              {type === discussionType ? (
                <Link
                  className="thread-link"
                  routeName="discussions.show"
                  routeParams={{
                    discussionID: thread.id,
                  }}
                >
                  {threadTitle(thread)}
                </Link>
              ) : (
                <Link
                  className="thread-link"
                  routeName="bulletins.show"
                  routeParams={{
                    type,
                    bulletinID: thread.id,
                  }}
                >
                  {threadTitle(thread)}
                </Link>
              )}

              <span className="list-date">
                {formatDate(threadDate(thread))}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bulletin">
      {bulletinTitle()}
      {bulletinThreads()}
    </div>
  );
};

BulletinBox.propTypes = {
  token: PropTypes.string.isRequired,
  typeWord: PropTypes.string.isRequired,
};

BulletinBox.defaultProps = {};

const mapStateToProps = (state) => ({
  token: getToken(state),
});

export default connect(mapStateToProps)(BulletinBox);
