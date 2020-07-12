// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Line } from "../../common/Skeleton";
import styles from "./BulletinBox.module.scss";

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

  // Generates the threadTitle
  const threadTitle = (thread) => {
    if (type === bulletinTypeRide) {
      const threadOffer = thread.offer ? "Offer" : "Request";
      return `${thread.source} to ${thread.destination} [${threadOffer}]`;
    }
    return thread.title;
  };

  // Generate bulletin title link
  const categoryLink = (text) => {
    if (type === discussionType) {
      return (
        <Link className={styles.bulletinLink} routeName="discussions">
          {text}
        </Link>
      );
    }

    return (
      <Link routeName="bulletins" routeParams={{ type }}>
        {text}
      </Link>
    );
  };

  const bulletinSkeleton = () =>
    [...Array(5)].map((_, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <div className={styles.bulletinChildren} key={i}>
        <Line width="90%" center />
      </div>
    ));

  const bulletinThread = (thread) => {
    // Generates thread Date
    const threadDate = () => {
      if (type === bulletinTypeRide) {
        return thread.date;
      }
      if (type === discussionType) {
        return thread.lastActive;
      }
      return thread.startDate;
    };

    const isRecent =
      new Date() - new Date(threadDate(thread)) < 7 * 1000 * 60 * 60 * 24;

    return (
      <div
        className={isRecent ? styles.bulletinActiveChild : styles.bulletinChild}
        key={thread.id}
      >
        {type === discussionType ? (
          <Link
            className={styles.threadLink}
            routeName="discussions.show"
            routeParams={{
              discussionID: thread.id,
            }}
          >
            {threadTitle(thread)}
          </Link>
        ) : (
          <Link
            className={styles.threadLink}
            routeName="bulletins.show"
            routeParams={{
              type,
              bulletinID: thread.id,
            }}
          >
            {threadTitle(thread)}
          </Link>
        )}
      </div>
    );
  };

  const bulletinThreads = () => {
    return (
      <div className={styles.bulletinChildrenContainer}>
        {threads
          ? threads.map((thread) => bulletinThread(thread))
          : bulletinSkeleton()}
        <div className={styles.seeAll}>{categoryLink("See All")}</div>
      </div>
    );
  };

  return (
    <div className={styles.bulletin}>
      <div className={styles.bulletinTitleDiv}>{categoryLink(typeWord)}</div>
      {bulletinThreads()}
    </div>
  );
};

BulletinBox.propTypes = {
  typeWord: PropTypes.string.isRequired,
  wso: PropTypes.object.isRequired,
};

BulletinBox.defaultProps = {};

const mapStateToProps = (state) => ({
  wso: getWSO(state),
});

export default connect(mapStateToProps)(BulletinBox);
