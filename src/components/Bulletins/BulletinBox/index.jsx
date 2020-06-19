// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./BulletinBox.css";
import { Line } from "../../common/Skeleton";

// Redux/Routing imports
import { connect } from "react-redux";
import { getWSO } from "../../../selectors/auth";

// Additional imports
import { Link } from "react-router5";
import {
  bulletinTypeRide,
  bulletinTypeJob,
  discussionType,
  bulletinTypeLostAndFound,
  bulletinTypeExchange,
  bulletinTypeAnnouncement,
} from "../../../constants/general";

const BulletinBox = ({ wso, typeWord }) => {
  const [threads, updateThreads] = useState(null);

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

  // Load the appropriate discussions/bulletins
  useEffect(() => {
    let isMounted = true;
    const loadParams = { limit: 5, type };

    const getThreads = async () => {
      let response;
      if (type === discussionType) {
        response = await wso.bulletinService.listDiscussions(loadParams);
      } else if (type === bulletinTypeRide) {
        response = await wso.bulletinService.listRides(loadParams);
      } else {
        response = await wso.bulletinService.listBulletins(loadParams);
      }
      if (isMounted) {
        updateThreads(response.data);
      }
    };

    try {
      if (wso.isAuthenticated()) {
        getThreads();
      }
    } catch (e) {
      // We aren't really expecting any errors here, unless the token is empty for some reason.
      updateThreads([]);
    }

    return () => {
      isMounted = false;
    };
  }, [wso, type]);

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

  const bulletinSkeleton = () =>
    [...Array(5)].map((_, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <div className="bulletin-children" key={i}>
        <Line width="90%" center />

        <span className="list-date">
          <Line width="90%" center />
        </span>
      </div>
    ));

  const bulletinThreads = () => {
    return (
      <div className="bulletin-children-container">
        {threads
          ? threads.map((thread) => {
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
            })
          : bulletinSkeleton()}
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
  wso: PropTypes.object.isRequired,
  typeWord: PropTypes.string.isRequired,
};

BulletinBox.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

export default connect(mapStateToProps)(BulletinBox);
